import db from "@shared/config/db";

import {
  Connection,
  Follow,
  BlockedUser,
  MessageRequest,
  UserPreferences,
  ConnectionStatus
} from "@shared/models";

class ConnectionService {
  // Search for users
  async searchUsers(query: string, currentUserId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Create a normalized search query
    const searchQuery = query
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0)
      .map(term => term + ':*')
      .join(' & ');

    const result = await db.query(`
      SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name,
        u.profile_picture_id,
        u.bio,
        u.industry,
        EXISTS(
          SELECT 1 FROM connection_service.connections c
          WHERE c.user_id = $2 AND c.connection_id = u.user_id AND c.status = 'accepted'
        ) as is_connected,
        EXISTS(
          SELECT 1 FROM connection_service.follows f
          WHERE f.follower_id = $2 AND f.following_id = u.user_id
        ) as is_following,
        EXISTS(
          SELECT 1 FROM connection_service.blocked_users b
          WHERE b.user_id = $2 AND b.blocked_user_id = u.user_id
        ) as is_blocked,
        ts_rank_cd(
          to_tsvector('english',
            coalesce(first_name, '') || ' ' ||
            coalesce(last_name, '') || ' ' ||
            coalesce(industry, '') || ' ' ||
            coalesce(bio, '')
          ),
          to_tsquery('english', $1)
        ) as search_rank
      FROM user_service.profiles u
      WHERE 
        to_tsvector('english',
          coalesce(first_name, '') || ' ' ||
          coalesce(last_name, '') || ' ' ||
          coalesce(industry, '') || ' ' ||
          coalesce(bio, '')
        ) @@ to_tsquery('english', $1)
        AND u.user_id != $2
        AND NOT EXISTS(
          SELECT 1 FROM connection_service.blocked_users b
          WHERE (b.user_id = $2 AND b.blocked_user_id = u.user_id)
             OR (b.user_id = u.user_id AND b.blocked_user_id = $2)
        )
      ORDER BY search_rank DESC, u.first_name, u.last_name
      LIMIT $3 OFFSET $4
    `, [searchQuery, currentUserId, limit, offset]);

    const countResult = await db.query(`
      SELECT COUNT(*) 
      FROM user_service.profiles u
      WHERE 
        to_tsvector('english',
          coalesce(first_name, '') || ' ' ||
          coalesce(last_name, '') || ' ' ||
          coalesce(industry, '') || ' ' ||
          coalesce(bio, '')
        ) @@ to_tsquery('english', $1)
        AND u.user_id != $2
        AND NOT EXISTS(
          SELECT 1 FROM connection_service.blocked_users b
          WHERE (b.user_id = $2 AND b.blocked_user_id = u.user_id)
             OR (b.user_id = u.user_id AND b.blocked_user_id = $2)
        )
    `, [searchQuery, currentUserId]);

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit
      }
    };
  }

  // Connection management
  async sendConnectionRequest(params: {
    senderId: number;
    recipientId: number;
    message?: string;
  }): Promise<Connection> {
    // Check if recipient allows connection requests (with lock)
    const preferences = await db.query<{ allow_connection_requests: boolean }>(`
      SELECT allow_connection_requests 
      FROM connection_service.user_preferences
      WHERE user_id = $1
      FOR UPDATE
    `, [params.recipientId]);
  
    if (preferences.rows.length === 0 || !preferences.rows[0].allow_connection_requests) {
      throw new Error('User does not accept connection requests');
    }
  
    // Check if blocked (with lock)
    const isBlocked = await db.query(`
      SELECT 1 FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
      FOR UPDATE
    `, [params.recipientId, params.senderId]);
  
    if (isBlocked.rows.length > 0) {
      throw new Error('Cannot send request to this user');
    }
  
    // Check if connection already exists (with lock)
    const existingConnection = await db.query(`
      SELECT 1 FROM connection_service.connections
      WHERE user_id = $1 AND connection_id = $2
      FOR UPDATE
    `, [params.senderId, params.recipientId]);
  
    if (existingConnection.rows.length > 0) {
      throw new Error('Connection request already exists');
    }
  
    // Create both connection records in a single query using CTE
    const result = await db.query<Connection>(`
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
    `, [params.senderId, params.recipientId, params.message]);
  
    return result.rows[0];
  }
  
  async respondToConnectionRequest(params: {
    requestId: number;
    userId: number;
    accept: boolean;
  }): Promise<{ status: ConnectionStatus }> {
    // Get and lock the request
    const request = await db.query<Connection>(`
      SELECT * FROM connection_service.connections
      WHERE id = $1 AND user_id = $2 AND request_direction = 'incoming'
      FOR UPDATE
    `, [params.requestId, params.userId]);
  
    if (request.rows.length === 0) {
      throw new Error('Connection request not found');
    }
  
    const connection = request.rows[0];
    console.log(params.accept);
    const newStatus = params.accept ? ConnectionStatus.ACCEPTED : ConnectionStatus.DECLINED;
  
    // Update recipient's connection record
    await db.query(`
      UPDATE connection_service.connections
      SET status = $1, updated_at = NOW()
      WHERE user_id = $2 AND connection_id = $3
    `, [newStatus, params.userId, connection.connection_id]);
  
    // Update sender's connection record
    await db.query(`
      UPDATE connection_service.connections
      SET status = $1, updated_at = NOW()
      WHERE user_id = $2 AND connection_id = $3
    `, [newStatus, connection.connection_id, params.userId]);
  
    return { status: newStatus };
  }

  async removeConnection(params: { userId: number; connectionId: number }) {
    await db.query(`
      DELETE FROM connection_service.connections
      WHERE (user_id = $1 AND connection_id = $2)
         OR (user_id = $2 AND connection_id = $1)
    `, [params.userId, params.connectionId]);
  }

  async getConnections(userId: number, search?: string, page: number = 1, limit: number = 10) {
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

    query += ` ORDER BY u.first_name, u.last_name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
        limit
      }
    };
  }

  async getPendingRequests(userId: number, direction?: 'incoming' | 'outgoing') {
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
    await db.query(`
      INSERT INTO connection_service.follows (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, following_id) DO NOTHING
    `, [params.followerId, params.followingId]);
  }

  async unfollowUser(params: { followerId: number; followingId: number }) {
    await db.query(`
      DELETE FROM connection_service.follows
      WHERE follower_id = $1 AND following_id = $2
    `, [params.followerId, params.followingId]);
  }

  // Blocking
  async blockUser(params: { userId: number; blockedUserId: number }): Promise<BlockedUser> {
    // First check if already blocked to avoid unnecessary operations
    const existingBlock = await db.query<BlockedUser>(`
      SELECT * FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
      FOR UPDATE
    `, [params.userId, params.blockedUserId]);
  
    if (existingBlock.rows.length > 0) {
      return existingBlock.rows[0];
    }
  
    // Remove connections (both directions in single query)
    await db.query(`
      DELETE FROM connection_service.connections
      WHERE (user_id = $1 AND connection_id = $2)
         OR (user_id = $2 AND connection_id = $1)
    `, [params.userId, params.blockedUserId]);
  
    // Remove follows (both directions in single query)
    await db.query(`
      DELETE FROM connection_service.follows
      WHERE (follower_id = $1 AND following_id = $2)
         OR (follower_id = $2 AND following_id = $1)
    `, [params.userId, params.blockedUserId]);
  
    // Add to blocked list
    const result = await db.query<BlockedUser>(`
      INSERT INTO connection_service.blocked_users (user_id, blocked_user_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, blocked_user_id) DO NOTHING
      RETURNING *
    `, [params.userId, params.blockedUserId]);
  
    return result.rows[0];
  }

  async unblockUser(params: { userId: number; blockedUserId: number }) {
    await db.query(`
      DELETE FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
    `, [params.userId, params.blockedUserId]);
  }

  async getBlockedUsers(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    
    const result = await db.query(`
      SELECT 
        u.user_id, u.first_name, u.last_name, u.profile_picture_id,
        b.created_at as blocked_at
      FROM connection_service.blocked_users b
      JOIN user_service.profiles u ON b.blocked_user_id = u.user_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    const countResult = await db.query(`
      SELECT COUNT(*) FROM connection_service.blocked_users WHERE user_id = $1
    `, [userId]);

    return {
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit
      }
    };
  }

  // Messaging
  async sendMessageRequest(params: {
    senderId: number;
    recipientId: number;
    message: string;
  }): Promise<MessageRequest> {
    // First check if recipient exists and get preferences
    const preferences = await db.query<{ allow_messages_from: 'all' | 'none' | 'connections_only' }>(`
      SELECT allow_messages_from 
      FROM connection_service.user_preferences
      WHERE user_id = $1
      FOR UPDATE
    `, [params.recipientId]);
  
    if (preferences.rows.length === 0) {
      throw new Error('User not found');
    }
  
    const pref = preferences.rows[0].allow_messages_from;
    
    // Check message preferences
    if (pref === 'none') {
      throw new Error('User does not accept messages');
    }
  
    if (pref === 'connections_only') {
      const isConnected = await db.query(`
        SELECT 1 FROM connection_service.connections
        WHERE user_id = $1 AND connection_id = $2 AND status = 'accepted'
        FOR UPDATE
      `, [params.recipientId, params.senderId]);
  
      if (isConnected.rows.length === 0) {
        throw new Error('User only accepts messages from connections');
      }
    }
  
    // Check if blocked
    const isBlocked = await db.query(`
      SELECT 1 FROM connection_service.blocked_users
      WHERE user_id = $1 AND blocked_user_id = $2
      FOR UPDATE
    `, [params.recipientId, params.senderId]);
  
    if (isBlocked.rows.length > 0) {
      throw new Error('Cannot send message to this user');
    }
  
    // Create message request
    const result = await db.query<MessageRequest>(`
      INSERT INTO connection_service.messaging_requests (
        sender_id, recipient_id, message
      ) VALUES ($1, $2, $3)
      RETURNING *
    `, [params.senderId, params.recipientId, params.message]);
  
    return result.rows[0];
  }

  async respondToMessageRequest(params: {
    requestId: number;
    userId: number;
    accept: boolean;
  }) {
    console.log('accept:', params.accept);
    const result = await db.query<MessageRequest>(`
      UPDATE connection_service.messaging_requests
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND recipient_id = $3
      RETURNING *
    `, [params.accept ? 'accepted' : 'declined', params.requestId, params.userId]);

    if (result.rows.length === 0) {
      throw new Error('Message request not found');
    }

    return result.rows[0];
  }

  // Preferences
  async updateConnectionPreferences(params: {
    userId: number;
    allow_connection_requests?: boolean;
    allow_messages_from?: 'all' | 'none' | 'connections_only';
    visible_to_public?: boolean;
    visible_to_connections?: boolean;
    visible_to_network?: boolean;
  }) {
    console.log('Raw params:', params);
    console.log('Object.keys(params):', Object.keys(params));
    console.log('Filtered keys:', Object.keys(params).filter(k => k !== 'userId'));

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

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(params.userId);

    console.log('Fields array:', fields);
    console.log('Values array:', values);
    console.log('ParamIndex:', paramIndex);

    const query = `
      INSERT INTO connection_service.user_preferences (
        user_id, ${Object.keys(params).filter(k => k !== 'userId').join(', ')}
      ) VALUES (
        $${paramIndex}, ${Array.from({ length: fields.length }, (_, i) => `$${i + 1}`).join(', ')}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        ${fields.join(', ')},
        updated_at = NOW()
      RETURNING *
    `;

    console.log('Final query:', query);
    console.log('Final values:', [...values.slice(0, -1), params.userId]);

    const result = await db.query<UserPreferences>(query, 
      [...values.slice(0, -1), params.userId]
    );

    return result.rows[0];
  }
}

export default new ConnectionService();