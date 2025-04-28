import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import {
  searchUsers,
  sendConnectionRequest,
  respondToConnectionRequest,
  removeConnection,
  followUser,
  unfollowUser,
  getConnections,
  getPendingRequests,
  blockUser,
  unblockUser,
  getBlockedUsers,
  sendMessageRequest,
  respondToMessageRequest,
  updateConnectionPreferences,
  getMutualConnections,
  getFollowers,
  getConnectionsOfConnections,
} from '../controllers/connectionController';


const router = Router();

// Search routes
router.get('/search', authenticateToken, searchUsers);

// Connection management routes
router.post('/request', authenticateToken, sendConnectionRequest);
router.put('/respond/:requestId', authenticateToken, respondToConnectionRequest);
router.delete('/:connectionId', authenticateToken, removeConnection);
router.get('/connections', authenticateToken, getConnections);
router.get('/connections/pending', authenticateToken, getPendingRequests);

// Following routes
router.post('/follow/:userId', authenticateToken, followUser);
router.delete('/follow/:userId', authenticateToken, unfollowUser);
router.get('/followers/:userId?', authenticateToken, getFollowers);

// Blocking routes
router.post('/block/:userId', authenticateToken, blockUser);
router.delete('/block/:userId', authenticateToken, unblockUser);
router.get('/blocked', authenticateToken, getBlockedUsers);

// Messaging routes
router.post('/message-request', authenticateToken, sendMessageRequest);
router.put('/message-request/:requestId', authenticateToken, respondToMessageRequest);

// Preferences routes
router.put('/preferences', authenticateToken, updateConnectionPreferences);

// Mutual connections route
router.get('/connections/mutual/:userId', authenticateToken, getMutualConnections);

// Connections of connections (first level mutual)
router.get('/connections/network', authenticateToken, getConnectionsOfConnections);

export default router;