import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import validate from "@shared/middleware/validationMiddleware";
import { Response } from "express";
import postService from "../services/postService";
import {
  createPostValidationRules,
  updatePostValidationRules,
  commentValidationRules,
  sharePostValidationRules,
  tagUsersValidationRules,
  searchValidationRules,
  mediaUploadValidationRules,
} from "../validations/postValidation";
import {
  callRPC,
  Events,
  FileUploadPayload,
  getRPCQueueName,
  FileDeletePayload,
  publishEvent,
} from "@shared/rabbitMQ";
import { Services } from "@ascend/shared";
import { getPresignedUrl } from "@shared/utils/files";

/**
 * Get the user's feed with posts from connections and followed users
 * @route GET /feed
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {object} Object containing feed posts and pagination info
 */
// Feed Controllers
export const getFeed = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(String(req.query.page).trim()) || 1;
  const limit = parseInt(String(req.query.limit).trim()) || 10;

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
            const fileId = await uploadFile(file, userId, "post_media");
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
/**
 * Get a post by its ID
 * @route GET /posts/:postId
 * @param {string} postId - The ID of the post to retrieve
 * @returns {object} Post object with media and author information
 */
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
/**
 * Update an existing post
 * @route PUT /posts/:postId
 * @param {string} postId - The ID of the post to update
 * @param {string} content - Updated post content
 * @param {string} privacy - Updated privacy setting ('public'|'private'|'connections')
 * @returns {object} Updated post object
 */
export const updatePost = [
  ...updatePostValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    const postId = parseInt(req.params.postId);
    const { content, privacy } = req.body;
    try {
      const post = await postService.updatePost(postId, content, privacy);
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
/**
 * Delete a post and its associated media
 * @route DELETE /posts/:postId
 * @param {string} postId - The ID of the post to delete
 * @returns {object} Success message
 */
export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  const postId = parseInt(req.params.postId);
  const userId = req.user!.id;

  try {
    // First, get the post to access its media
    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // Check if user is authorized to delete this post
    if (post.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to delete this post",
      });
    }

    // Extract media file IDs before deleting the post
    const mediaFileIds: number[] = [];
    if (post.media && post.media.length > 0) {
      post.media.forEach((media) => {
        // Get the original file ID (either from url or by parsing url)
        const fileId = parseInt(media.url);

        if (!isNaN(fileId)) {
          mediaFileIds.push(fileId);
        }

        // Also get thumbnail if it exists
        if (media.thumbnail_url) {
          const thumbnailId = parseInt(media.url);
          if (!isNaN(thumbnailId)) {
            mediaFileIds.push(thumbnailId);
          }
        }
      });
    }

    // Delete the post from database
    const deleted = await postService.deletePost(postId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: "Failed to delete post",
      });
    }

    // Now delete all associated media files
    if (mediaFileIds.length > 0) {
      await Promise.all(mediaFileIds.map((fileId) => deleteFile(fileId)));
    }

    res.json({
      success: true,
      message: "Post and associated media deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Like or unlike a post
 * @route POST /posts/:postId/like
 * @param {string} postId - The ID of the post to like/unlike
 * @returns {object} Success message
 */
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

/**
 * Create a comment on a post
 * @route POST /posts/:postId/comments
 * @param {string} postId - The ID of the post to comment on
 * @param {string} content - Comment content
 * @param {number} [parentCommentId] - Optional parent comment ID for replies
 * @returns {object} Created comment object
 */
export const createComment = [
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

/**
 * Get comments for a post
 * @route GET /posts/:postId/comments
 * @param {string} postId - The ID of the post to get comments for
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of comments per page (default: 10)
 * @returns {object} Comments and pagination info
 */
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

/**
 * Update a comment
 * @route PUT /comments/:commentId
 * @param {string} commentId - The ID of the comment to update
 * @param {string} content - Updated comment content
 * @returns {object} Updated comment object
 */
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

/**
 * Delete a comment
 * @route DELETE /comments/:commentId
 * @param {string} commentId - The ID of the comment to delete
 * @returns {object} Success message
 */
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

/**
 * Share a post
 * @route POST /posts/:postId/share
 * @param {string} postId - The ID of the post to share
 * @param {string} [comment] - Optional comment with the share
 * @param {string} [privacy] - Privacy setting for the share
 * @returns {object} Created share object
 */
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

/**
 * Get engagement metrics for a post
 * @route GET /posts/:postId/engagement
 * @param {string} postId - The ID of the post to get engagement for
 * @param {boolean} likes - Whether to include likes data
 * @param {boolean} comments - Whether to include comments data
 * @param {boolean} shares - Whether to include shares data
 * @returns {object} Post engagement metrics
 */
// Utility Controllers
export const getPostEngagement = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const postId = parseInt(req.params.postId);
  const { likes = false, comments = false, shares = false } = req.query;

  try {
    const engagement = await postService.getPostEngagement(
      postId,
      Boolean(likes === "true"),
      Boolean(comments === "true"),
      Boolean(shares === "true")
    );
    res.json({ success: true, data: engagement });
  } catch (error) {
    console.error("Error fetching engagement:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Save or unsave a post
 * @route POST /posts/:postId/save
 * @param {string} postId - The ID of the post to save/unsave
 * @returns {object} Success message
 */
export const savePost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const postId = parseInt(req.params.postId);

  try {
    const result = await postService.toggleSavePost(userId, postId);
    res.json({
      success: true,
      data: {
        saved: true,
        message: "Post saved/UnSaved successfully",
      },
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get posts saved by the user
 * @route GET /posts/saved
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {object} Saved posts
 */
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

/**
 * Search for posts
 * @route POST /posts/search
 * @param {string} q - Search query
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of results per page (default: 10)
 * @returns {object} Matching posts
 */
export const searchPosts = async (req: AuthenticatedRequest, res: Response) => {
  const query = req.body.q as string;
  const page = parseInt(req.body.page as string) || 1;
  const limit = parseInt(req.body.limit as string) || 10;
  console.log("Query:", query, "Page:", page, "Limit:", limit);
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

/**
 * Tag users in a post or comment
 * @route POST /tags
 * @param {string} contentType - Type of content ('post' or 'comment')
 * @param {number} contentId - ID of the content to tag users in
 * @param {Array} tags - Array of user tags with userId, startIndex, and endIndex
 * @returns {object} Created tags
 */
export const tagUsers = async (req: AuthenticatedRequest, res: Response) => {
  const { contentType, contentId, tags } = req.body;
  // Check if user is authenticated
  if (!req.user?.id) {
    return res.status(401).json({
      success: false,
      error: "User not authenticated",
    });
  }
  // Validate required fields
  if (!contentType || !contentId || !tags) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: contentType, contentId, or tags",
    });
  }

  // Validate contentType
  if (!["post", "comment"].includes(contentType)) {
    return res.status(400).json({
      success: false,
      error: "Invalid contentType. Must be 'post' or 'comment'",
    });
  }

  try {
    // Extract user IDs and positions from tags
    const tagData = tags.map((tag: any) => ({
      userId: tag.userId,
      startIndex: tag.startIndex,
      endIndex: tag.endIndex,
    }));

    // Call service layer
    const createdTags = await postService.tagUsers({
      contentType,
      contentId: parseInt(contentId),
      tags: tagData,
      taggerUserId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: {
        contentType,
        contentId,
        tags: createdTags,
      },
    });
  } catch (error) {
    console.error("Error tagging users:", error);

    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get users tagged in a post or comment
 * @route GET /tags/:contentType/:contentId
 * @param {string} contentType - Type of content ('post' or 'comment')
 * @param {number} contentId - ID of the content
 * @returns {object} Tagged users
 */
export const getTaggedUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { contentType, contentId } = req.params;

  // Validate contentType
  if (!["post", "comment"].includes(contentType)) {
    return res.status(400).json({
      success: false,
      error: "Invalid contentType. Must be 'post' or 'comment'",
    });
  }

  try {
    const taggedUsers = await postService.getTaggedUsers({
      contentType: contentType as "post" | "comment",
      contentId: parseInt(contentId),
    });

    res.json({
      success: true,
      data: taggedUsers,
    });
  } catch (error) {
    console.error("Error getting tagged users:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

/**
 * Remove a user tag
 * @route DELETE /tags/:tagId
 * @param {string} tagId - The ID of the tag to remove
 * @returns {object} Success message
 */
export const removeTag = async (req: AuthenticatedRequest, res: Response) => {
  const tagId = parseInt(req.params.tagId);
  const userId = req.user!.id;

  try {
    const removedTag = await postService.removeTag({
      tagId,
      userId,
    });

    res.json({
      success: true,
      data: removedTag,
      message: "Tag removed successfully",
    });
  } catch (error) {
    console.error("Error removing tag:", error);

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

enum ReportReason {
  SPAM = "spam",
  HARASSMENT = "harassment",
  VIOLENCE = "violence",
  HATE_SPEECH = "hate_speech",
  MISINFORMATION = "misinformation",
  OTHER = "other",
}
/**
 * Report a post
 * @route POST /posts/:postId/report
 * @param {string} postId - The ID of the post to report
 * @param {string} reason - Reason for reporting ('spam'|'harassment'|'violence'|'hate_speech'|'misinformation'|'other')
 * @param {string} [description] - Optional description of the report
 * @returns {object} Created report
 */
export const reportPost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const postId = Number(req.params.postId);
  const { reason, description } = req.body;

  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  if (!Object.values(ReportReason).includes(reason)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid report reason" });
  }

  try {
    const report = await postService.createReport({
      userId,
      postId,
      reason,
      description: description?.trim() || null,
    });

    res.status(201).json({
      success: true,
      data: report,
      message: "Post reported successfully",
    });
  } catch (error) {
    console.error("Error reporting post:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Delete a report
 * @route DELETE /reports/:reportId
 * @param {string} reportId - The ID of the report to delete
 * @returns {object} Success message
 */
export const deleteReport = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const reportId = Number(req.params.reportId);
  const userId = req.user!.id;
  // const isAdmin = req.user!.role === "admin"; // Assuming role exists in `req.user`
  const isAdmin = true; // Temp until someone implements the user roles
  if (isNaN(reportId)) {
    return res.status(400).json({ success: false, error: "Invalid report ID" });
  }

  try {
    const report = await postService.getReportById(reportId);

    if (!report) {
      return res
        .status(404)
        .json({ success: false, error: "Report not found" });
    }

    if (report.reporter_id !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized to delete this report" });
    }

    await postService.deleteReport(reportId);

    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Uploads a file to the file service using RPC
 * @param file - The file to upload
 * @param userId - The user ID
 * @param context - The context of the file (e.g., 'post_media')
 * @returns Promise with the file ID
 */
const uploadFile = async (
  file: Express.Multer.File,
  userId: number,
  context: string = "post_media"
): Promise<number> => {
  try {
    // Create RPC queue name for file upload
    const fileRpcQueue = getRPCQueueName(Services.FILE, Events.FILE_UPLOAD_RPC);

    // Prepare payload
    const payload: FileUploadPayload.Request = {
      user_id: userId,
      file_buffer: file.buffer.toString("base64"),
      file_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      context: context,
    };

    // Make RPC call with a 60-second timeout
    const response = await callRPC<FileUploadPayload.Response>(
      fileRpcQueue,
      payload,
      60000
    );

    // Return the file ID
    return response.file_id;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
};

/**
 * Delete a file from the file service
 * @param fileId - The ID of the file to delete
 */
const deleteFile = async (fileId: number): Promise<void> => {
  if (!fileId) return;

  try {
    const deletePayload: FileDeletePayload = {
      file_id: fileId,
    };
    await publishEvent(Events.FILE_DELETE, deletePayload);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
