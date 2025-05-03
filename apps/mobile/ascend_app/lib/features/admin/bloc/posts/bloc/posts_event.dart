import 'package:equatable/equatable.dart';

// Removed redundant sealed class declaration
abstract class PostsEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class FetchReportedPosts extends PostsEvent {
  final int page;

  FetchReportedPosts({this.page = 1});

  @override
  List<Object?> get props => [page];
}

class FetchPostDetails extends PostsEvent {
  final String postId;

  FetchPostDetails(this.postId);

  @override
  List<Object?> get props => [postId];
}

class FetchPostReports extends PostsEvent {
  final String postId;
  final int page;

  FetchPostReports({required this.postId, this.page = 1});

  @override
  List<Object?> get props => [postId, page];
}

class FetchReportDetails extends PostsEvent {
  final String reportId;

  FetchReportDetails(this.reportId);

  @override
  List<Object?> get props => [reportId];
}

class DeletePostEvent extends PostsEvent {
  final String postId;

  DeletePostEvent({required this.postId});
}

class UpdateReportStatusEvent extends PostsEvent {
  final String reportId;
  final Map<String, dynamic> data;

  UpdateReportStatusEvent({required this.reportId, required this.data});
}