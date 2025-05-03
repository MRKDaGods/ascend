import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_event.dart';
import 'package:ascend_app/features/admin/data/models/posts_model.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/admin/data/services/admin_api_client.dart';
part 'posts_state.dart';

class PostsBloc extends Bloc<PostsEvent, PostsState> {
  final AdminApiClient apiClient;
  List<ReportedPost> _posts = []; // Accumulated posts list
  bool _hasReachedMax = false; // Flag to track if we've reached the end
  int _totalPages = 1; // Track total available pages

  List<ReportedPost> get posts => _posts;
  bool get hasReachedMax => _hasReachedMax;
  int get currentPage => _posts.isEmpty ? 1 : _totalPages;

  PostsBloc({required this.apiClient}) : super(PostsInitial()) {
    // Handle fetching reported posts
    on<FetchReportedPosts>((event, emit) async {
      // If we've already reached max and not refreshing, do nothing
      if (_hasReachedMax && event.page > 1) {
        return;
      }

      if (event.page == 1) {
        emit(FetchingReportedPostsState());
        _posts = []; // Reset posts list on first page
        _hasReachedMax = false; // Reset max flag on refresh
      }

      // Don't request pages beyond what's available
      if (_totalPages < event.page) {
        debugPrint(
          'Skipping fetch for page ${event.page} as total pages is $_totalPages',
        );
        return;
      }

      try {
        final response = await apiClient.getReportedPosts(event.page);
        final newPosts =
            (response['data'] as List)
                .map((postJson) => ReportedPost.fromJson(postJson))
                .toList();

        // Store total pages for reference
        _totalPages = response['pagination']['totalPages'] ?? 1;

        // If we got fewer items than expected or reached the last page, mark as reached max
        if (newPosts.isEmpty || event.page >= _totalPages) {
          _hasReachedMax = true;
            emit(EndOfPostsReachedState());  // Add this to notify UI
        }

        // Append new posts to existing list
        _posts.addAll(newPosts);

        final currentPage = response['pagination']['currentPage'] ?? 1;

        emit(
          ReportedPostsFetchedState(
            reportedPosts: _posts, // Use accumulated posts
            currentPage: currentPage,
            totalPages: _totalPages,
            hasReachedMax: _hasReachedMax,
          ),
        );
      } catch (e) {
        if (e.toString().contains('404') && event.page > 1) {
          // This is likely just the end of available pages
          _hasReachedMax = true;
          emit(
            ReportedPostsFetchedState(
              reportedPosts: _posts,
              currentPage: event.page - 1,
              totalPages: event.page - 1,
              hasReachedMax: true,
            ),
          );
          debugPrint('Reached end of posts at page ${event.page - 1}');
        } else {
          debugPrint('Error in FetchReportedPostsEvent: $e');
          emit(PostsErrorState(errorMessage: e.toString()));
        }
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
