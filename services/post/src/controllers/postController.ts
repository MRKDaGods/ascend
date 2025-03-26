import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import validate from "@shared/middleware/validationMiddleware";
import { Response } from "express";
import postService from "../services/postService";
import postFileProducer from "../producers/postProducer";
import {
  createPostValidationRules,
  updatePostValidationRules,
  commentValidationRules,
  sharePostValidationRules,
  tagUsersValidationRules,
  searchValidationRules,
  mediaUploadValidationRules,
} from "../validations/postValidation";

// Feed Controllers
export const getFeed = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const feed = await postService.getFeed(userId, limit, (page - 1) * limit);
    const total = await postService.getFeedCount(userId);

    res.json({
      success: true,
      data: feed,
      pagination: { total, page, limit },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Create a new post with optional media attachments
 * @route POST /api/posts
 * @param {string} content - Post content
 * @param {string} privacy - Post privacy ('public'|'private'|'connections')
 * @param {File[]} media - Media files to attach
 * @param {string} type - Media type ('image'|'video'|'document'|'link')
 * @param {string} [title] - Optional media title
 * @param {string} [description] - Optional media description
 * @returns {Post} Created post with media
 */
export const createPost = [
  ...createPostValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { content, privacy } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
      const post = await postService.createPost(userId, content, privacy);
      const postId = post.id;

      // Handle file uploads if any
      if (files?.length) {
        await Promise.all(
          files.map(async (file) => {
            // Upload file to file service
            //const fileId = await postFileProducer.uploadFile(file, userId);
            const fileId = 12321123; // Mocked fileId for testing
            // Add media to post with received URL
            return postService.addMediaToPost({
              post_id: postId,
              url: String(fileId),
              thumbnail_url: null,

              type: req.body.type,
              title: req.body.title,
              description: req.body.description,
              created_at: new Date(),
              updated_at: new Date(),
            });
          })
        );
      }

      // Get the final post with all media
      const finalPost = await postService.getPostById(post.id);
      res.json({ success: true, data: finalPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Server error",
      });
    }
  },
];

export const getPostById = async (req: AuthenticatedRequest, res: Response) => {
  const postId = parseInt(req.params.postId);

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const updatePost = [
  ...updatePostValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const postId = parseInt(req.params.postId);
    const { content, privacy } = req.body;
    try {
      const post = await postService.updatePost(postId, content,privacy);
      if (!post) {
        return res.status(404).json({
          success: false,
          error: "Post not found",
        });
      }
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
];

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  const postId = parseInt(req.params.postId);

  try {
    const deleted = await postService.deletePost(postId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }
    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Engagement Controllers
export const likePost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const postId = parseInt(req.params.postId);

  try {
    const result = await postService.toggleLike(userId, postId);
    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const createComment = [
  ...commentValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId);
    const { content, parentCommentId } = req.body;

    try {
      const comment = await postService.createComment(
        userId,
        postId,
        content,
        parentCommentId
      );
      res.json({ success: true, data: comment });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
];

export const getPostComments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const postId = parseInt(req.params.postId);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const comments = await postService.getPostComments(
      postId,
      limit,
      (page - 1) * limit
    );
    const total = await postService.getPostCommentsCount(postId);

    res.json({
      success: true,
      data: comments,
      pagination: { total, page, limit },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const updateComment = [
  ...commentValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;
    const userId = req.user!.id;

    try {
      const comment = await postService.updateComment(
        commentId,
        content,
        userId
      );
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: "Comment not found",
        });
      }
      res.json({ success: true, data: comment });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
];

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const commentId = parseInt(req.params.commentId);
  const userId = req.user!.id;

  try {
    const deleted = await postService.deleteComment(commentId, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }
    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const sharePost = [
  ...sharePostValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId);
    const { comment, privacy } = req.body;

    try {
      const share = await postService.sharePost(userId, postId, comment);
      res.json({ success: true, data: share });
    } catch (error) {
      console.error("Error sharing post:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
];

// Utility Controllers
export const getPostEngagement = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const postId = parseInt(req.params.postId);

  try {
    const engagement = await postService.getPostEngagement(postId);
    res.json({ success: true, data: engagement });
  } catch (error) {
    console.error("Error fetching engagement:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const savePost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const postId = parseInt(req.params.postId);

  try {
    const result = await postService.savePost(userId, postId);
    res.json({
      success: true,
      data: {
        saved: true,
        message: "Post saved successfully",
      },
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getSavedPosts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const savedPosts = await postService.getSavedPosts(
      userId,
      limit,
      (page - 1) * limit
    );
    res.json({ success: true, data: savedPosts });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const searchPosts = async (req: AuthenticatedRequest, res: Response) => {
  const query = req.query.q as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const posts = await postService.searchPosts(
      query,
      limit,
      (page - 1) * limit
    );
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// export const addMediaToPost = [
//   mediaUploadValidationRules,
//   validate,
//   async (req: AuthenticatedRequest, res: Response) => {
//     const postId = parseInt(req.params.postId);
//     const { type, title, description } = req.body;
//     const file = req.file;

//     try {
//       const media = await postService.addMediaToPost(postId, {
//         file,
//         type,
//         title,
//         description,
//         url: req.body.url,
//       });
//       res.json({ success: true, data: media });
//     } catch (error) {
//       console.error("Error adding media:", error);
//       res.status(500).json({ success: false, error: "Server error" });
//     }
//   }
// ];

export const tagUsers = [
  tagUsersValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const postId = parseInt(req.params.postId);
    const { userIds, commentId } = req.body;

    try {
      const tags = await postService.tagUsers(postId, userIds, commentId);
      res.json({ success: true, data: tags });
    } catch (error) {
      console.error("Error tagging users:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
];
