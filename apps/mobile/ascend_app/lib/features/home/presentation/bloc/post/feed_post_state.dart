import 'package:ascend_app/features/home/domain/entities/post.dart';
import 'package:equatable/equatable.dart';

abstract class FeedPostState extends Equatable {
  const FeedPostState();

  @override
  List<Object?> get props => [];
}

class FeedPostInitial extends FeedPostState {}

class FeedPostsLoading extends FeedPostState {}

class FeedPostsLoaded extends FeedPostState {
  final List<Post> posts;
  final Post? postToShowFeedbackOptions;
  final bool clearFeedbackOptions;

  const FeedPostsLoaded({
    required this.posts,
    this.postToShowFeedbackOptions,
    this.clearFeedbackOptions = false,
  });

  @override
  List<Object?> get props => [posts, postToShowFeedbackOptions, clearFeedbackOptions];

  FeedPostsLoaded copyWith({
    List<Post>? posts,
    Post? postToShowFeedbackOptions,
    bool? clearFeedbackOptions,
  }) {
    return FeedPostsLoaded(
      posts: posts ?? this.posts,
      postToShowFeedbackOptions: clearFeedbackOptions == true 
          ? null 
          : postToShowFeedbackOptions ?? this.postToShowFeedbackOptions,
      clearFeedbackOptions: clearFeedbackOptions ?? this.clearFeedbackOptions,
    );
  }
}

class FeedPostError extends FeedPostState {
  final String message;

  const FeedPostError(this.message);

  @override
  List<Object> get props => [message];
}

class FeedPostActionSuccess extends FeedPostState {
  final String message;

  const FeedPostActionSuccess(this.message);

  @override
  List<Object> get props => [message];
}