import database from "@shared/config/db";
import { Services } from "@ascend/shared";
import { getPresignedUrl, getFileMetadata } from "@shared/utils/files";
import { Message, Conversation } from "packages/shared/src/models/message";

import {
  getUserFullName,
  getUserProfilePictureUrl,
} from "@shared/utils/userProfile";

import {
  callRPC,
  Events,
  FileUploadPayload,
  getRPCQueueName,
} from "@shared/rabbitMQ";

/**
 * Interface for paginated responses
 * @interface PaginatedResponse
 * @template T - The type of data being paginated
 * @property {T[]} data - Array of data items
 * @property {Object} pagination - Pagination information
 * @property {number} pagination.totalRecords - Total number of records
 * @property {number} pagination.totalPages - Total number of pages
 * @property {number} pagination.currentPage - Current page number
 * @property {number|null} pagination.nextPage - Next page number or null if none
 * @property {number|null} pagination.previousPage - Previous page number or null if none
 */
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
 * Checks if either user has blocked the other
 * @param {number} userId1 - First user's ID
 * @param {number} userId2 - Second user's ID
 * @returns {Promise<boolean>} Whether either user has blocked the other
 */
export const isBlockedBetweenUsers = async (
  userId1: number,
  userId2: number
): Promise<boolean> => {
  try {
    const query = `
      SELECT COUNT(*)
      FROM connection_service.blocked_users
      WHERE (user_id = $1 AND blocked_user_id = $2) OR (user_id = $2 AND blocked_user_id = $1)
    `;

    const result = await database.query(query, [userId1, userId2]);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error("Error checking if users are blocked:", error);
    throw new Error("Failed to check blocked status between users");
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
 * Determines if a user can send a message to another user
 * Checks block status and connection status
 * @param {number} senderId - Sender's user ID
 * @param {number} receiverId - Receiver's user ID
 * @returns {Promise<boolean>} Whether the sender can send a message to the receiver
 */
export const canSendMessage = async (
  senderId: number,
  receiverId: number
): Promise<boolean> => {
  try {
    // Check either sender blocked receiver or receiver blocked sender
    const isBlocked = await isBlockedBetweenUsers(senderId, receiverId);
    if (isBlocked) {
      return false;
    }

    // Check if there is an accepted connection between the two users
    const connectionQuery = `
      SELECT COUNT(*)
      FROM connection_service.connections
      WHERE (user_id = $1 AND connection_id = $2) OR (user_id = $2 AND connection_id = $1)
      AND status = 'accepted'
    `;

    const connectionResult = await database.query(connectionQuery, [
      senderId,
      receiverId,
    ]);

    // If the count is 0, it means there is no accepted connection
    const hasConnection = parseInt(connectionResult.rows[0].count) > 0;
    if (!hasConnection) {
      return false;
    }

    // If both checks pass, the user can send a message
    return true;
  } catch (error) {
    console.error("Error checking if user can send message:", error);
    throw new Error("Failed to check if user can send message");
  }
};

/**
 * Checks if a user has reached their daily message limit
 * @param {number} userId - The user's ID
 * @returns {Promise<boolean>} Whether the user has reached their message limit
 */
export const isMessageLimitReached = async (
  userId: number
): Promise<boolean> => {
  try {
    const query = `
    SELECT messages_per_day, messages_per_day_limit, last_date
    FROM payment_service.usage
    WHERE user_id = $1
    `;

    const result = await database.query(query, [userId]);

    const lastDate = new Date(result.rows[0].last_date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - lastDate.getTime()) / 36e5;
    const messagesPerDay = parseInt(result.rows[0].messages_per_day);
    const messagesPerDayLimit = parseInt(result.rows[0].messages_per_day_limit);

    if (messagesPerDay >= messagesPerDayLimit && diffInHours <= 24) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking message limit:", error);
    throw new Error("Failed to check message limit");
  }
};

/**
 * Sends a message between users, creating a conversation if needed
 * @param {number} senderId - The sender's ID
 * @param {number} receiverId - The receiver's ID
 * @param {string|null} messageContent - The message content to be sent (if any)
 * @param {Express.Multer.File|null} file - The file to be sent (if any)
 * @returns {Promise<{
 *   conversationId: number,
 *   messageId: number,
 *   content: string|null,
 *   fileUrl: string|null,
 *   fileType: string|null,
 *   sentAt: Date
 * }>} The sent message details
 */
export const sendMessage = async (
  senderId: number,
  receiverId: number,
  messageContent: string | null,
  file: Express.Multer.File | null
): Promise<{
  conversationId: number;
  messageId: number;
  content: string | null;
  fileUrl: string | null;
  fileType: string | null;
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
    let fileType = null;

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
      fileType = file.mimetype;
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

    // Update the usage for the sender
    const lastDateResult = await database.query(
      `SELECT last_date FROM payment_service.usage WHERE user_id = $1`,
      [senderId]
    );
    const lastDate = new Date(lastDateResult.rows[0].last_date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - lastDate.getTime()) / 36e5;

    if (diffInHours >= 24) {
      await database.query(
        `UPDATE payment_service.usage SET messages_per_day = 1, last_date = NOW() WHERE user_id = $1`,
        [senderId]
      );
    } else {
      await database.query(
        `UPDATE payment_service.usage SET messages_per_day = messages_per_day + 1, last_date = NOW() WHERE user_id = $1`,
        [senderId]
      );
    }

    return {
      conversationId: conversationId,
      messageId: parseInt(messageInsertResult.rows[0].message_id),
      content: messageContent,
      fileUrl: fileUrl,
      fileType: fileType,
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
    const conversationList = await Promise.all(
      conversationsQueryResult.rows.map(async (row) => {
        // Check if the user is blocked by the other user
        // or if the user has blocked the other user
        const isBlocked = await isBlockedBetweenUsers(
          userId,
          parseInt(row.connected_user_id)
        );

        // Fetch the full name of the other user
        const otherUserFullName = await getUserFullName(
          parseInt(row.connected_user_id)
        );

        // Fetch the profile picture URL of the other user
        // If the user is blocked, set the profile picture URL to empty string
        let otherUserProfilePictureUrl = "";
        if (!isBlocked) {
          const url = await getUserProfilePictureUrl(
            parseInt(row.connected_user_id)
          );

          if (url) {
            otherUserProfilePictureUrl = url;
          }
        }

        return {
          conversationId: row.conversation_id,
          otherUserId: row.connected_user_id,
          otherUserFullName,
          otherUserProfilePictureUrl,
          isBlocked,
          lastMessageContent: row.last_message_content,
          lastMessageTimestamp: row.last_message_timestamp,
          unseenMessageCount: parseInt(row.unseen_count),
        };
      })
    );

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
          fileType: null,
          sentAt: row.sent_at,
          readAt: row.read_at,
          isRead: row.is_read,
        };

        // If a file is associated with the message, fetch its URL
        if (row.media_id) {
          message.fileUrl = await getPresignedUrl(row.media_id);
          const fileMetadata = await getFileMetadata(row.media_id);
          message.fileType = fileMetadata?.mime_type || null;
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
