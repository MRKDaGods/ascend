import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_event.dart';
import 'package:ascend_app/features/admin/data/models/posts_model.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/admin/data/services/admin_api_client.dart';
part 'posts_state.dart';

class PostsBloc extends Bloc<PostsEvent, PostsState> {
  final AdminApiClient apiClient;

  PostsBloc({required this.apiClient}) : super(PostsInitial()) {
    // Handle fetching reported posts
    on<FetchReportedPosts>((event, emit) async {
      emit(FetchingReportedPostsState());
      try {
        final response = await apiClient.getReportedPosts(event.page);
        final reportedPosts =
            (response['data'] as List)
                .map((postJson) => ReportedPost.fromJson(postJson))
                .toList();
        final currentPage = response['pagination']['currentPage'] ?? 1;
        final totalPages = response['pagination']['totalPages'] ?? 1;

        emit(
          ReportedPostsFetchedState(
            reportedPosts: reportedPosts,
            currentPage: currentPage,
            totalPages: totalPages,
          ),
        );
      } catch (e) {
        debugPrint('Error in FetchReportedPostsEvent: $e');
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Handle fetching reports for a specific post
    on<FetchPostReports>((event, emit) async {
      emit(FetchingPostReportsState());
      try {
        final response = await apiClient.get(
          '/posts/${event.postId}/reports?page=${event.page}',
        );
        final postReports =
            (response['data'] as List)
                .map((reportJson) => PostReport.fromJson(reportJson))
                .toList();
        final currentPage = response['pagination']['currentPage'] ?? 1;
        final totalPages = response['pagination']['totalPages'] ?? 1;

        emit(
          PostReportsFetchedState(
            postReports: postReports,
            currentPage: currentPage,
            totalPages: totalPages,
          ),
        );
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Handle deleting a post
    on<DeletePostEvent>((event, emit) async {
      emit(DeletingPostState());
      try {
        await apiClient.delete('/posts/${event.postId}');
        emit(PostDeletedState(postId: event.postId));
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Handle updating a report
    on<UpdateReportStatusEvent>((event, emit) async {
      emit(UpdatingReportState());
      try {
        await apiClient.patch('/posts/reports/${event.reportId}', event.data);
        emit(ReportUpdatedState(reportId: event.reportId));
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });
  }
}
