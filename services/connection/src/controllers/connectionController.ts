import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Response } from "express";
import connectionService from "../services/connectionService";
import {
  connectionRequestValidationRules,
  messageRequestValidationRules,
  preferencesValidationRules,
} from "../validations/connectionValidation";
import validate from "@shared/middleware/validationMiddleware";

interface SearchQueryParams {
  q?: string;
  page?: string;
  limit?: string;
  industry?: string[];
  location?: string[];
  skills?: string[];
  connectionStatus?: 'all' | 'connected' | 'not_connected';
  minExperience?: string;
  maxExperience?: string;
}

export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const {
      q,
      page = '1',
      limit = '10',
      industry,
      location,
      skills,
      connectionStatus,
      minExperience,
      maxExperience
    } = req.query as SearchQueryParams;

    // Build filters object
    const filters = {
      ...(industry && { industry }),
      ...(location && { location }),
      ...(skills && { skills }),
      ...(connectionStatus && { connectionStatus }),
      ...(minExperience && { minExperience: Number(minExperience) }),
      ...(maxExperience && { maxExperience: Number(maxExperience) })
    };

    const results = await connectionService.searchUsers(
      q || '',
      req.user.id,
      filters,
      Number(page),
      Number(limit)
    );

    res.json({
      success: true,
      data: results.data,
      pagination: results.pagination
    });

  } catch (error) {
    console.error('Error in searchUsers:', error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

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
    console.error('Error in getConnections:', error); // Added error logging
    res.status(500).json({
      success: false,
      message: "Failed to get connections",
      error: error instanceof Error ? error.message : String(error) // Added error details
    });
  }
};

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
    console.error('Error in getPendingRequests:', error); // Add logging
    res.status(500).json({ 
      success: false, 
      message: "Failed to get requests",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

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
    console.error('Error in getBlockedUsers:', error); // Add logging
    res.status(500).json({
      success: false,
      message: "Failed to get blocked users",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

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
      console.error('Error in sendMessageRequest:', error);
      res.status(400).json({
        success: false,
        message: "Failed to send message request",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
];

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
      console.log('Request Body:', req.body);
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

// Preferences Controller
export const updateConnectionPreferences = [
  ...preferencesValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('Request Body:', req.body);
      console.log('User ID:', req.user?.id);

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
