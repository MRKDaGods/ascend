import 'package:flutter/material.dart';
import '../data/services/admin_api_client.dart';
import '../data/models/posts_model.dart';

class AdminRepository {
  final AdminApiClient apiClient;

  AdminRepository({required this.apiClient});

  /// Fetches analytics data from the backend for the specified duration.
  Future<Map<String, int>> fetchAnalytics(String duration) async {
    try {
      final jobsCount = await apiClient.getJobsCount(duration);
      final postsCount = await apiClient.getPostsCount(duration);
      final usersCount = await apiClient.getUsersCount(duration);
      final followsCount = await apiClient.getFollowsCount(duration);
      final connectionsCount = await apiClient.getConnectionsCount(duration);
      final reportedJobsCount = await apiClient.getReportedJobsCount(duration);
      final reportedPostsCount = await apiClient.getReportedPostsCount(
        duration,
      );

      return {
        'Total Users': usersCount,
        'Total Jobs': jobsCount,
        'Total Posts': postsCount,
        'Connections': connectionsCount,
        'Follows': followsCount,
        'Reported Jobs': reportedJobsCount,
        'Reported Posts': reportedPostsCount,
      };
    } catch (e) {
      debugPrint('Error fetching analytics: $e'); // Log the error
      throw Exception('Failed to fetch analytics: $e');
    }
  }

  /// Fetches a list of reported posts.
  Future<List<ReportedPost>> fetchReportedPosts({int page = 1}) async {
    try {
      final response = await apiClient.get('/posts/reported?page=$page');
      final data = response['data'] as List;
      return data.map((postJson) => ReportedPost.fromJson(postJson)).toList();
    } catch (e) {
      debugPrint('Error fetching reported posts: $e');
      throw Exception('Failed to fetch reported posts: $e');
    }
  }

  /// Fetches details of a specific post by its ID.
  Future<ReportedPost> fetchPostDetails(String postId) async {
    try {
      final response = await apiClient.get('/posts/$postId');
      return ReportedPost.fromJson(response);
    } catch (e) {
      debugPrint('Error fetching post details: $e');
      throw Exception('Failed to fetch post details: $e');
    }
  }

  /// Fetches reports for a specific post by its ID.
  Future<List<PostReport>> fetchPostReports(
    String postId, {
    int page = 1,
  }) async {
    try {
      final response = await apiClient.get('/posts/$postId/reports?page=$page');
      final data = response['data'] as List;
      return data.map((reportJson) => PostReport.fromJson(reportJson)).toList();
    } catch (e) {
      debugPrint('Error fetching post reports: $e');
      throw Exception('Failed to fetch post reports: $e');
    }
  }

  /// Fetches details of a specific report by its ID.
  Future<PostReport> fetchReportDetails(String reportId) async {
    try {
      final response = await apiClient.get('/posts/reports/$reportId');
      return PostReport.fromJson(response);
    } catch (e) {
      debugPrint('Error fetching report details: $e');
      throw Exception('Failed to fetch report details: $e');
    }
  }
}
