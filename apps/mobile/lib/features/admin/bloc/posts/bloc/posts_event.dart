import 'package:equatable/equatable.dart';

// Base abstract class for all post events
abstract class PostsEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

// Event to fetch reported posts with pagination
class FetchReportedPosts extends PostsEvent {
  final int page;
  final bool isRefresh;

  FetchReportedPosts({this.page = 1, this.isRefresh = false});

  @override
  List<Object?> get props => [page, isRefresh];
}

// Event to fetch details of a specific post
class FetchPostDetails extends PostsEvent {
  final String postId;

  FetchPostDetails(this.postId);

  @override
  List<Object?> get props => [postId];
}

// Event to fetch reports of a specific post with pagination
class FetchPostReports extends PostsEvent {
  final String postId;
  final int page;

  FetchPostReports({required this.postId, this.page = 1});

  @override
  List<Object?> get props => [postId, page];
}

// Event to fetch details of a specific report
class FetchReportDetails extends PostsEvent {
  final String reportId;

  FetchReportDetails(this.reportId);

  @override
  List<Object?> get props => [reportId];
}

// Event to delete a specific post
class DeletePostEvent extends PostsEvent {
  final String postId;

  DeletePostEvent({required this.postId});
  
  @override
  List<Object?> get props => [postId];
}

// Event to update the status of a specific report
class UpdateReportStatusEvent extends PostsEvent {
  final String reportId;
  final Map<String, dynamic> data;

  UpdateReportStatusEvent({required this.reportId, required this.data});
  
  @override
  List<Object?> get props => [reportId, data];
}

// Helper event for updating post report status
class UpdatePostReportStatus extends PostsEvent {
  final String reportId;
  final String status;

  UpdatePostReportStatus({required this.reportId, required this.status});
  
  @override
  List<Object?> get props => [reportId, status];
}