part of 'posts_bloc.dart';

@immutable
sealed class PostsState {}

/// Initial state of the PostsBloc.
final class PostsInitial extends PostsState {}

/// State when reported posts are being fetched.
final class FetchingReportedPostsState extends PostsState {}

/// State when reported posts are successfully fetched.
final class ReportedPostsFetchedState extends PostsState {
  final List<ReportedPost> reportedPosts;
  final int currentPage;
  final int totalPages;
  final bool hasReachedMax;
  final Map<String, List<PostReport>> postReports;

  ReportedPostsFetchedState({
    required this.reportedPosts,
    required this.currentPage,
    required this.totalPages,
    this.hasReachedMax = false,
    this.postReports = const {},
  });
}

/// State when reports for a specific post are being fetched.
final class FetchingPostReportsState extends PostsState {}

/// State when reports for a specific post are successfully fetched.
final class PostReportsFetchedState extends PostsState {
  final List<PostReport> postReports;
  final int currentPage;
  final int totalPages;
  final String postId;

  PostReportsFetchedState({
    required this.postReports,
    required this.currentPage,
    required this.totalPages,
    required this.postId,
  });
}

/// State when a post is being deleted.
final class DeletingPostState extends PostsState {}

/// State when a post is successfully deleted.
final class PostDeletedState extends PostsState {
  final String postId;

  PostDeletedState({required this.postId});
}

/// State when a report is being updated.
final class UpdatingReportState extends PostsState {}

/// State when a report is successfully updated.
final class ReportUpdatedState extends PostsState {
  final String reportId;
  final Map<String, dynamic>? updatedData;

  ReportUpdatedState({
    required this.reportId,
    this.updatedData,
  });
}

/// State when a specific report status is updated.
final class PostReportStatusUpdatedState extends PostsState {
  final String reportId;
  final String status;

  PostReportStatusUpdatedState({
    required this.reportId,
    required this.status,
  });
}

/// State when an error occurs.
final class PostsErrorState extends PostsState {
  final String errorMessage;

  PostsErrorState({required this.errorMessage});
}

/// State when the end of posts is reached.
final class EndOfPostsReachedState extends PostsState {}

/// State for toggling post reports visibility in the UI.
final class PostReportsVisibilityState extends PostsState {
  final String postId;
  final bool isVisible;

  PostReportsVisibilityState({
    required this.postId,
    required this.isVisible,
  });
}
