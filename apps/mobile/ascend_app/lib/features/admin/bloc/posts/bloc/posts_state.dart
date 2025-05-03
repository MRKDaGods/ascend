part of 'posts_bloc.dart';

@immutable
sealed class PostsState {}

/// Initial state of the PostsBloc.
final class PostsInitial extends PostsState {}

/// State when reported posts are being fetched.
final class FetchingReportedPostsState extends PostsState {}

/// State when reported posts are successfully fetched.
final class ReportedPostsFetchedState extends PostsState {
  final List<ReportedPost> reportedPosts; // Updated to use the ReportedPost model
  final int currentPage;
  final int totalPages;

  ReportedPostsFetchedState({
    required this.reportedPosts,
    required this.currentPage,
    required this.totalPages,
  });
}

/// State when reports for a specific post are being fetched.
final class FetchingPostReportsState extends PostsState {}

/// State when reports for a specific post are successfully fetched.
final class PostReportsFetchedState extends PostsState {
  final List<PostReport> postReports; // Updated to use the PostReport model
  final int currentPage;
  final int totalPages;

  PostReportsFetchedState({
    required this.postReports,
    required this.currentPage,
    required this.totalPages,
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

  ReportUpdatedState({required this.reportId});
}

/// State when an error occurs.
final class PostsErrorState extends PostsState {
  final String errorMessage;

  PostsErrorState({required this.errorMessage});
}