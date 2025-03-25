import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import multer from "multer";

import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getFeed,
  likePost,
  createComment,
  sharePost,
  getPostEngagement,
  savePost,
  getSavedPosts,
  searchPosts,
  getPostComments,
  tagUsers,
  deleteComment,
  updateComment
} from "../controllers/postController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

// Feed routes
router.get("/feed", authenticateToken, getFeed);
router.get("/search", authenticateToken, searchPosts);
router.get("/saved", authenticateToken, getSavedPosts);

// Post CRUD routes
router.post("/", authenticateToken, upload.array("media"), createPost);
router.get("/:postId", authenticateToken, getPostById);
router.patch("/:postId", authenticateToken, updatePost);
router.delete("/:postId", authenticateToken, deletePost);

// Engagement routes
router.post("/:postId/like", authenticateToken, likePost);
router.get("/:postId/engagement", authenticateToken, getPostEngagement);

// Comment routes
router.get("/:postId/comments", authenticateToken, getPostComments);
router.post("/:postId/comments", authenticateToken, createComment);
router.patch("/:postId/comments/:commentId", authenticateToken, updateComment);
router.delete("/:postId/comments/:commentId", authenticateToken, deleteComment);

// Share routes
router.post("/:postId/share", authenticateToken, sharePost);

// Save routes
router.post("/:postId/save", authenticateToken, savePost);

// Tag routes
// router.post("/:postId/tags", authenticateToken, tagUsers);

export default router;