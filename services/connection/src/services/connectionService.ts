import db from "@shared/config/db";

// Use local models for testing compatibility
import {
  Connection,
  Follow,
  BlockedUser,
  MessageRequest,
  UserPreferences,
  ConnectionStatus,
} from "../models";

class ConnectionService {
  // Search for users
  async searchUsers(
    query: string,
    currentUserId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    // Create a normalized search query
    const searchQuery = query
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => term + ":*")
      .join(" | ");

    const result = await db.query(
      `
        SELECT 
          u.user_id, 
          u.first_name, 
          u.last_name,
          u.profile_picture_id,
          u.bio,
          u.industry,
          u.location,
          ts_rank_cd(
            setweight(to_tsvector('english', coalesce(first_name, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(last_name, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(industry, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(bio, '')), 'C'),
            to_tsquery('english', $1)
          ) as search_rank
        FROM user_service.profiles u
        WHERE 
          (
            -- Full text search with weighted terms
            to_tsvector('english',
              coalesce(first_name, '') || ' ' ||
              coalesce(last_name, '') || ' ' ||
              coalesce(industry, '') || ' ' ||
              coalesce(bio, '')
            ) @@ to_tsquery('english', $1)
            -- Fallback to ILIKE for partial matches
            OR lower(first_name) LIKE lower($2)
            OR lower(last_name) LIKE lower($2)
            OR lower(industry) LIKE lower($2)
          )
          AND u.user_id != $3
          AND NOT EXISTS(
            SELECT 1 FROM connection_service.blocked_users b
            WHERE (b.user_id = $3 AND b.blocked_user_id = u.user_id)
               OR (b.user_id = u.user_id AND b.blocked_user_id = $3)
          )
        ORDER BY 
          search_rank DESC,
          first_name ASC,
          last_name ASC
        LIMIT $4 OFFSET $5
      `,
      [searchQuery, `%${query}%`, currentUserId, limit, offset]
    );

    const countResult = await db.query(
      `
        SELECT COUNT(*) 
        FROM user_service.profiles u
        WHERE 
          (
            to_tsvector('english',
              coalesce(first_name, '') || ' ' ||
              coalesce(last_name, '') || ' ' ||
              coalesce(industry, '') || ' ' ||
              coalesce(bio, '')
            ) @@ to_tsquery('english', $1)
            OR lower(first_name) LIKE lower($2)
            OR lower(last_name) LIKE lower($2)
            OR lower(industry) LIKE lower($2)
          )
          AND u.user_id != $3
          AND NOT EXISTS(
            SELECT 1 FROM connection_service.blocked_users b
            WHERE (b.user_id = $3 AND b.blocked_user_id = u.user_id)
               OR (b.user_id = u.user_id AND b.blocked_user_id = $3)
          )
      `,
      [searchQuery, `%${query}%`, currentUserId]
    );

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
      },
    };
  }

  /**
   * Get connection status between two users
   * @param userId - Current user ID
   * @param targetUserId - Target user ID
   * @returns Connection status (connected, pending, notConnected)
   */
  async getConnectionStatus(
    userId: number,
    targetUserId: number
  ): Promise<{ status: string; direction?: string }> {
    // Check if users are blocked
    const isBlocked = await db.query(
      `SELECT 1 FROM connection_service.blocked_users
       WHERE (user_id = $1 AND blocked_user_id = $2)
          OR (user_id = $2 AND blocked_user_id = $1)`,
      [userId, targetUserId]
    );

    if (isBlocked.rows.length > 0) {
      return { status: "notConnected" };
    }

    // Check connection status
    const connection = await db.query(
      `SELECT status, request_direction 
       FROM connection_service.connections
       WHERE user_id = $1 AND connection_id = $2`,
      [userId, targetUserId]
    );

    if (connection.rows.length > 0) {
      const { status, request_direction } = connection.rows[0];
      if (status === "accepted") {
        return { status: "connected" };
      } else if (status === "pending") {
        return {
          status: "pending",
          direction: request_direction,
        };
      } else {
        return { status: "notConnected" };
      }
    }

    return { status: "notConnected" };
  }

  /**
   * Check if a user follows another user
   * @param followerId - Current user ID (potential follower)
   * @param followingId - Target user ID (potential being followed)
   * @returns Whether the follower follows the following user
   */
  async getFollowStatus(
    followerId: number,
    followingId: number
  ): Promise<{ isFollowing: boolean }> {
    const result = await db.query(
      `SELECT 1 FROM connection_service.follows
       WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId]
    );

    return { isFollowing: result.rows.length > 0 };
  }

  /**
   * Get user preferences for a specific user
   * @param userId - ID of the user to get preferences for
   * @returns User's connection preferences
   */
  async getUserPreferences(userId: number): Promise<UserPreferences | null> {
    let result = await db.query<UserPreferences>(
      `
      SELECT * FROM connection_service.user_preferences
      WHERE user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      // Insert if missing 3shn ana zh2t
      result = await db.query(
        `
        INSERT INTO connection_service.user_preferences (user_id, allow_connection_requests, 
          allow_messages_from, visible_to_public, visible_to_connections, visible_to_network, show_followers)
        VALUES ($1, true, 'all', true, true, true, true)
        RETURNING *
      `,
        [userId]
      );
    }

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Get mutual connections between two users
   * @param userId - Current user ID
   * @param targetUserId - Target user ID to find mutual connections with
   * @param page - Page number
   * @param limit - Results per page
   * @returns Paginated list of mutual connections
   */
  async getMutualConnections(
    userId: number,
    targetUserId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    // Get mutual connections using SQL intersect
    const result = await db.query(
      `
    WITH user1_connections AS (
      SELECT connection_id 
      FROM connection_service.connections 
      WHERE user_id = $1 AND status = 'accepted'
      UNION
      SELECT user_id 
      FROM connection_service.connections 
      WHERE connection_id = $1 AND status = 'accepted'
    ),
    user2_connections AS (
      SELECT connection_id 
      FROM connection_service.connections 
      WHERE user_id = $2 AND status = 'accepted'
      UNION
      SELECT user_id 
      FROM connection_service.connections 
      WHERE connection_id = $2 AND status = 'accepted'
    ),
    mutual_ids AS (
      SELECT connection_id FROM user1_connections
      INTERSECT
      SELECT connection_id FROM user2_connections
    )
    SELECT 
      u.user_id, 
      u.first_name, 
      u.last_name, 
      u.profile_picture_id, 
      u.bio
    FROM mutual_ids m
    JOIN user_service.profiles u ON m.connection_id = u.user_id
    ORDER BY u.first_name, u.last_name
    LIMIT $3 OFFSET $4
  `,
      [userId, targetUserId, limit, offset]
    );

    // Count total mutual connections
    const countResult = await db.query(
      `
    WITH user1_connections AS (
      SELECT connection_id 
      FROM connection_service.connections 
      WHERE user_id = $1 AND status = 'accepted'
    ),
    user2_connections AS (
      SELECT connection_id 
      FROM connection_service.connections 
      WHERE user_id = $2 AND status = 'accepted'
    ),
    mutual_ids AS (
      SELECT connection_id FROM user1_connections
      INTERSECT
      SELECT connection_id FROM user2_connections
    )
    SELECT COUNT(*) FROM mutual_ids
  `,
      [userId, targetUserId]
    );

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
      },
    };
  }

  /**
   * Get messaging requests for a user
   * @param userId - ID of the user to get messaging requests for
   * @param direction - Filter by 'incoming' or 'outgoing' requests (optional)
   * @param status - Filter by request status (optional)
   * @returns List of messaging requests
   */
  async getMessagingRequests(
    userId: number,
    direction?: "incoming" | "outgoing",
    status?: ConnectionStatus
  ) {
    let query = `
      SELECT 
        mr.id, mr.message, mr.created_at, mr.status,
        u.user_id as user_id, u.first_name, u.last_name, u.profile_picture_id, u.bio
      FROM connection_service.messaging_requests mr
    `;

    const params: any[] = [userId];

    if (direction === "incoming") {
      query += ` JOIN user_service.profiles u ON mr.sender_id = u.user_id
                 WHERE mr.recipient_id = $1`;
    } else if (direction === "outgoing") {
      query += ` JOIN user_service.profiles u ON mr.recipient_id = u.user_id
                 WHERE mr.sender_id = $1`;
    } else {
      query += ` JOIN user_service.profiles u ON 
                   (mr.sender_id = u.user_id AND mr.recipient_id = $1) OR
                   (mr.recipient_id = u.user_id AND mr.sender_id = $1)
                 WHERE mr.sender_id = $1 OR mr.recipient_id = $1`;
    }

    if (status) {
      query += ` AND mr.status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY mr.created_at DESC`;

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Delete a connection request
   * @param params - Object containing the request ID and the user ID
   * @returns true if successful
   */
  async deleteConnectionRequest(params: {
    requestId: number;
    userId: number;
  }): Promise<boolean> {
    // First check if the request exists and belongs to this user
    const request = await db.query<Connection>(
      `
      SELECT * FROM connection_service.connections
      WHERE id = $1 AND user_id = $2 AND status = 'pending'
      FOR UPDATE
      `,
      [params.requestId, params.userId]
    );

    if (request.rows.length === 0) {
      throw new Error("Connection request not found or not in pending state");
    }

    const connection = request.rows[0];

    // Delete both connection records in a transaction
    await db.query(
      `
      DELETE FROM connection_service.connections
      WHERE (user_id = $1 AND connection_id = $2) OR
            (user_id = $2 AND connection_id = $1)
      `,
      [params.userId, connection.connection_id]
    );

    return true;
  }

  // Connection management
  async sendConnectionRequest(params: {
    senderId: number;
    recipientId: number;
    message?: string;
  }): Promise<Connection> {
    // Check if recipient allows connection requests (with lock)
    const preferences = await this.getUserPreferences(params.recipientId);

    if (!preferences || !preferences.allow_connection_requests) {
      throw new Error("User does not accept connection requests");
    }

    // Check if blocked (with lock)
    const isBlocked = await db.query(
      `
      SELECT 1 FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
      FOR UPDATE
    `,
      [params.recipientId, params.senderId]
    );

    if (isBlocked.rows.length > 0) {
      throw new Error("Cannot send request to this user");
    }

    // Check if connection already exists (with lock)
    const existingConnection = await db.query(
      `
      SELECT 1 FROM connection_service.connections
      WHERE user_id = $1 AND connection_id = $2
      FOR UPDATE
    `,
      [params.senderId, params.recipientId]
    );

    if (existingConnection.rows.length > 0) {
      throw new Error("Connection request already exists");
    }

    // Create both connection records in a single query using CTE
    const result = await db.query<Connection>(
      `
      WITH sender_connection AS (
        INSERT INTO connection_service.connections (
          user_id, connection_id, status, request_direction, message
        ) VALUES ($1, $2, 'pending', 'outgoing', $3)
        RETURNING *
      ),
      recipient_connection AS (
        INSERT INTO connection_service.connections (
          user_id, connection_id, status, request_direction, message
        ) VALUES ($2, $1, 'pending', 'incoming', $3)
      )
      SELECT * FROM sender_connection
    `,
      [params.senderId, params.recipientId, params.message]
    );

    return result.rows[0];
  }

  async respondToConnectionRequest(params: {
    requestId: number;
    userId: number;
    accept: boolean;
  }): Promise<{ status: ConnectionStatus }> {
    // Get and lock the request
    const request = await db.query<Connection>(
      `
      SELECT * FROM connection_service.connections
      WHERE id = $1 AND user_id = $2 AND request_direction = 'incoming'
      FOR UPDATE
    `,
      [params.requestId, params.userId]
    );

    if (request.rows.length === 0) {
      throw new Error("Connection request not found");
    }

    const connection = request.rows[0];
    console.log(params.accept);
    const newStatus = params.accept
      ? ConnectionStatus.ACCEPTED
      : ConnectionStatus.DECLINED;

    // Update recipient's connection record
    await db.query(
      `
      UPDATE connection_service.connections
      SET status = $1, updated_at = NOW()
      WHERE user_id = $2 AND connection_id = $3
    `,
      [newStatus, params.userId, connection.connection_id]
    );

    // Update sender's connection record
    await db.query(
      `
      UPDATE connection_service.connections
      SET status = $1, updated_at = NOW()
      WHERE user_id = $2 AND connection_id = $3
    `,
      [newStatus, connection.connection_id, params.userId]
    );

    return { status: newStatus };
  }

  async removeConnection(params: { userId: number; connectionId: number }) {
    await db.query(
      `
      DELETE FROM connection_service.connections
      WHERE (user_id = $1 AND connection_id = $2)
         OR (user_id = $2 AND connection_id = $1)
    `,
      [params.userId, params.connectionId]
    );
  }

  async getConnections(
    userId: number,
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        u.user_id, u.first_name, u.last_name, u.profile_picture_id, u.bio,
        c.created_at as connected_at
      FROM connection_service.connections c
      JOIN user_service.profiles u ON c.connection_id = u.user_id
      WHERE c.user_id = $1 AND c.status = 'accepted'
    `;
    const params: any[] = [userId];

    if (search) {
      query += ` AND (u.first_name ILIKE $2 OR u.last_name ILIKE $2)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY u.first_name, u.last_name LIMIT $${
      params.length + 1
    } OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    const countResult = await db.query(
      `SELECT COUNT(*) FROM connection_service.connections WHERE user_id = $1 AND status = 'accepted'`,
      [userId]
    );

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
      },
    };
  }

  async getPendingRequests(
    userId: number,
    direction?: "incoming" | "outgoing"
  ) {
    let query = `
      SELECT 
        c.id, c.message, c.created_at,
        u.user_id as user_id, u.first_name, u.last_name, u.profile_picture_id, u.bio
      FROM connection_service.connections c
      JOIN user_service.profiles u ON c.connection_id = u.user_id
      WHERE c.user_id = $1 AND c.status = 'pending'
    `;
    const params: any[] = [userId];

    if (direction) {
      query += ` AND c.request_direction = $2`;
      params.push(direction);
    }

    query += ` ORDER BY c.created_at DESC`;

    const result = await db.query(query, params);
    return result.rows;
  }

  // Following
  async followUser(params: { followerId: number; followingId: number }) {
    await db.query(
      `
      INSERT INTO connection_service.follows (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, following_id) DO NOTHING
    `,
      [params.followerId, params.followingId]
    );
  }

  async unfollowUser(params: { followerId: number; followingId: number }) {
    await db.query(
      `
      DELETE FROM connection_service.follows
      WHERE follower_id = $1 AND following_id = $2
    `,
      [params.followerId, params.followingId]
    );
  }

  // Blocking
  async blockUser(params: {
    userId: number;
    blockedUserId: number;
  }): Promise<BlockedUser> {
    // First check if already blocked to avoid unnecessary operations
    const existingBlock = await db.query<BlockedUser>(
      `
      SELECT * FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
      FOR UPDATE
    `,
      [params.userId, params.blockedUserId]
    );

    if (existingBlock.rows.length > 0) {
      return existingBlock.rows[0];
    }

    // Remove connections (both directions in single query)
    await db.query(
      `
      DELETE FROM connection_service.connections
      WHERE (user_id = $1 AND connection_id = $2)
         OR (user_id = $2 AND connection_id = $1)
    `,
      [params.userId, params.blockedUserId]
    );

    // Remove follows (both directions in single query)
    await db.query(
      `
      DELETE FROM connection_service.follows
      WHERE (follower_id = $1 AND following_id = $2)
         OR (follower_id = $2 AND following_id = $1)
    `,
      [params.userId, params.blockedUserId]
    );

    // Add to blocked list
    const result = await db.query<BlockedUser>(
      `
      INSERT INTO connection_service.blocked_users (user_id, blocked_user_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, blocked_user_id) DO NOTHING
      RETURNING *
    `,
      [params.userId, params.blockedUserId]
    );

    return result.rows[0];
  }

  async unblockUser(params: { userId: number; blockedUserId: number }) {
    await db.query(
      `
      DELETE FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
    `,
      [params.userId, params.blockedUserId]
    );
  }

  async getBlockedUsers(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const result = await db.query(
      `
      SELECT 
        u.user_id, u.first_name, u.last_name, u.profile_picture_id,
        b.created_at as blocked_at
      FROM connection_service.blocked_users b
      JOIN user_service.profiles u ON b.blocked_user_id = u.user_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset]
    );

    const countResult = await db.query(
      `
      SELECT COUNT(*) FROM connection_service.blocked_users WHERE user_id = $1
    `,
      [userId]
    );

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
      },
    };
  }

  // Messaging
  async sendMessageRequest(params: {
    senderId: number;
    recipientId: number;
    message: string;
  }): Promise<MessageRequest> {
    // First check if recipient exists and get preferences
    const preferences = await db.query<{
      allow_messages_from: "all" | "none" | "connections_only";
    }>(
      `
      SELECT allow_messages_from 
      FROM connection_service.user_preferences
      WHERE user_id = $1
      FOR UPDATE
    `,
      [params.recipientId]
    );

    if (preferences.rows.length === 0) {
      throw new Error("User not found");
    }

    const pref = preferences.rows[0].allow_messages_from;

    // Check message preferences
    if (pref === "none") {
      throw new Error("User does not accept messages");
    }

    if (pref === "connections_only") {
      const isConnected = await db.query(
        `
        SELECT 1 FROM connection_service.connections
        WHERE user_id = $1 AND connection_id = $2 AND status = 'accepted'
        FOR UPDATE
      `,
        [params.recipientId, params.senderId]
      );

      if (isConnected.rows.length === 0) {
        throw new Error("User only accepts messages from connections");
      }
    }

    // Check if blocked
    const isBlocked = await db.query(
      `
      SELECT 1 FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
      FOR UPDATE
    `,
      [params.recipientId, params.senderId]
    );

    if (isBlocked.rows.length > 0) {
      throw new Error("Cannot send message to this user");
    }

    // Create message request
    const result = await db.query<MessageRequest>(
      `
      INSERT INTO connection_service.messaging_requests (
        sender_id, recipient_id, message
      ) VALUES ($1, $2, $3)
      RETURNING *
    `,
      [params.senderId, params.recipientId, params.message]
    );

    return result.rows[0];
  }

  async respondToMessageRequest(params: {
    requestId: number;
    userId: number;
    accept: boolean;
  }) {
    console.log("accept:", params.accept);
    const result = await db.query<MessageRequest>(
      `
      UPDATE connection_service.messaging_requests
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND recipient_id = $3
      RETURNING *
    `,
      [params.accept ? "accepted" : "declined", params.requestId, params.userId]
    );

    if (result.rows.length === 0) {
      throw new Error("Message request not found");
    }

    return result.rows[0];
  }

  // Preferences
  async updateConnectionPreferences(params: {
    userId: number;
    allow_connection_requests?: boolean;
    allow_messages_from?: "all" | "none" | "connections_only";
    visible_to_public?: boolean;
    visible_to_connections?: boolean;
    visible_to_network?: boolean;
    show_followers?: boolean;
  }) {
    console.log("Raw params:", params);
    console.log("Object.keys(params):", Object.keys(params));
    console.log(
      "Filtered keys:",
      Object.keys(params).filter((k) => k !== "userId")
    );

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (params.allow_connection_requests !== undefined) {
      fields.push(`allow_connection_requests = $${paramIndex++}`);
      values.push(params.allow_connection_requests);
    }
    if (params.allow_messages_from !== undefined) {
      fields.push(`allow_messages_from = $${paramIndex++}`);
      values.push(params.allow_messages_from);
    }
    if (params.visible_to_public !== undefined) {
      fields.push(`visible_to_public = $${paramIndex++}`);
      values.push(params.visible_to_public);
    }
    if (params.visible_to_connections !== undefined) {
      fields.push(`visible_to_connections = $${paramIndex++}`);
      values.push(params.visible_to_connections);
    }
    if (params.visible_to_network !== undefined) {
      fields.push(`visible_to_network = $${paramIndex++}`);
      values.push(params.visible_to_network);
    }
    if (params.show_followers !== undefined) {
      fields.push(`show_followers = $${paramIndex++}`);
      values.push(params.show_followers);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(params.userId);

    console.log("Fields array:", fields);
    console.log("Values array:", values);
    console.log("ParamIndex:", paramIndex);

    const query = `
      INSERT INTO connection_service.user_preferences (
        user_id, ${Object.keys(params)
          .filter((k) => k !== "userId")
          .join(", ")}
      ) VALUES (
        $${paramIndex}, ${Array.from(
      { length: fields.length },
      (_, i) => `$${i + 1}`
    ).join(", ")}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        ${fields.join(", ")},
        updated_at = NOW()
      RETURNING *
    `;

    console.log("Final query:", query);
    console.log("Final values:", [...values.slice(0, -1), params.userId]);

    const result = await db.query<UserPreferences>(query, [
      ...values.slice(0, -1),
      params.userId,
    ]);

    return result.rows[0];
  }

  /**
   * Check if a user can view another user's followers
   * @param viewerId - ID of the user trying to view
   * @param targetUserId - ID of the user whose followers are being viewed
   * @returns Whether the viewer can see the target's followers
   */
  async canViewFollowers(
    viewerId: number,
    targetUserId: number
  ): Promise<boolean> {
    // Get the target user's preferences
    const preferences = await db.query<{ show_followers: boolean }>(
      `SELECT show_followers FROM connection_service.user_preferences WHERE user_id = $1`,
      [targetUserId]
    );

    // If no preferences or followers are hidden
    if (preferences.rows.length === 0 || !preferences.rows[0].show_followers) {
      // Check if they're connected (connections can see each other's followers)
      const isConnected = await db.query(
        `SELECT 1 FROM connection_service.connections 
         WHERE user_id = $1 AND connection_id = $2 AND status = 'accepted'`,
        [targetUserId, viewerId]
      );

      // Only connections can view
      return isConnected.rows.length > 0;
    }

    // If show_followers is true, anyone can view (except blocked users)
    const isBlocked = await db.query(
      `SELECT 1 FROM connection_service.blocked_users
       WHERE (user_id = $1 AND blocked_user_id = $2)
          OR (user_id = $2 AND blocked_user_id = $1)`,
      [targetUserId, viewerId]
    );

    return isBlocked.rows.length === 0;
  }

  /**
   * Get a user's followers
   * @param userId - ID of the user to get followers for
   * @param page - Page number
   * @param limit - Results per page
   * @returns Paginated list of followers
   */
  async getFollowers(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Get followers
    const result = await db.query(
      `SELECT 
        p.user_id, p.first_name, p.last_name, p.profile_picture_id, p.bio,
        f.created_at as followed_at
      FROM connection_service.follows f
      JOIN user_service.profiles p ON f.follower_id = p.user_id
      WHERE f.following_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Count total
    const countResult = await db.query(
      `SELECT COUNT(*) FROM connection_service.follows WHERE following_id = $1`,
      [userId]
    );

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
      },
    };
  }

  /**
   * Get connections of connections (network/2nd degree connections)
   * @param userId - The user ID to get network for
   * @param page - Page number
   * @param limit - Results per page
   * @returns Paginated list of 2nd degree connections
   */
  async getConnectionsOfConnections(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    // Get connections of connections (1st level mutual/2nd degree)
    const result = await db.query(
      `
      WITH user_connections AS (
        -- Get all direct connections of the user
        SELECT connection_id AS user_id 
        FROM connection_service.connections 
        WHERE user_id = $1 AND status = 'accepted'
        UNION
        SELECT user_id 
        FROM connection_service.connections 
        WHERE connection_id = $1 AND status = 'accepted'
      ),
      connections_of_connections AS (
        -- Get connections of each direct connection
        SELECT DISTINCT c2.connection_id AS user_id
        FROM user_connections uc
        JOIN connection_service.connections c2 ON uc.user_id = c2.user_id 
        WHERE c2.status = 'accepted' AND c2.connection_id != $1
        UNION
        SELECT DISTINCT c2.user_id
        FROM user_connections uc
        JOIN connection_service.connections c2 ON uc.user_id = c2.connection_id
        WHERE c2.status = 'accepted' AND c2.user_id != $1
      ),
      filtered_connections AS (
        -- Remove direct connections from the results
        SELECT coc.user_id
        FROM connections_of_connections coc
        WHERE NOT EXISTS (
          SELECT 1 FROM user_connections uc WHERE uc.user_id = coc.user_id
        )
      )
      SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name, 
        u.profile_picture_id, 
        u.bio, 
        u.industry,
        (
          SELECT COUNT(*) FROM user_connections uc
          JOIN connection_service.connections c ON 
            (c.user_id = uc.user_id AND c.connection_id = fc.user_id AND c.status = 'accepted')
            OR
            (c.connection_id = uc.user_id AND c.user_id = fc.user_id AND c.status = 'accepted')
        ) AS mutual_connection_count
      FROM filtered_connections fc
      JOIN user_service.profiles u ON fc.user_id = u.user_id
      -- Exclude blocked users
      WHERE NOT EXISTS(
        SELECT 1 FROM connection_service.blocked_users b
        WHERE (b.user_id = $1 AND b.blocked_user_id = u.user_id)
           OR (b.user_id = u.user_id AND b.blocked_user_id = $1)
      )
      ORDER BY mutual_connection_count DESC, u.first_name, u.last_name
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset]
    );

    // Count total network connections
    const countResult = await db.query(
      `
      WITH user_connections AS (
        SELECT connection_id AS user_id 
        FROM connection_service.connections 
        WHERE user_id = $1 AND status = 'accepted'
        UNION
        SELECT user_id 
        FROM connection_service.connections 
        WHERE connection_id = $1 AND status = 'accepted'
      ),
      connections_of_connections AS (
        SELECT DISTINCT c2.connection_id AS user_id
        FROM user_connections uc
        JOIN connection_service.connections c2 ON uc.user_id = c2.user_id 
        WHERE c2.status = 'accepted' AND c2.connection_id != $1
        UNION
        SELECT DISTINCT c2.user_id
        FROM user_connections uc
        JOIN connection_service.connections c2 ON uc.user_id = c2.connection_id
        WHERE c2.status = 'accepted' AND c2.user_id != $1
      ),
      filtered_connections AS (
        SELECT coc.user_id
        FROM connections_of_connections coc
        WHERE NOT EXISTS (
          SELECT 1 FROM user_connections uc WHERE uc.user_id = coc.user_id
        )
      )
      SELECT COUNT(*) 
      FROM filtered_connections fc
      JOIN user_service.profiles u ON fc.user_id = u.user_id
      WHERE NOT EXISTS(
        SELECT 1 FROM connection_service.blocked_users b
        WHERE (b.user_id = $1 AND b.blocked_user_id = u.user_id)
           OR (b.user_id = u.user_id AND b.blocked_user_id = $1)
      )
    `,
      [userId]
    );

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
      },
    };
  }
}

export default new ConnectionService();
