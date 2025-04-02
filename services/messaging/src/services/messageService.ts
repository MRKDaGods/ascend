import db from "@shared/config/db";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
  };
}

interface Conversation {
  conversationId: number;
  connectedUserId: number;
  lastMessageContent: string;
  lastMessageTimestamp: Date;
  unseenCount: number;
}

interface Message {
  messageId: number;
  senderId: number;
  content: string;
  mediaId: number;
  sentAt: Date;
  readAt: Date;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
}

export const sendMessage = async (
  senderId: number,
  receiverId: number,
  content: string,
  hasFiles: boolean
): Promise<boolean> => {
  try {
    // get conversationId
    const conversationResult = await db.query(
      `SELECT conversation_id FROM messaging_service.conversations WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
      [senderId, receiverId]
    );

    let conversationId: string;
    // check if conversation exists
    if (conversationResult.rows.length > 0) {
      conversationId = conversationResult.rows[0].conversation_id;
    } else {
      // create new conversation
      const newConversationResult = await db.query(
        `INSERT INTO messaging_service.conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING conversation_id`,
        [senderId, receiverId]
      );
      conversationId = newConversationResult.rows[0].conversation_id;
    }

    // insert message
    const messageResult = await db.query(
      `INSERT INTO messaging_service.messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING message_id`,
      [conversationId, senderId, content]
    );

    // update conversation with last message id
    await db.query(
      `UPDATE messaging_service.conversations SET last_message_id = $1 WHERE conversation_id = $2`,
      [messageResult.rows[0].message_id, conversationId]
    );

    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
};

export const getUnseenCount = async (userId: number): Promise<number> => {
  try {
    const result = await db.query(
      `
        SELECT COUNT(*)
        FROM messaging_service.messages
        WHERE is_read = FALSE AND sender_id != $1 AND
        conversation_id IN
        (SELECT conversation_id FROM messaging_service.conversations WHERE user1_id = $1 OR user2_id = $1)
        `,
      [userId]
    );

    return result.rows.length > 0 ? parseInt(result.rows[0].count) : 0;
  } catch (error) {
    console.error("Error fetching unseen count:", error);
    throw new Error("Failed to fetch unseen count");
  }
};

export const getConversations = async (
  userId: number,
  page: number
): Promise<PaginatedResponse<Conversation>> => {
  try {
    // Get total count for pagination
    const countResult = await db.query(
      `
        SELECT COUNT(*) as total
        FROM messaging_service.conversations c
        WHERE c.user1_id = $1 OR c.user2_id = $1
        `,
      [userId]
    );

    const LIMIT = 20; // Limit for pagination
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / LIMIT);
    const offset = (page - 1) * LIMIT;

    // Get paginated conversations
    const result = await db.query(
      `
        SELECT
            c.conversation_id,
            CASE
                WHEN c.user1_id = $1 THEN c.user2_id
                ELSE c.user1_id
            END AS connected_user_id,
             m.content AS last_message_content,
             m.sent_at AS last_message_timestamp,
             COUNT(m2.message_id) AS unseen_count
        FROM messaging_service.conversations c
        LEFT JOIN messaging_service.messages m ON c.last_message_id = m.message_id
        LEFT JOIN messaging_service.messages m2 ON m2.is_read = FALSE AND m2.sender_id != $1 AND m2.conversation_id = c.conversation_id
        WHERE c.user1_id = $1 OR c.user2_id = $1
        GROUP BY c.conversation_id, connected_user_id, last_message_content, last_message_timestamp
        ORDER BY last_message_timestamp DESC NULLS LAST
        LIMIT $2 OFFSET $3
        `,
      [userId, LIMIT, offset]
    );

    const conversations = result.rows.map((row) => ({
      conversationId: row.conversation_id,
      connectedUserId: row.connected_user_id,
      lastMessageContent: row.last_message_content,
      lastMessageTimestamp: row.last_message_timestamp,
      unseenCount: parseInt(row.unseen_count),
    }));

    return {
      data: conversations,
      pagination: {
        total_records: totalRecords,
        current_page: page,
        total_pages: totalPages,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
};

export const getMessages = async (
  conversationId: string,
  userId: number,
  page: number
): Promise<PaginatedResponse<Message>> => {
  try {
    // First, validate that this conversation belongs to this user
    const conversationCheck = await db.query(
      `
      SELECT conversation_id
      FROM messaging_service.conversations
      WHERE conversation_id = $1 AND (user1_id = $2 OR user2_id = $2)
      `,
      [conversationId, userId]
    );

    // If no matching conversation is found, the user doesn't have access
    if (conversationCheck.rows.length === 0) {
      throw new Error("Unauthorized access to conversation");
    }

    // Get total count for pagination
    const countResult = await db.query(
      `
      SELECT COUNT(*) as total
      FROM messaging_service.messages
      WHERE conversation_id = $1
      `,
      [conversationId]
    );

    const LIMIT = 20; // Limit for pagination
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / LIMIT);
    const offset = (page - 1) * LIMIT;

    // Get paginated messages
    const result = await db.query(
      `
      SELECT
          m.message_id,
          m.sender_id,
          m.content,
          m.media_id,
          m.sent_at,
          m.read_at,
          m.is_read,
          m.is_edited,
          m.is_deleted
      FROM messaging_service.messages m
      WHERE m.conversation_id = $1
      ORDER BY sent_at DESC
      LIMIT $2 OFFSET $3
      `,
      [conversationId, LIMIT, offset]
    );

    const messages = result.rows.map((row) => ({
      messageId: row.message_id,
      senderId: row.sender_id,
      content: row.content,
      mediaId: row.media_id,
      sentAt: row.sent_at,
      readAt: row.read_at,
      isRead: row.is_read,
      isEdited: row.is_edited,
      isDeleted: row.is_deleted,
    }));

    // Also mark messages as read if they were sent by the other user
    await db.query(
      `
      UPDATE messaging_service.messages
      SET is_read = TRUE, read_at = NOW()
      WHERE conversation_id = $1 AND sender_id != $2 AND is_read = FALSE
      `,
      [conversationId, userId]
    );

    return {
      data: messages,
      pagination: {
        total_records: totalRecords,
        current_page: page,
        total_pages: totalPages,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};
