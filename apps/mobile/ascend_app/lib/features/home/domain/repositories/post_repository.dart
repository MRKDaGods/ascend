import 'package:ascend_app/features/home/domain/models/post_model.dart';

/// Abstract repository interface for post-related operations
abstract class PostRepository {
  /// Fetches a list of all posts
  Future<List<PostModel>> getPosts();
  
  /// Fetches a single post by ID
  Future<PostModel?> getPostById(String postId);
  
  /// Toggles like status of a post with a specific reaction type
  Future<void> toggleLikePost(String postId, String reactionType);
  
  /// Shares a post
  Future<void> sharePost(String postId);
  
  /// Saves a post for later
  Future<void> savePost(String postId);
  
  /// Marks a post as "not interested"
  Future<void> markNotInterested(String postId);
  
  /// Unfollows a user who created a post
  Future<void> unfollowUser(String postId, String ownerName);
  
  /// Reports a post
  Future<void> reportPost(String postId);
  
  /// Removes a post with a specific reason
  Future<void> removePost(String postId, String reason);
  
  /// Undoes the most recent post removal
  Future<PostModel?> undoRemovePost();
  
  /// Adds a comment to a post
  Future<void> addComment(String postId, String comment);
  
  /// Gets sponsored posts only
  Future<List<PostModel>> getSponsoredPosts();
  
  /// Gets recently viewed posts
  Future<List<PostModel>> getRecentlyViewedPosts();
  
  /// Marks a post as viewed
  Future<void> markPostAsViewed(String postId);
}