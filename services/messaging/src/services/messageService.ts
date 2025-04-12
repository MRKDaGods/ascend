import database from "@shared/config/db";
import { Services } from "@ascend/shared";
import { getPresignedUrl } from "@shared/utils/files";
import { Message, Conversation } from "packages/shared/src/models/message";
import {
  callRPC,
  Events,
  FileUploadPayload,
  getRPCQueueName,
} from "@shared/rabbitMQ";

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
 * @param {string} messageContent - The message content to be sent (if any)
 * @param {Express.Multer.File} file - The file to be sent (if any)
 * @returns {Promise<{conversationId: number, messageId: number, content: string | null, fileUrl: string | null, sentAt: Date}>}
 */
export const sendMessage = async (
  senderId: number,
  receiverId: number,
  messageContent: string,
  file: Express.Multer.File | undefined
): Promise<{
  conversationId: number;
  messageId: number;
  content: string | null;
  fileUrl: string | null;
  sentAt: Date;
}> => {
  try {
    let conversationId: number;

    // Check if a conversation already exists between the sender and receiver
    // If it does, use that conversation ID; if not, create a new conversation
    // and get the new conversation ID
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

    // Handle file upload if a file is provided
    let fileId = null;
    let fileUrl = null;

    if (file) {
      // Construct payload and call the rpc
      const fileRpcQueue = getRPCQueueName(
        Services.FILE,
        Events.FILE_UPLOAD_RPC
      );

      const payload: FileUploadPayload.Request = {
        user_id: senderId,
        file_buffer: file.buffer.toString("base64"),
        file_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
        context: "message",
      };

      const fileResponse = await callRPC<FileUploadPayload.Response>(
        fileRpcQueue,
        payload,
        60000
      );

      fileId = fileResponse.file_id;
      fileUrl = await getPresignedUrl(fileId);
    }

    // Insert the message into the database
    const messageInsertResult = await database.query(
      `INSERT INTO messaging_service.messages (conversation_id, sender_id, content, media_id) VALUES ($1, $2, $3, $4) RETURNING message_id, sent_at`,
      [conversationId, senderId, messageContent, fileId]
    );

    // Update the conversation with the last message ID
    await database.query(
      `UPDATE messaging_service.conversations SET last_message_id = $1 WHERE conversation_id = $2`,
      [messageInsertResult.rows[0].message_id, conversationId]
    );

    return {
      conversationId: conversationId,
      messageId: parseInt(messageInsertResult.rows[0].message_id),
      content: messageContent,
      fileUrl: fileUrl,
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
    // Get the total count of conversations for pagination
    const countQueryResult = await database.query(
      `
        SELECT COUNT(*) as total
        FROM messaging_service.conversations c
        WHERE c.user1_id = $1 OR c.user2_id = $1
        `,
      [userId]
    );

    // Calculate pagination details
    const PAGE_SIZE = 20;
    const totalRecordsCount = parseInt(countQueryResult.rows[0].total);
    const totalPageCount = Math.ceil(totalRecordsCount / PAGE_SIZE);
    const pageOffset = (pageNumber - 1) * PAGE_SIZE;
    const paginationData = {
      totalRecords: totalRecordsCount,
      currentPage: pageNumber,
      totalPages: totalPageCount,
      nextPage: pageNumber < totalPageCount ? pageNumber + 1 : null,
      previousPage: pageNumber > 1 ? pageNumber - 1 : null,
    };

    // Fetch conversations with pagination
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

    // Map the results to a more usable format
    const conversationList = conversationsQueryResult.rows.map((row) => ({
      conversationId: row.conversation_id,
      otherUserId: row.connected_user_id,
      lastMessageContent: row.last_message_content,
      lastMessageTimestamp: row.last_message_timestamp,
      unseenMessageCount: parseInt(row.unseen_count),
    }));

    return {
      data: conversationList,
      pagination: paginationData,
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
    // Get the total count of messages for pagination
    const countQueryResult = await database.query(
      `
      SELECT COUNT(*) as total
      FROM messaging_service.messages
      WHERE conversation_id = $1
      `,
      [conversationId]
    );

    // Calculate pagination details
    const PAGE_SIZE = 20;
    const totalRecordsCount = parseInt(countQueryResult.rows[0].total);
    const totalPageCount = Math.ceil(totalRecordsCount / PAGE_SIZE);
    const pageOffset = (pageNumber - 1) * PAGE_SIZE;
    const paginationData = {
      totalRecords: totalRecordsCount,
      currentPage: pageNumber,
      totalPages: totalPageCount,
      nextPage: pageNumber < totalPageCount ? pageNumber + 1 : null,
      previousPage: pageNumber > 1 ? pageNumber - 1 : null,
    };

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

    const messageList = await Promise.all(
      messagesQueryResult.rows.map(async (row) => {
        const message: Message = {
          messageId: row.message_id,
          senderId: row.sender_id,
          content: row.content,
          fileUrl: null,
          sentAt: row.sent_at,
          readAt: row.read_at,
          isRead: row.is_read,
          isEdited: row.is_edited,
          isDeleted: row.is_deleted,
        };

        // If a file is associated with the message, fetch its URL
        if (row.media_id) {
          message.fileUrl = await getPresignedUrl(row.media_id);
        }

        return message;
      })
    );

    return {
      data: messageList,
      pagination: paginationData,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};
