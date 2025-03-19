import 'package:ascend_app/features/home/data/datasources/post_data_source.dart';
import 'package:ascend_app/features/home/domain/entities/post.dart';
import 'package:ascend_app/features/home/domain/repositories/post_repository.dart';

class PostRepositoryImpl implements PostRepository {
  final PostDataSource postDataSource;

  PostRepositoryImpl({required this.postDataSource});

  @override
  Future<List<Post>> getPosts() async {
    final postModels = await postDataSource.getPosts();
    return postModels;
  }

  @override
  Future<Post?> getPostById(String postId) async {
    final postModel = await postDataSource.getPostById(postId);
    return postModel;
  }

  @override
  Future<void> toggleLikePost(String postId, String reactionType) async {
    await postDataSource.toggleLikePost(postId, reactionType);
  }

  @override
  Future<void> savePost(String postId) async {
    await postDataSource.savePost(postId);
  }

  @override
  Future<void> sharePost(String postId) async {
    await postDataSource.sharePost(postId);
  }

  @override
  Future<void> markNotInterested(String postId) async {
    await postDataSource.markNotInterested(postId);
  }

  @override
  Future<void> unfollowUser(String postId, String ownerName) async {
    await postDataSource.unfollowUser(postId, ownerName);
  }

  @override
  Future<void> reportPost(String postId) async {
    await postDataSource.reportPost(postId);
  }

  @override
  Future<void> removePost(String postId, String reason) async {
    await postDataSource.removePost(postId, reason);
  }

  @override
  Future<Post?> undoRemovePost() async {
    return await postDataSource.undoRemovePost();
  }

  @override
  Future<void> addComment(String postId, String comment) async {
    await postDataSource.addComment(postId, comment);
  }

  @override
  Future<List<Post>> getSponsoredPosts() async {
    final postModels = await postDataSource.getSponsoredPosts();
    return postModels;
  }

  @override
  Future<List<Post>> getRecentlyViewedPosts() async {
    final postModels = await postDataSource.getRecentlyViewedPosts();
    return postModels;
  }

  @override
  Future<void> markPostAsViewed(String postId) async {
    await postDataSource.markPostAsViewed(postId);
  }
}