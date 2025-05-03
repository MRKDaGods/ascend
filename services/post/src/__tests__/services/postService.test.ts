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
    //   expect(result.user.id).toBe(mockUserId);
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
  });
  
});