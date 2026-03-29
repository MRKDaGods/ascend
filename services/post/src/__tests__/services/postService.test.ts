import { PostService } from '../../services/postService';
import db from '@shared/config/db';

// Mocking the database and shared utils
jest.mock('@shared/config/db', () => ({
  query: jest.fn()
}));

jest.mock('@shared/utils/files', () => ({
  getPresignedUrl: jest.fn().mockImplementation((fileId) => Promise.resolve(`https://presigned-url.com/${fileId}`))
}));

describe('PostService', () => {
  let postService: PostService;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    postService = new PostService();
  });

  describe('createPost', () => {
    it('should create a new post successfully', async () => {
      // Mock the database responses
      const mockPostId = 1;
      const mockUserId = 123;
      const mockContent = 'This is a test post';
      const mockPrivacy = 'public';
      const mockCreatedAt = new Date().toISOString();
      
      // Mock first query (INSERT)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: mockPostId,
          user_id: mockUserId,
          content: mockContent,
          privacy: mockPrivacy,
          is_edited: false,
          created_at: mockCreatedAt,
          updated_at: mockCreatedAt
        }]
      });
      
      // Mock getPostById responses for different queries
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: mockPostId,
          user_id: mockUserId,
          content: mockContent,
          privacy: mockPrivacy,
          is_edited: false,
          created_at: mockCreatedAt,
          updated_at: mockCreatedAt,
          user: {
            id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture_id: 456
          }
        }]
      });
      
      // Mock media query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock comments count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Call the method
      const result = await postService.createPost(mockUserId, mockContent, mockPrivacy);
      
      // Verify the result
      expect(result).toBeDefined();
      expect(result.id).toBe(mockPostId);
      expect(result.content).toBe(mockContent);
      expect(result.privacy).toBe(mockPrivacy);
      expect(result.user).toBeDefined();
      expect(result.media).toEqual([]);
      expect(result.likes_count).toBe(0);
      expect(result.comments_count).toBe(0);
      expect(result.shares_count).toBe(0);
      
      // Verify the DB was called correctly
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO post_service.posts'),
        [mockUserId, mockContent, mockPrivacy]
      );
    });
    
    it('should throw an error when post not found after creation', async () => {
      // Mock database responses for a failed creation
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: 1 }]
      });
      
      // Mock getPostById to return null (post not found)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Call the method and expect it to throw
      await expect(
        postService.createPost(123, 'Test content', 'public')
      ).rejects.toThrow('Post not found after creation');
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const mockPostId = 1;
      const mockContent = 'Updated content';
      const mockPrivacy = 'connections';
      
      // Mock update query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockPostId }]
      });
      
      // Mock getPostById responses for different queries
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: mockPostId,
          content: mockContent,
          privacy: mockPrivacy,
          is_edited: true,
          user: {
            id: 123,
            first_name: 'John',
            last_name: 'Doe'
          }
        }]
      });
      
      // Mock media query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock comments count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      const result = await postService.updatePost(mockPostId, mockContent, mockPrivacy);
      
      // Verify the result
      expect(result).toBeDefined();
      expect(result?.content).toBe(mockContent);
      expect(result?.privacy).toBe(mockPrivacy);
      expect(result?.is_edited).toBe(true);
      
      // Verify the DB was called with correct parameters
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE post_service.posts'),
        expect.arrayContaining([mockContent, mockPrivacy, mockPostId])
      );
    });
    
    it('should return null when post not found', async () => {
      // Mock empty result from database
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      const result = await postService.updatePost(999, 'Test content');
      expect(result).toBeNull();
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Mock successful deletion
      (db.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1
      });
      
      const result = await postService.deletePost(1);
      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM post_service.posts'),
        [1]
      );
    });
    
    it('should return false when post not found', async () => {
      // Mock failed deletion (no rows affected)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 0
      });
      
      const result = await postService.deletePost(999);
      expect(result).toBe(false);
    });
  });

  describe('getCommentById', () => {
    it('should return comment with reactions and replies', async () => {
      const mockCommentId = 123;
      const mockUserId = 456;
      
      // Mock comment query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: mockCommentId,
          user_id: mockUserId,
          content: 'Test comment',
          user: {
            id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture_id: 789
          }
        }]
      });
      
      // Mock engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          like_count: 5,
          love_count: 2,
          support_count: 1,
          celebrate_count: 0,
          funny_count: 3,
          curious_count: 0,
          insightful_count: 1,
          total_reactions_count: 12
        }]
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: 124, content: 'Reply 1' }, { id: 125, content: 'Reply 2' }]
      });
      
      const result = await postService.getCommentById(mockCommentId);
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockCommentId);
      expect(result?.user?.id).toBe(mockUserId);
      expect(result?.reactions).toBeDefined();
      expect(result?.reactions?.total_reactions_count).toBe(12);
      expect(result?.replies).toHaveLength(2);
    });
    
    it('should return comment with default reaction counts when no engagement data', async () => {
      const mockCommentId = 123;
      
      // Mock comment query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: mockCommentId,
          content: 'Test comment',
          user: {
            id: 456,
            first_name: 'John',
            last_name: 'Doe'
          }
        }]
      });
      
      // Mock empty engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      const result = await postService.getCommentById(mockCommentId);
      
      expect(result).toBeDefined();
      expect(result?.reactions).toBeDefined();
      expect(result?.reactions?.total_reactions_count).toBe(0);
      expect(result?.reactions?.like_count).toBe(0);
      expect(result?.reactions?.love_count).toBe(0);
    });
    
    it('should return null when comment not found', async () => {
      // Mock empty comment query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      const result = await postService.getCommentById(999);
      
      expect(result).toBeNull();
    });
  });

  describe('reactToComment', () => {
    it('should add a reaction to a comment successfully', async () => {
      const mockCommentId = 123;
      const mockUserId = 456;
      const reactionType = 'like';
      
      // Mock getCommentById (comment exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockCommentId }]
      });
      
      // Mock engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock check for existing reaction
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock insert query
      (db.query as jest.Mock).mockResolvedValueOnce({});
      
      const result = await postService.reactToComment(mockUserId, mockCommentId, reactionType);
      
      expect(result).toEqual({ reacted: true, type: reactionType });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO post_service.comment_reactions'),
        [mockUserId, mockCommentId, reactionType]
      );
    });
    
    it('should remove a reaction when toggling the same reaction type', async () => {
      const mockCommentId = 123;
      const mockUserId = 456;
      const reactionType = 'like';
      
      // Mock getCommentById (comment exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockCommentId }]
      });
      
      // Mock engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock check for existing reaction (same type already exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ reaction_type: reactionType }]
      });
      
      // Mock delete query
      (db.query as jest.Mock).mockResolvedValueOnce({});
      
      const result = await postService.reactToComment(mockUserId, mockCommentId, reactionType);
      
      expect(result).toEqual({ reacted: false, type: reactionType });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM post_service.comment_reactions'),
        [mockUserId, mockCommentId]
      );
    });
    
    it('should update reaction when changing reaction type', async () => {
      const mockCommentId = 123;
      const mockUserId = 456;
      const oldReactionType = 'like';
      const newReactionType = 'love';
      
      // Mock getCommentById (comment exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockCommentId }]
      });
      
      // Mock engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock check for existing reaction (different type exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ reaction_type: oldReactionType }]
      });
      
      // Mock update query
      (db.query as jest.Mock).mockResolvedValueOnce({});
      
      const result = await postService.reactToComment(mockUserId, mockCommentId, newReactionType);
      
      expect(result).toEqual({ reacted: true, type: newReactionType });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE post_service.comment_reactions'),
        [newReactionType, mockUserId, mockCommentId]
      );
    });

    it('should throw error when comment not found', async () => {
      const mockUserId = 456;
      const mockCommentId = 999;
      const reactionType = 'like';
      
      // Mock getCommentById (comment not found)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      await expect(
        postService.reactToComment(mockUserId, mockCommentId, reactionType)
      ).rejects.toThrow('Comment not found');
    });

    it('should throw error when database operation fails', async () => {
      const mockUserId = 456;
      const mockCommentId = 123;
      const reactionType = 'like';
      
      // Mock getCommentById (comment exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockCommentId }]
      });
      
      // Mock engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock check for existing reaction
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock insert query failure
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await expect(
        postService.reactToComment(mockUserId, mockCommentId, reactionType)
      ).rejects.toThrow('Failed to react to comment');
    });
  });

  describe('getUserCommentReaction', () => {
    it('should return reaction info when user has reacted', async () => {
      const mockCommentId = 123;
      const mockUserId = 456;
      const reactionType = 'love';
      
      // Mock query for existing reaction
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ reaction_type: reactionType }]
      });
      
      const result = await postService.getUserCommentReaction(mockCommentId, mockUserId);
      
      expect(result.hasReacted).toBe(true);
      expect(result.reactionType).toBe(reactionType);
    });
    
    it('should indicate no reaction when user has not reacted', async () => {
      const mockCommentId = 123;
      const mockUserId = 456;
      
      // Mock query for no reaction
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      const result = await postService.getUserCommentReaction(mockCommentId, mockUserId);
      
      expect(result.hasReacted).toBe(false);
      expect(result.reactionType).toBeNull();
    });
    
    it('should throw error when database operation fails', async () => {
      const mockCommentId = 123;
      const mockUserId = 456;
      
      // Mock database error
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await expect(
        postService.getUserCommentReaction(mockCommentId, mockUserId)
      ).rejects.toThrow('Failed to get user reaction to comment');
    });
  });

  describe('getCommentReactionCounts', () => {
    it('should return reaction counts when comment has reactions', async () => {
      const mockCommentId = 123;
      
      // Mock query with reaction counts
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          like_count: 5,
          love_count: 2,
          support_count: 1,
          celebrate_count: 0,
          funny_count: 3,
          curious_count: 0,
          insightful_count: 1,
          total_reactions_count: 12,
          replies_count: 3
        }]
      });
      
      const result = await postService.getCommentReactionCounts(mockCommentId);
      
      expect(result.like_count).toBe(5);
      expect(result.love_count).toBe(2);
      expect(result.support_count).toBe(1);
      expect(result.celebrate_count).toBe(0);
      expect(result.funny_count).toBe(3);
      expect(result.curious_count).toBe(0);
      expect(result.insightful_count).toBe(1);
      expect(result.total_reactions_count).toBe(12);
      expect(result.replies_count).toBe(3);
    });
    
    it('should return zero counts when comment has no reactions', async () => {
      const mockCommentId = 123;
      
      // Mock query with no reaction counts
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      const result = await postService.getCommentReactionCounts(mockCommentId);
      
      expect(result.like_count).toBe(0);
      expect(result.love_count).toBe(0);
      expect(result.total_reactions_count).toBe(0);
      expect(result.replies_count).toBe(0);
    });
    
    it('should throw error when database operation fails', async () => {
      const mockCommentId = 123;
      
      // Mock database error
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await expect(
        postService.getCommentReactionCounts(mockCommentId)
      ).rejects.toThrow('Failed to get comment reaction counts');
    });
  });
  
  describe('getCommentReactions', () => {
    it('should return list of reactions for a comment', async () => {
      const mockCommentId = 123;
      
      // Mock comment query to verify comment exists
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockCommentId }]
      });
      
      // Mock engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock reactions query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            user_id: 1,
            reaction_type: 'like',
            created_at: '2025-05-03T12:00:00Z',
            user: { id: 1, first_name: 'John', last_name: 'Doe', profile_picture_id: 100 }
          },
          {
            user_id: 2,
            reaction_type: 'love',
            created_at: '2025-05-03T12:01:00Z',
            user: { id: 2, first_name: 'Jane', last_name: 'Smith', profile_picture_id: 101 }
          }
        ]
      });
      
      const result = await postService.getCommentReactions(mockCommentId);
      
      expect(result).toHaveLength(2);
      expect(result[0].reaction_type).toBe('like');
      expect(result[1].reaction_type).toBe('love');
      expect(result[0].user.id).toBe(1);
      expect(result[1].user.id).toBe(2);
    });
    
    it('should filter reactions by type when specified', async () => {
      const mockCommentId = 123;
      const reactionType = 'like';
      
      // Mock comment query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockCommentId }]
      });
      
      // Mock engagement query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock replies query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock reactions query with filter
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            user_id: 1,
            reaction_type: reactionType,
            created_at: '2025-05-03T12:00:00Z',
            user: { id: 1, first_name: 'John', last_name: 'Doe', profile_picture_id: null }
          }
        ]
      });
      
      const result = await postService.getCommentReactions(mockCommentId, reactionType);
      
      expect(result).toHaveLength(1);
      expect(result[0].reaction_type).toBe(reactionType);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/AND r\.reaction_type = \$2/),
        expect.arrayContaining([mockCommentId, reactionType])
      );
    });
    
    it('should throw error when comment not found', async () => {
      const mockCommentId = 999;
      
      // Mock comment query (comment not found)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      await expect(
        postService.getCommentReactions(mockCommentId)
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('reactToPost', () => {
    it('should add a reaction to a post successfully', async () => {
      const mockPostId = 123;
      const mockUserId = 456;
      const reactionType = 'like';
      
      // Mock getPostById (post exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockPostId }]
      });
      
      // Mock media query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock comments count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock check for existing reaction
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock insert query
      (db.query as jest.Mock).mockResolvedValueOnce({});
      
      // Mock updateReactionCounts
      (db.query as jest.Mock).mockResolvedValue({});
      
      const result = await postService.reactToPost(mockUserId, mockPostId, reactionType);
      
      expect(result).toEqual({ reacted: true, type: reactionType });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO post_service.reactions'),
        [mockUserId, mockPostId, reactionType]
      );
    });
    
    it('should remove a reaction when toggling the same reaction type', async () => {
      const mockPostId = 123;
      const mockUserId = 456;
      const reactionType = 'like';
      
      // Mock getPostById (post exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockPostId }]
      });
      
      // Mock media query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '1' }]
      });
      
      // Mock comments count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock check for existing reaction (same type already exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ reaction_type: reactionType }]
      });
      
      // Mock delete query
      (db.query as jest.Mock).mockResolvedValueOnce({});
      
      // Mock updateReactionCounts
      (db.query as jest.Mock).mockResolvedValue({});
      
      const result = await postService.reactToPost(mockUserId, mockPostId, reactionType);
      
      expect(result).toEqual({ reacted: false, type: reactionType });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM post_service.reactions'),
        [mockUserId, mockPostId]
      );
    });
  });

  describe('toggleSavePost', () => {
    it('should save a post when not previously saved', async () => {
      const mockPostId = 123;
      const mockUserId = 456;
      
      // Mock getPostById (post exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockPostId }]
      });
      
      // Mock media query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock comments count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock isPostSavedByUser (not saved)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: false }]
      });
      
      // Mock insert query
      (db.query as jest.Mock).mockResolvedValueOnce({});
      
      const result = await postService.toggleSavePost(mockUserId, mockPostId);
      
      expect(result).toEqual({ saved: true });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO post_service.saved_posts'),
        [mockUserId, mockPostId]
      );
    });
    
    it('should unsave a post when previously saved', async () => {
      const mockPostId = 123;
      const mockUserId = 456;
      
      // Mock getPostById (post exists)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: mockPostId }]
      });
      
      // Mock media query
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock comments count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock isPostSavedByUser (already saved)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: true }]
      });
      
      // Mock delete query
      (db.query as jest.Mock).mockResolvedValueOnce({});
      
      const result = await postService.toggleSavePost(mockUserId, mockPostId);
      
      expect(result).toEqual({ saved: false });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM post_service.saved_posts'),
        [mockUserId, mockPostId]
      );
    });
    
    it('should throw error when post not found', async () => {
      const mockPostId = 999;
      const mockUserId = 456;
      
      // Mock getPostById (post not found)
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      await expect(
        postService.toggleSavePost(mockUserId, mockPostId)
      ).rejects.toThrow('Post not found');
    });
  });

  describe('getSavedPosts', () => {
    it('should return saved posts for a user', async () => {
      const mockUserId = 456;
      
      // Mock query for saved posts
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            content: 'Saved post 1',
            user: { id: 100, first_name: 'John', last_name: 'Doe', profile_picture_id: 500 }
          },
          {
            id: 2,
            content: 'Saved post 2',
            user: { id: 101, first_name: 'Jane', last_name: 'Smith', profile_picture_id: null }
          }
        ]
      });
      
      // Mock media query for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: 10, url: 'media1.jpg', type: 'image' }]
      });
      
      // Mock likes count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '5' }]
      });
      
      // Mock comments count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '3' }]
      });
      
      // Mock shares count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '1' }]
      });
      
      // Mock media query for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '2' }]
      });
      
      // Mock comments count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      const result = await postService.getSavedPosts(mockUserId, 10, 0);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].media).toHaveLength(1);
      expect(result[0].likes_count).toBe(5);
      expect(result[0].comments_count).toBe(3);
      expect(result[1].id).toBe(2);
      expect(result[1].media).toHaveLength(0);
    });
  });
  
  describe('getUserPosts', () => {
    it('should return a user\'s posts in descending order', async () => {
      const mockUserId = 123;
      
      // Mock query for user posts
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            content: 'User post 1',
            created_at: '2025-05-03T12:00:00Z',
            user: { id: mockUserId, first_name: 'John', last_name: 'Doe', profile_picture_id: 500 }
          },
          {
            id: 2,
            content: 'User post 2',
            created_at: '2025-05-02T12:00:00Z',
            user: { id: mockUserId, first_name: 'John', last_name: 'Doe', profile_picture_id: null }
          }
        ]
      });
      
      // Mock media query for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: 10, url: 'media1.jpg', type: 'image' }]
      });
      
      // Mock likes count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '5' }]
      });
      
      // Mock comments count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '3' }]
      });
      
      // Mock shares count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '1' }]
      });
      
      // Mock media query for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '2' }]
      });
      
      // Mock comments count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      const result = await postService.getUserPosts(mockUserId);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].content).toBe('User post 1');
      expect(result[1].id).toBe(2);
      expect(result[1].content).toBe('User post 2');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/ORDER BY p\.created_at DESC/),
        expect.arrayContaining([mockUserId])
      );
    });
    
    it('should return a user\'s posts in ascending order', async () => {
      const mockUserId = 123;
      
      // Mock query for user posts
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            id: 2,
            content: 'User post 2',
            created_at: '2025-05-02T12:00:00Z',
            user: { id: mockUserId, first_name: 'John', last_name: 'Doe' }
          },
          {
            id: 1,
            content: 'User post 1',
            created_at: '2025-05-03T12:00:00Z',
            user: { id: mockUserId, first_name: 'John', last_name: 'Doe' }
          }
        ]
      });
      
      // Mock media query for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '2' }]
      });
      
      // Mock comments count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock shares count for post 2
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '0' }]
      });
      
      // Mock media query for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });
      
      // Mock likes count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '5' }]
      });
      
      // Mock comments count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '3' }]
      });
      
      // Mock shares count for post 1
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '1' }]
      });
      
      const result = await postService.getUserPosts(mockUserId, 20, 0, 'asc');
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(1);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringMatching(/ORDER BY p\.created_at ASC/),
        expect.arrayContaining([mockUserId])
      );
    });
  });

  describe('getUserPostsCount', () => {
    it('should return the number of posts for a user', async () => {
      const mockUserId = 123;
      
      // Mock query for user posts count
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ count: '5' }]
      });
      
      const result = await postService.getUserPostsCount(mockUserId);
      
      expect(result).toBe(5);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) as count'),
        [mockUserId]
      );
    });
    
    it('should throw error when database operation fails', async () => {
      const mockUserId = 123;
      
      // Mock database error
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await expect(
        postService.getUserPostsCount(mockUserId)
      ).rejects.toThrow('Failed to get user posts count');
    });
  });
});