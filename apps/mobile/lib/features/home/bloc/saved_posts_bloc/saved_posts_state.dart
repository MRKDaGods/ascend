// filepath: d:\hi\ascend\apps\mobile\ascend_app\lib\features\home\bloc\saved_posts_bloc\saved_posts_state.dart
import 'package:equatable/equatable.dart';
import '../../models/post_model.dart'; // Ensure PostModel is imported

abstract class SavedPostsState extends Equatable {
  const SavedPostsState();

  @override
  List<Object?> get props => [];
}

/// Initial state before any loading has occurred.
class SavedPostsInitial extends SavedPostsState {}

/// State indicating that saved posts are currently being loaded.
/// Can optionally hold existing posts if loading more.
class SavedPostsLoading extends SavedPostsState {
   final List<PostModel> posts; // Keep existing posts while loading more
   const SavedPostsLoading({this.posts = const []});

   @override
   List<Object?> get props => [posts];
}

/// State indicating that saved posts have been successfully loaded.
class SavedPostsLoaded extends SavedPostsState {
  final List<PostModel> posts;
  final int currentPage;
  final bool hasMorePages;

  const SavedPostsLoaded({
    required this.posts,
    this.currentPage = 1,
    this.hasMorePages = true,
  });

  @override
  List<Object?> get props => [posts, currentPage, hasMorePages];

  SavedPostsLoaded copyWith({
    List<PostModel>? posts,
    int? currentPage,
    bool? hasMorePages,
  }) {
    return SavedPostsLoaded(
      posts: posts ?? this.posts,
      currentPage: currentPage ?? this.currentPage,
      hasMorePages: hasMorePages ?? this.hasMorePages,
    );
  }
}

/// State indicating an error occurred while loading saved posts.
class SavedPostsError extends SavedPostsState {
  final String message;

  const SavedPostsError(this.message);

  @override
  List<Object> get props => [message];
}