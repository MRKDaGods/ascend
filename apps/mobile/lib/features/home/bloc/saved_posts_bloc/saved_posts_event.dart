// filepath: d:\hi\ascend\apps\mobile\ascend_app\lib\features\home\bloc\saved_posts_bloc\saved_posts_event.dart
import 'package:equatable/equatable.dart';

abstract class SavedPostsEvent extends Equatable {
  const SavedPostsEvent();

  @override
  List<Object?> get props => [];
}

/// Event to trigger loading the initial list of saved posts.
class LoadSavedPosts extends SavedPostsEvent {
  const LoadSavedPosts();
}

/// Event to trigger loading the next page of saved posts.
class LoadMoreSavedPosts extends SavedPostsEvent {
  const LoadMoreSavedPosts();
}

/// Event triggered when a post is unsaved directly from the saved posts page.
class UnsavePostFromSaved extends SavedPostsEvent {
  final String postId;
  const UnsavePostFromSaved(this.postId);

   @override
  List<Object?> get props => [postId];
}