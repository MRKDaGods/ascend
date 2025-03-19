import 'package:equatable/equatable.dart';

abstract class FeedPostEvent extends Equatable {
  const FeedPostEvent();

  @override
  List<Object?> get props => [];
}

class FetchFeedPosts extends FeedPostEvent {
  const FetchFeedPosts();
}

class LikeFeedPost extends FeedPostEvent {
  final String postId;
  final String reactionType;

  const LikeFeedPost({required this.postId, required this.reactionType});

  @override
  List<Object> get props => [postId, reactionType];
}

class SaveFeedPost extends FeedPostEvent {
  final String postId;

  const SaveFeedPost({required this.postId});

  @override
  List<Object> get props => [postId];
}

class ShareFeedPost extends FeedPostEvent {
  final String postId;

  const ShareFeedPost({required this.postId});

  @override
  List<Object> get props => [postId];
}

class MarkFeedPostNotInterested extends FeedPostEvent {
  final String postId;

  const MarkFeedPostNotInterested({required this.postId});

  @override
  List<Object> get props => [postId];
}

class UnfollowFeedPostOwner extends FeedPostEvent {
  final String postId;
  final String ownerName;

  const UnfollowFeedPostOwner({required this.postId, required this.ownerName});

  @override
  List<Object> get props => [postId, ownerName];
}

class ReportFeedPost extends FeedPostEvent {
  final String postId;

  const ReportFeedPost({required this.postId});

  @override
  List<Object> get props => [postId];
}

class ShowFeedPostFeedbackOptions extends FeedPostEvent {
  final String postId;

  const ShowFeedPostFeedbackOptions({required this.postId});

  @override
  List<Object> get props => [postId];
}

class RemoveFeedPostWithReason extends FeedPostEvent {
  final String postId;
  final String reason;

  const RemoveFeedPostWithReason({required this.postId, required this.reason});

  @override
  List<Object> get props => [postId, reason];
}

class UndoFeedPostRemoval extends FeedPostEvent {
  const UndoFeedPostRemoval();
}

class AddFeedPostComment extends FeedPostEvent {
  final String postId;
  final String comment;

  const AddFeedPostComment({required this.postId, required this.comment});

  @override
  List<Object> get props => [postId, comment];
}

class ViewFeedPost extends FeedPostEvent {
  final String postId;

  const ViewFeedPost({required this.postId});

  @override
  List<Object> get props => [postId];
}

class HideFeedPostFeedbackOptions extends FeedPostEvent {
  const HideFeedPostFeedbackOptions();
}

class LoadMoreFeedPosts extends FeedPostEvent {
  const LoadMoreFeedPosts();
}