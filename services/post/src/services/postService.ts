import db from "@shared/config/db";
import {
  Post,
  Media,
  Like,
  Comment,
  Share,
  PostEngagement,
  FeedItemType,
  UserTag,
  SavedPost,
} from "@shared/models";

export class PostService {
  // Post CRUD operations
  async createPost(
    userId: number,
    content: string,
    privacy: Post["privacy"]
  ): Promise<Post> {
    const result = await db.query(
      `INSERT INTO post_service.posts (user_id, content, privacy, is_edited, created_at, updated_at) 
       VALUES ($1, $2, $3, false, NOW(), NOW()) RETURNING *`,
      [userId, content, privacy]
    );

    const post = result.rows[0];

    const createdPost = await this.getPostById(post.id);
    if (!createdPost) {
      throw new Error("Post not found after creation");
    }
    return createdPost;
  }

  async getPostById(postId: number): Promise<Post | null> {
    const postResult = await db.query(
      `SELECT p.*, 
        json_build_object(
          'id', u.user_id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_picture_url', u.profile_picture_id
        ) as user
       FROM post_service.posts p
       JOIN user_service.profiles u ON p.user_id = u.user_id
       WHERE p.id = $1`,
      [postId]
    );

    if (postResult.rows.length === 0) return null;

    const post = postResult.rows[0];
    post.media = await this.getPostMedia(postId);
    post.likes_count = await this.getPostLikesCount(postId);
    post.comments_count = await this.getPostCommentsCount(postId);
    post.shares_count = await this.getPostSharesCount(postId);

    return post;
  }

  async updatePost(
    postId: number, 
    content: string, 
    privacy?: Post["privacy"]
  ): Promise<Post | null> {
    const updateFields = [];
    const values = [];
    let valueIndex = 1;
  
    // Add content update if provided
    if (content) {
      updateFields.push(`content = $${valueIndex}`);
      values.push(content);
      valueIndex++;
    }
  
    // Add privacy update if provided
    if (privacy) {
      updateFields.push(`privacy = $${valueIndex}`);
      values.push(privacy);
      valueIndex++;
    }
  
    // Always update is_edited and updated_at
    updateFields.push('is_edited = true');
    updateFields.push('updated_at = NOW()');
  
    // Add postId as the last parameter
    values.push(postId);
     // Debug logging
     console.log('=== Update Post Debug Info ===');
     console.log('PostID:', postId);
     console.log('Update Fields:', updateFields);
     console.log('Values Array:', values);
     console.log('Current Value Index:', valueIndex);
     console.log('Generated SQL:', `UPDATE post_service.posts SET ${updateFields.join(', ')} WHERE id = $${valueIndex}`);
     console.log('===========================');
   
    const result = await db.query(
      `UPDATE post_service.posts 
       SET ${updateFields.join(', ')}
       WHERE id = $${valueIndex} RETURNING *`,
      values
    );
  
    return result.rows[0] ? this.getPostById(postId) : null;
  }

  async deletePost(postId: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM post_service.posts WHERE id = $1",
      [postId]
    );
    if (result.rowCount == null) return false;
    return result.rowCount > 0;
  }

  public async addMediaToPost(media: Omit<Media, 'id'>): Promise<Media> {
    if (!media.url || !media.type || !media.post_id) {
      throw new Error('Required media fields missing: url, type, or post_id');
    }
    // Check if post exists before adding media
    const postExists = await this.getPostById(media.post_id);
    if (!postExists) {
        throw new Error(`Cannot add media: Post with ID ${media.post_id} does not exist`);
    }

    const result = await db.query(
      `INSERT INTO post_service.media (post_id, url, type, thumbnail_url, title, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
      [
        media.post_id,
        media.url,
        media.type,
        media.thumbnail_url,
        media.title,
        media.description,
      ]
    );
  
    if (!result.rows[0]) {
      throw new Error('Failed to add media to post');
    }
  
    console.log('Media added successfully:', result.rows[0]);
    return result.rows[0];
  }

  private async getPostMedia(postId: number): Promise<Media[]> {
    const result = await db.query(
      "SELECT * FROM post_service.media WHERE post_id = $1",
      [postId]
    );
    return result.rows;
  }

  async toggleLike(userId: number, postId: number): Promise<{ liked: boolean }> {
    try {
      // Check if post exists first
      const post = await this.getPostById(postId);
      if (!post) {
        throw new Error('Post not found');
      }
  
      // Check if already liked
      const isLiked = await this.isPostLikedByUser(postId, userId);
  
      if (isLiked) {
        // Unlike
        await db.query(
          "DELETE FROM post_service.likes WHERE user_id = $1 AND post_id = $2",
          [userId, postId]
        );
        return { liked: false };
      } else {
        // Like
        await db.query(
          `INSERT INTO post_service.likes (user_id, post_id, created_at)
           VALUES ($1, $2, NOW())`,
          [userId, postId]
        );
        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw new Error('Failed to toggle like');
    }
  }

  async unlikePost(userId: number, postId: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM post_service.likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );
    if (result.rowCount == null) return false;
    return (result.rowCount ?? 0) > 0;
  }

  // Comment operations
  async createComment(
    userId: number,
    postId: number,
    content: string,
    parentCommentId?: number
  ): Promise<Comment> {
    const result = await db.query(
      `INSERT INTO post_service.comments 
       (user_id, post_id, parent_comment_id, content, is_edited, created_at, updated_at)
       VALUES ($1, $2, $3, $4, false, NOW(), NOW()) RETURNING *`,
      [userId, postId, parentCommentId, content]
    );
    const comment = await this.getCommentById(result.rows[0].id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return comment;
  }

  async getCommentById(commentId: number): Promise<Comment | null> {
    const result = await db.query(
      `SELECT c.*, 
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_picture_url', u.profile_picture_url
        ) as user
       FROM post_service.comments c
       JOIN user_service.users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [commentId]
    );

    if (result.rows.length === 0) return null;

    const comment = result.rows[0];
    comment.replies = await this.getCommentReplies(commentId);
    return comment;
  }

  async getPostComments(
    postId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<Comment[]> {
    const result = await db.query(
      `SELECT c.*, 
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_picture_url', u.profile_picture_url
        ) as user
       FROM post_service.comments c
       JOIN user_service.users u ON c.user_id = u.id
       WHERE c.post_id = $1 AND c.parent_comment_id IS NULL
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [postId, limit, offset]
    );

    const comments = result.rows;
    for (const comment of comments) {
      comment.replies = await this.getCommentReplies(comment.id);
    }

    return comments;
  }

  async updateComment(
    commentId: number,
    content: string,
    userId: number
  ): Promise<Comment | null> {
    // First check if user owns the comment
    const ownerCheck = await db.query(
      "SELECT user_id FROM post_service.comments WHERE id = $1",
      [commentId]
    );

    if (!ownerCheck.rows.length || ownerCheck.rows[0].user_id !== userId) {
      return null;
    }

    const result = await db.query(
      `UPDATE post_service.comments 
       SET content = $1, is_edited = true, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [content, commentId, userId]
    );

    if (!result.rows.length) return null;
    return this.getCommentById(commentId);
  }

  async deleteComment(commentId: number, userId: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM post_service.comments WHERE id = $1 AND user_id = $2",
      [commentId, userId]
    );

    return (result.rowCount ?? 0) > 0;
  }

  async getPostCommentsCount(postId: number): Promise<number> {
    const result = await db.query(
      `SELECT COUNT(*) 
       FROM post_service.comments 
       WHERE post_id = $1`,
      [postId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  // Share operations
  async sharePost(
    userId: number,
    postId: number,
    comment?: string
  ): Promise<Share> {
    const result = await db.query(
      `INSERT INTO post_service.shares (user_id, post_id, comment, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [userId, postId, comment]
    );
    return result.rows[0];
  }

  // Feed operations
  async getFeed(
    userId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<FeedItemType[]> {
    const result = await db.query(
      `SELECT p.*, 
        'post' as type,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_picture_url', u.profile_picture_url
        ) as user
       FROM post_service.posts p
       JOIN user_service.users u ON p.user_id = u.id
       WHERE p.privacy = 'public'
         OR (p.privacy = 'connections' AND EXISTS (
           SELECT 1 FROM user_service.connections 
           WHERE (user_id1 = $1 AND user_id2 = p.user_id)
              OR (user_id2 = $1 AND user_id1 = p.user_id)
         ))
         OR (p.privacy = 'private' AND p.user_id = $1)
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const feed = result.rows;

    // Enhance feed items with engagement metrics
    for (const item of feed) {
      item.media = await this.getPostMedia(item.id);
      item.likes_count = await this.getPostLikesCount(item.id);
      item.comments_count = await this.getPostCommentsCount(item.id);
      item.shares_count = await this.getPostSharesCount(item.id);
    }

    return feed;
  }

  // Helper methods for counting engagements
  private async getPostLikesCount(postId: number): Promise<number> {
    const result = await db.query(
      "SELECT COUNT(*) FROM post_service.likes WHERE post_id = $1",
      [postId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  private async getPostSharesCount(postId: number): Promise<number> {
    const result = await db.query(
      "SELECT COUNT(*) FROM post_service.shares WHERE post_id = $1",
      [postId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  private async getCommentReplies(commentId: number): Promise<Comment[]> {
    const result = await db.query(
      `SELECT c.*, 
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_picture_url', u.profile_picture_url
        ) as user
       FROM post_service.comments c
       JOIN user_service.users u ON c.user_id = u.id
       WHERE c.parent_comment_id = $1
       ORDER BY c.created_at ASC`,
      [commentId]
    );
    return result.rows;
  }

  // Search operations
  async searchPosts(
    query: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Post[]> {
    const result = await db.query(
      `SELECT p.*, 
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_picture_url', u.profile_picture_url
        ) as user
       FROM post_service.posts p
       JOIN user_service.users u ON p.user_id = u.id
       WHERE p.content ILIKE $1 AND p.privacy = 'public'
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${query}%`, limit, offset]
    );

    const posts = result.rows;
    for (const post of posts) {
      post.media = await this.getPostMedia(post.id);
      post.likes_count = await this.getPostLikesCount(post.id);
      post.comments_count = await this.getPostCommentsCount(post.id);
      post.shares_count = await this.getPostSharesCount(post.id);
    }

    return posts;
  }

  // Engagement metrics
  async getPostEngagement(postId: number): Promise<PostEngagement> {
    return {
      post_id: postId,
      likes_count: await this.getPostLikesCount(postId),
      comments_count: await this.getPostCommentsCount(postId),
      shares_count: await this.getPostSharesCount(postId),
      last_updated: new Date(),
    };
  }

  // Save/Unsave operations
  async savePost(userId: number, postId: number): Promise<SavedPost> {
    const result = await db.query(
      `INSERT INTO post_service.saved_posts (user_id, post_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, post_id) DO NOTHING
       RETURNING *`,
      [userId, postId]
    );
    return result.rows[0];
  }

  async getSavedPosts(
    userId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<Post[]> {
    const result = await db.query(
      `SELECT p.*, 
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_picture_url', u.profile_picture_url
        ) as user,
        sp.created_at as saved_at
       FROM post_service.saved_posts sp
       JOIN post_service.posts p ON sp.post_id = p.id
       JOIN user_service.users u ON p.user_id = u.id
       WHERE sp.user_id = $1
       ORDER BY sp.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const posts = result.rows;
    for (const post of posts) {
      post.media = await this.getPostMedia(post.id);
      post.likes_count = await this.getPostLikesCount(post.id);
      post.comments_count = await this.getPostCommentsCount(post.id);
      post.shares_count = await this.getPostSharesCount(post.id);
    }

    return posts;
  }

  // Tag users
  async tagUsers(
    postId: number,
    userIds: number[],
    commentId?: number
  ): Promise<UserTag[]> {
    const tags = await Promise.all(
      userIds.map((userId) =>
        db.query(
          `INSERT INTO post_service.user_tags 
           (user_id, post_id, comment_id, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING *`,
          [userId, postId, commentId]
        )
      )
    );

    return tags.map((t) => t.rows[0]);
  }

  // Helper method for feed count
  async getFeedCount(userId: number): Promise<number> {
    const result = await db.query(
      `SELECT COUNT(*)
       FROM post_service.posts p
       WHERE p.privacy = 'public'
         OR (p.privacy = 'connections' AND EXISTS (
           SELECT 1 FROM user_service.connections 
           WHERE (user_id1 = $1 AND user_id2 = p.user_id)
              OR (user_id2 = $1 AND user_id1 = p.user_id)
         ))
         OR (p.privacy = 'private' AND p.user_id = $1)`,
      [userId]
    );

    return parseInt(result.rows[0].count, 10);
  }

  // Check if post is liked by user
  async isPostLikedByUser(postId: number, userId: number): Promise<boolean> {
    const result = await db.query(
      "SELECT EXISTS(SELECT 1 FROM post_service.likes WHERE post_id = $1 AND user_id = $2)",
      [postId, userId]
    );
    return result.rows[0].exists;
  }

  // Check if post is saved by user
  async isPostSavedByUser(postId: number, userId: number): Promise<boolean> {
    const result = await db.query(
      "SELECT EXISTS(SELECT 1 FROM post_service.saved_posts WHERE post_id = $1 AND user_id = $2)",
      [postId, userId]
    );
    return result.rows[0].exists;
  }

  async updatePrivacy(
    postId: number,
    privacy: Post["privacy"]
  ): Promise<Post | null> {
    const result = await db.query(
      `UPDATE post_service.posts 
       SET privacy = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [privacy, postId]
    );

    return result.rows[0] ? this.getPostById(postId) : null;
  }

  async getPostWithEngagement(postId: number): Promise<Post & PostEngagement> {
    const post = await this.getPostById(postId);
    const engagement = await this.getPostEngagement(postId);

    return {
      ...post!,
      ...engagement,
    };
  }

  async updateEngagementCounts(postId: number): Promise<void> {
    await db.query(
      `INSERT INTO post_service.post_engagement 
       (post_id, likes_count, comments_count, shares_count, last_updated)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (post_id) DO UPDATE
       SET likes_count = $2,
           comments_count = $3,
           shares_count = $4,
           last_updated = NOW()`,
      [
        postId,
        await this.getPostLikesCount(postId),
        await this.getPostCommentsCount(postId),
        await this.getPostSharesCount(postId),
      ]
    );
  }
}

export default new PostService();
