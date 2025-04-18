import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Response } from "express";
import connectionService from "../services/connectionService";
import {
  connectionRequestValidationRules,
  messageRequestValidationRules,
  preferencesValidationRules,
} from "../validations/connectionValidation";
import validate from "@shared/middleware/validationMiddleware";

/**
 * Search for users by name, email, or other criteria
 * @route GET /users/search
 * @param {string} q - Search query string
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of results per page (default: 10)
 * @returns {object} Matching users with pagination information
 */
// Search Controller
export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  const { q, page = 1, limit = 10 } = req.query;

  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const results = await connectionService.searchUsers(
      q as string,
      req.user.id,
      Number(page),
      Number(limit)
    );
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Send a connection request to another user
 * @route POST /connections/requests
 * @param {number} userId - ID of the user to send request to
 * @param {string} message - Optional message to include with the request
 * @returns {object} The created connection request
 */
// Connection Request Controllers
export const sendConnectionRequest = [
  ...connectionRequestValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const request = await connectionService.sendConnectionRequest({
        senderId: req.user.id,
        recipientId: req.body.userId,
        message: req.body.message,
      });
      res.status(201).json({ success: true, data: request });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Failed to send connection request",
      });
    }
  },
];

/**
 * Accept or reject a received connection request
 * @route PUT /connections/requests/:requestId
 * @param {string} requestId - ID of the connection request to respond to
 * @param {boolean} accept - Whether to accept (true) or reject (false) the request
 * @returns {object} The updated connection status
 */
export const respondToConnectionRequest = [
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const result = await connectionService.respondToConnectionRequest({
        requestId: Number(req.params.requestId),
        userId: req.user.id,
        accept: req.body.accept,
      });
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to respond to connection request",
      });
    }
  },
];

/**
 * Remove an existing connection with another user
 * @route DELETE /connections/:connectionId
 * @param {string} connectionId - ID of the user to disconnect from
 * @returns {object} Success message
 */
export const removeConnection = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      throw new Error("User not authenticated");
    }
    await connectionService.removeConnection({
      userId: req.user.id,
      connectionId: Number(req.params.connectionId),
    });
    res.json({ success: true, message: "Connection removed" });
  } catch {
    res.status(400).json({
      success: false,
      message: "Failed to remove connection",
    });
  }
};

/**
 * Get all connections for the current user
 * @route GET /connections
 * @param {string} search - Optional search filter for connections
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of results per page (default: 10)
 * @returns {object} List of connections with pagination information
 */
export const getConnections = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const connections = await connectionService.getConnections(
      req.user.id,
      req.query.search as string,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );
    res.json({ success: true, data: connections });
  } catch (error) {
    console.error("Error in getConnections:", error); // Added error logging
    res.status(500).json({
      success: false,
      message: "Failed to get connections",
      error: error instanceof Error ? error.message : String(error), // Added error details
    });
  }
};

/**
 * Get pending connection requests for the current user
 * @route GET /connections/requests
 * @param {string} direction - Filter by 'incoming' or 'outgoing' requests
 * @returns {object} List of pending connection requests
 */
export const getPendingRequests = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      throw new Error("User not authenticated");
    }
    const requests = await connectionService.getPendingRequests(
      req.user.id,
      req.query.direction as "incoming" | "outgoing"
    );
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error in getPendingRequests:", error); // Add logging
    res.status(500).json({
      success: false,
      message: "Failed to get requests",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Follow another user
 * @route POST /follows/:userId
 * @param {string} userId - ID of the user to follow
 * @returns {object} Success message
 */
// Following Controllers
export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    await connectionService.followUser({
      followerId: req.user.id,
      followingId: Number(req.params.userId),
    });
    res.json({ success: true, message: "User followed" });
  } catch {
    res.status(400).json({
      success: false,
      message: "Failed to follow user",
    });
  }
};

/**
 * Unfollow a previously followed user
 * @route DELETE /follows/:userId
 * @param {string} userId - ID of the user to unfollow
 * @returns {object} Success message
 */
export const unfollowUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    await connectionService.unfollowUser({
      followerId: req.user.id,
      followingId: Number(req.params.userId),
    });
    res.json({ success: true, message: "User unfollowed" });
  } catch {
    res.status(400).json({
      success: false,
      message: "Failed to unfollow user",
    });
  }
};

/**
 * Block another user
 * @route POST /blocks/:userId
 * @param {string} userId - ID of the user to block
 * @returns {object} Success message
 */
// Blocking Controllers
export const blockUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    await connectionService.blockUser({
      userId: req.user.id,
      blockedUserId: Number(req.params.userId),
    });
    res.json({ success: true, message: "User blocked" });
  } catch {
    res.status(400).json({
      success: false,
      message: "Failed to block user",
    });
  }
};

/**
 * Unblock a previously blocked user
 * @route DELETE /blocks/:userId
 * @param {string} userId - ID of the user to unblock
 * @returns {object} Success message
 */
export const unblockUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    await connectionService.unblockUser({
      userId: req.user.id,
      blockedUserId: Number(req.params.userId),
    });
    res.json({ success: true, message: "User unblocked" });
  } catch {
    res.status(400).json({
      success: false,
      message: "Failed to unblock user",
    });
  }
};

/**
 * Get list of users blocked by the current user
 * @route GET /blocks
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of results per page (default: 10)
 * @returns {object} List of blocked users with pagination information
 */
export const getBlockedUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const blockedUsers = await connectionService.getBlockedUsers(
      req.user.id,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );
    res.json({ success: true, data: blockedUsers });
  } catch (error) {
    console.error("Error in getBlockedUsers:", error); // Add logging
    res.status(500).json({
      success: false,
      message: "Failed to get blocked users",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Send a message request to a user not in connections
 * @route POST /messages/requests
 * @param {number} userId - ID of the user to send message request to
 * @param {string} message - Initial message to send
 * @returns {object} The created message request
 */
// Messaging Controllers
export const sendMessageRequest = [
  ...messageRequestValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const request = await connectionService.sendMessageRequest({
        senderId: req.user.id,
        recipientId: req.body.userId,
        message: req.body.message,
      });
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      console.error("Error in sendMessageRequest:", error);
      res.status(400).json({
        success: false,
        message: "Failed to send message request",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
];

/**
 * Accept or reject a received message request
 * @route PUT /messages/requests/:requestId
 * @param {string} requestId - ID of the message request to respond to
 * @param {boolean} accept - Whether to accept (true) or reject (false) the request
 * @returns {object} The updated message request status
 */
export const respondToMessageRequest = [
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      console.log("Request Body:", req.body);
      const result = await connectionService.respondToMessageRequest({
        requestId: Number(req.params.requestId),
        userId: req.user.id,
        accept: req.body.accept,
      });
      res.json({ success: true, data: result });
    } catch {
      res.status(400).json({
        success: false,
        message: "Failed to respond to message request",
      });
    }
  },
];

/**
 * Update connection privacy preferences
 * @route PUT /preferences
 * @param {boolean} allowConnectionRequests - Whether to allow connection requests
 * @param {boolean} allowMessageRequests - Whether to allow message requests from non-connections
 * @param {boolean} showFollowers - Whether to publicly show followers
 * @param {boolean} showFollowing - Whether to publicly show following list
 * @param {boolean} showConnections - Whether to publicly show connections
 * @returns {object} The updated preferences
 */
// Preferences Controller
export const updateConnectionPreferences = [
  ...preferencesValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("Request Body:", req.body);
      console.log("User ID:", req.user?.id);

      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const preferences = await connectionService.updateConnectionPreferences({
        userId: req.user.id,
        ...req.body,
      });
      res.json({ success: true, data: preferences });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update connection preferences",
      });
    }
  },
];
