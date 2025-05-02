part of 'posts_bloc.dart';

@immutable
sealed class PostsEvent {}

/// Event to fetch reported posts with pagination.
class FetchReportedPostsEvent extends PostsEvent {
  final int page;
  FetchReportedPostsEvent({required this.page});
}

/// Event to fetch reports for a specific post with pagination.
class FetchPostReportsEvent extends PostsEvent {
  final String postId;
  final int page;
  FetchPostReportsEvent({required this.postId, required this.page});
}

/// Event to delete a specific post by its ID.
class DeletePostEvent extends PostsEvent {
  final String postId;
  DeletePostEvent({required this.postId});
}

/// Event to update a specific report by its ID.
class UpdateReportStatusEvent extends PostsEvent {
  final String reportId;
  final Map<String, dynamic> data;
  UpdateReportStatusEvent({required this.reportId, required this.data});
}
