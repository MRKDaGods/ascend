import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_event.dart';
import 'package:ascend_app/features/admin/data/models/posts_model.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/admin/data/services/admin_api_client.dart';
import 'dart:async';
part 'posts_state.dart';

class PostsBloc extends Bloc<PostsEvent, PostsState> {
  final AdminApiClient apiClient;
  List<ReportedPost> _posts = []; // Accumulated posts list
  bool _hasReachedMax = false; // Flag to track if we've reached the end
  int _totalPages = 1; // Track total available pages
  Map<String, List<PostReport>> _postReports = {}; // Store reports by post ID

  List<ReportedPost> get posts => _posts;
  bool get hasReachedMax => _hasReachedMax;
  int get currentPage => _posts.isEmpty ? 1 : _totalPages;
  Map<String, List<PostReport>> get postReports => _postReports;

  PostsBloc({required this.apiClient}) : super(PostsInitial()) {
    // Handle fetching reported posts
    on<FetchReportedPosts>((event, emit) async {
      // If we've already reached max and not refreshing, do nothing
      if (_hasReachedMax && event.page > 1) {
        // Important: Emit the current state with hasReachedMax=true so UI knows to stop loading
        emit(ReportedPostsFetchedState(
          reportedPosts: _posts,
          currentPage: currentPage,
          totalPages: _totalPages,
          hasReachedMax: true,
          postReports: _postReports,
        ));
        return;
      }

      if (event.page == 1) {
        emit(FetchingReportedPostsState());
        _posts = []; // Reset posts list on first page
        _hasReachedMax = false; // Reset max flag on refresh
      } else {
        // For subsequent pages, emit a loading more state that doesn't replace the current posts
        emit(FetchingMorePostsState(currentPosts: _posts));
      }

      // Don't request pages beyond what's available
      if (_totalPages < event.page) {
        debugPrint(
          'Skipping fetch for page ${event.page} as total pages is $_totalPages',
        );
        _hasReachedMax = true;
        emit(ReportedPostsFetchedState(
          reportedPosts: _posts,
          currentPage: currentPage,
          totalPages: _totalPages,
          hasReachedMax: true,
          postReports: _postReports,
        ));
        return;
      }

      try {
        // Add timeout to the API call
        final response = await apiClient.getReportedPosts(event.page).timeout(
          const Duration(seconds: 15),
          onTimeout: () {
            throw TimeoutException(
              'The connection timed out. Please check your internet connection and try again.',
            );
          },
        );

        final newPosts = (response['data'] as List)
            .map((postJson) => ReportedPost.fromJson(postJson))
            .toList();

        // Store total pages for reference
        _totalPages = response['pagination']['totalPages'] ?? 1;

        // If we got fewer items than expected or reached the last page, mark as reached max
        if (newPosts.isEmpty || event.page >= _totalPages) {
          _hasReachedMax = true;
        }

        // Append new posts to existing list
        _posts.addAll(newPosts);

        final currentPage = response['pagination']['currentPage'] ?? 1;

        // If we've reached the max, emit EndOfPostsReachedState before the regular state update
        if (_hasReachedMax) {
          emit(EndOfPostsReachedState());
        }

        emit(
          ReportedPostsFetchedState(
            reportedPosts: _posts, // Use accumulated posts
            currentPage: currentPage,
            totalPages: _totalPages,
            hasReachedMax: _hasReachedMax, // This is crucial!
            postReports: _postReports,
          ),
        );
      } catch (e) {
        // Add specific handling for timeout exceptions
        if (e is TimeoutException) {
          debugPrint('Timeout fetching reported posts: $e');
          emit(PostsErrorState(
            errorMessage:
                'Request timed out. Please check your connection and try again.',
          ));
        } else if (e.toString().contains('404') && event.page > 1) {
          // This is likely just the end of available pages
          _hasReachedMax = true;
          emit(EndOfPostsReachedState());
          emit(
            ReportedPostsFetchedState(
              reportedPosts: _posts,
              currentPage: event.page - 1,
              totalPages: event.page - 1,
              hasReachedMax: true,
              postReports: _postReports,
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
        debugPrint('Fetched reports response: $response'); // Debug print

        final postReportsList = (response['data'] as List)
            .map((reportJson) => PostReport.fromJson(reportJson))
            .toList();
        final currentPage = response['pagination']['currentPage'] ?? 1;
        final totalPages = response['pagination']['totalPages'] ?? 1;

        // Store the reports in our map
        _postReports[event.postId] = postReportsList;

        // Debug prints
        debugPrint(
          'Fetched ${postReportsList.length} reports for post ${event.postId}',
        );
        debugPrint('Reports data: $postReportsList');

        // Also update the reports in the post object if we have it in our posts list
        for (int i = 0; i < _posts.length; i++) {
          if (_posts[i].id == event.postId) {
            // Create a new post with updated reports
            // This depends on how your ReportedPost class handles reports
            // You might need to add a way to update reports in your model
            _posts[i] = _posts[i].copyWith(reports: postReportsList);
            break;
          }
        }

        // First emit the detailed report state
        emit(
          PostReportsFetchedState(
            postReports: postReportsList,
            currentPage: currentPage,
            totalPages: totalPages,
            postId: event.postId,
          ),
        );

        // Then emit the main state with all posts and updated reports
        emit(
          ReportedPostsFetchedState(
            reportedPosts: _posts,
            currentPage: currentPage,
            totalPages: _totalPages,
            hasReachedMax: _hasReachedMax,
            postReports: _postReports,
          ),
        );
      } catch (e) {
        debugPrint('Error fetching reports for post ${event.postId}: $e');
        emit(PostsErrorState(errorMessage: e.toString()));

        // Re-emit the main state to preserve UI
        emit(
          ReportedPostsFetchedState(
            reportedPosts: _posts,
            currentPage: currentPage,
            totalPages: _totalPages,
            hasReachedMax: _hasReachedMax,
            postReports: _postReports,
          ),
        );
      }
    });

    // Handle deleting a post
    on<DeletePostEvent>((event, emit) async {
      emit(DeletingPostState());
      try {
        await apiClient.delete('/posts/${event.postId}');

        // Remove the deleted post from our local list if it exists
        _posts.removeWhere((post) => post.id == event.postId);

        // Also remove any associated reports
        _postReports.remove(event.postId);

        emit(PostDeletedState(postId: event.postId));

        // Re-emit the main state to update UI
        emit(
          ReportedPostsFetchedState(
            reportedPosts: _posts,
            currentPage: currentPage,
            totalPages: _totalPages,
            hasReachedMax: _hasReachedMax,
            postReports: _postReports,
          ),
        );
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Handle updating a report status
    on<UpdateReportStatusEvent>((event, emit) async {
      emit(UpdatingReportState());
      try {
        await apiClient.patch('/posts/reports/${event.reportId}', event.data);
        emit(ReportUpdatedState(reportId: event.reportId));

        // Update the report status in our local cache
        // Find which post this report belongs to
        String? updatedPostId;
        for (var entry in _postReports.entries) {
          final postId = entry.key;
          final reports = entry.value;

          for (int i = 0; i < reports.length; i++) {
            if (reports[i].id == event.reportId) {
              updatedPostId = postId;

              // Instead of using copyWith, create a new instance with updated status
              final oldReport = reports[i];
              final newStatus = event.data['status'] as String;

              // Create a new PostReport with the updated status
              final updatedReport = PostReport(
                id: oldReport.id,
                reporterId: oldReport.reporterId,
                reporterFullName: oldReport.reporterFullName,
                reporterProfilePicture: oldReport.reporterProfilePicture,
                reason: oldReport.reason,
                description: oldReport.description,
                createdAt: oldReport.createdAt,
                status: newStatus,
                updatedAt:
                    DateTime.now(), // Add the required updatedAt argument
              );

              _postReports[postId]![i] = updatedReport;
              break;
            }
          }
          if (updatedPostId != null) break;
        }

        // Re-emit the main state to update UI
        emit(
          ReportedPostsFetchedState(
            reportedPosts: _posts,
            currentPage: currentPage,
            totalPages: _totalPages,
            hasReachedMax: _hasReachedMax,
            postReports: _postReports,
          ),
        );
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Add or update the handler for UpdatePostReportStatus
    on<UpdatePostReportStatus>((event, emit) async {
      emit(UpdatingReportState());
      try {
        // Make the API request to update the report status
        debugPrint(
          'Updating report ${event.reportId} status to ${event.status}',
        );
        // final response = await apiClient.patch(
        //   '/posts/reports/${event.reportId}',
        //   {'status': event.status},
        // );

        // Debug print the response
        // debugPrint('Status update response: $response');

        // Emit success state
        emit(
          PostReportStatusUpdatedState(
            reportId: event.reportId,
            status: event.status,
          ),
        );

        // Update the report status in our local cache
        // Find which post this report belongs to
        String? updatedPostId;
        for (var entry in _postReports.entries) {
          final postId = entry.key;
          final reports = entry.value;

          for (int i = 0; i < reports.length; i++) {
            if (reports[i].id.toString() == event.reportId) {
              updatedPostId = postId;

              // Update the report in the postReports map
              _postReports[postId]![i] = reports[i].copyWith(
                status: event.status,
                updatedAt: DateTime.now(),
              );
              break;
            }
          }
          if (updatedPostId != null) break;
        }

        // Update the reports in the posts list if needed
        if (updatedPostId != null) {
          for (int i = 0; i < _posts.length; i++) {
            if (_posts[i].id == updatedPostId) {
              // Fix: Don't try to do anything with the return value of add()
              // Just call it directly
              add(FetchPostReports(postId: updatedPostId));
              break;
            }
          }
        }

        // Re-emit the main state to update UI
        emit(
          ReportedPostsFetchedState(
            reportedPosts: _posts,
            currentPage: currentPage,
            totalPages: _totalPages,
            hasReachedMax: _hasReachedMax,
            postReports: _postReports,
          ),
        );
      } catch (e) {
        debugPrint('Error updating report status: $e');
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });
  }
}
