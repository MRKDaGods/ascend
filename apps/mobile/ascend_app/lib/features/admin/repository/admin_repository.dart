import 'package:flutter/material.dart';

import '../data/services/admin_api_client.dart';

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
}
