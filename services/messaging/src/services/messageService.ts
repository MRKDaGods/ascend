import database from "@shared/config/db";
import { Message, Conversation } from "packages/shared/src/models/message";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
}

/**
 * Validates if a user belongs to a conversation
 * @param {number} conversationId - The conversation ID to check
 * @param {number} userId - The user ID to validate
 * @returns {Promise<boolean>} Whether the user is in the conversation
 */
export const validateUserInConversation = async (
  conversationId: number,
  userId: number
): Promise<boolean> => {
  try {
    const queryResult = await database.query(
      `
      SELECT conversation_id
      FROM messaging_service.conversations
      WHERE conversation_id = $1 AND (user1_id = $2 OR user2_id = $2)
      `,
      [conversationId, userId]
    );

    return queryResult.rows.length > 0;
  } catch (error) {
    console.error("Error validating user in conversation:", error);
    throw new Error("Failed to validate user in conversation");
  }
};

/**
 * Gets the ID of the other user in a conversation
 * @param {number} conversationId - The conversation ID
 * @param {number} userId - The current user's ID
 * @returns {Promise<number>} The other user's ID
 */
export const getOtherUserId = async (
  conversationId: number,
  userId: number
): Promise<number> => {
  try {
    const queryResult = await database.query(
      `
      SELECT
          CASE
              WHEN user1_id = $1 THEN user2_id
              ELSE user1_id
          END AS other_user_id
      FROM messaging_service.conversations
      WHERE conversation_id = $2
      `,
      [userId, conversationId]
    );

    return parseInt(queryResult.rows[0].other_user_id);
  } catch (error) {
    console.error("Error fetching other user ID:", error);
    throw new Error("Failed to fetch other user ID");
  }
};

/**
 * Marks unread messages from a sender in a conversation as read
 * @param {number} conversationId - The conversation ID
 * @param {number} senderId - The sender's ID whose messages to mark as read
 * @returns {Promise<void>}
 */
export const markMessagesAsRead = async (
  conversationId: number,
  senderId: number
): Promise<void> => {
  try {
    await database.query(
      `
      UPDATE messaging_service.messages
      SET is_read = TRUE, read_at = NOW()
      WHERE conversation_id = $1 AND sender_id = $2 AND is_read = FALSE
      `,
      [conversationId, senderId]
    );
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw new Error("Failed to mark messages as read");
  }
};

/**
 * Sends a message between users, creating a conversation if needed
 * @param {number} senderId - The sender's ID
 * @param {number} receiverId - The receiver's ID
 * @param {string} messageContent - The message content
 * @param {boolean} includesFiles - Whether the message includes files
 * @returns {Promise<{conversationId: number, messageId: number, content: string, sentAt: Date}>}
 */
export const sendMessage = async (
  senderId: number,
  receiverId: number,
  messageContent: string,
  includesFiles: boolean
): Promise<{
  conversationId: number;
  messageId: number;
  content: string;
  sentAt: Date;
}> => {
  try {
    let conversationId: string;

    const conversationQueryResult = await database.query(
      `SELECT conversation_id FROM messaging_service.conversations WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
      [senderId, receiverId]
    );

    if (conversationQueryResult.rows.length > 0) {
      conversationId = conversationQueryResult.rows[0].conversation_id;
    } else {
      const newConversationResult = await database.query(
        `INSERT INTO messaging_service.conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING conversation_id`,
        [senderId, receiverId]
      );
      conversationId = newConversationResult.rows[0].conversation_id;
    }

    const messageInsertResult = await database.query(
      `INSERT INTO messaging_service.messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING message_id, sent_at`,
      [conversationId, senderId, messageContent]
    );

    await database.query(
      `UPDATE messaging_service.conversations SET last_message_id = $1 WHERE conversation_id = $2`,
      [messageInsertResult.rows[0].message_id, conversationId]
    );

    return {
      conversationId: parseInt(conversationId),
      messageId: parseInt(messageInsertResult.rows[0].message_id),
      content: messageContent,
      sentAt: messageInsertResult.rows[0].sent_at,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
};

/**
 * Gets the count of unseen messages for a user
 * @param {number} userId - The user's ID
 * @returns {Promise<number>} The number of unseen messages
 */
export const getUnseenCount = async (userId: number): Promise<number> => {
  try {
    const queryResult = await database.query(
      `
        SELECT COUNT(m.message_id)
        FROM messaging_service.messages m
        JOIN messaging_service.conversations c ON m.conversation_id = c.conversation_id
        WHERE m.is_read = FALSE AND m.sender_id != $1 AND (c.user1_id = $1 OR c.user2_id = $1)
        `,
      [userId]
    );

    return parseInt(queryResult.rows[0].count) || 0;
  } catch (error) {
    console.error("Error fetching unseen count:", error);
    throw new Error("Failed to fetch unseen count");
  }
};

/**
 * Retrieves paginated conversations for a user
 * @param {number} userId - The user's ID
 * @param {number} pageNumber - The page number to fetch
 * @returns {Promise<PaginatedResponse<Conversation>>} Paginated conversation data
 */
export const getConversations = async (
  userId: number,
  pageNumber: number
): Promise<PaginatedResponse<Conversation>> => {
  try {
    const countQueryResult = await database.query(
      `
        SELECT COUNT(*) as total
        FROM messaging_service.conversations c
        WHERE c.user1_id = $1 OR c.user2_id = $1
        `,
      [userId]
    );

    const PAGE_SIZE = 20;
    const totalRecordsCount = parseInt(countQueryResult.rows[0].total);
    const totalPageCount = Math.ceil(totalRecordsCount / PAGE_SIZE);
    const pageOffset = (pageNumber - 1) * PAGE_SIZE;

    const conversationsQueryResult = await database.query(
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
      [userId, PAGE_SIZE, pageOffset]
    );

    const conversationList = conversationsQueryResult.rows.map((row) => ({
      conversationId: row.conversation_id,
      otherUserId: row.connected_user_id,
      lastMessageContent: row.last_message_content,
      lastMessageTimestamp: row.last_message_timestamp,
      unseenMessageCount: parseInt(row.unseen_count),
    }));

    return {
      data: conversationList,
      pagination: {
        totalRecords: totalRecordsCount,
        currentPage: pageNumber,
        totalPages: totalPageCount,
        nextPage: pageNumber < totalPageCount ? pageNumber + 1 : null,
        previousPage: pageNumber > 1 ? pageNumber - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
};

/**
 * Retrieves paginated messages for a conversation
 * @param {number} conversationId - The conversation ID
 * @param {number} pageNumber - The page number to fetch
 * @returns {Promise<PaginatedResponse<Message>>} Paginated message data
 */
export const getMessages = async (
  conversationId: number,
  pageNumber: number
): Promise<PaginatedResponse<Message>> => {
  try {
    const countQueryResult = await database.query(
      `
      SELECT COUNT(*) as total
      FROM messaging_service.messages
      WHERE conversation_id = $1
      `,
      [conversationId]
    );

    const PAGE_SIZE = 20;
    const totalRecordsCount = parseInt(countQueryResult.rows[0].total);
    const totalPageCount = Math.ceil(totalRecordsCount / PAGE_SIZE);
    const pageOffset = (pageNumber - 1) * PAGE_SIZE;

    const messagesQueryResult = await database.query(
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
      [conversationId, PAGE_SIZE, pageOffset]
    );

    const messageList = messagesQueryResult.rows.map((row) => ({
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

    return {
      data: messageList,
      pagination: {
        totalRecords: totalRecordsCount,
        currentPage: pageNumber,
        totalPages: totalPageCount,
        nextPage: pageNumber < totalPageCount ? pageNumber + 1 : null,
        previousPage: pageNumber > 1 ? pageNumber - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};
