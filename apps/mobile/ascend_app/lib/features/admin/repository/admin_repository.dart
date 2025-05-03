import 'package:ascend_app/features/admin/data/models/jobs_model.dart';
import 'package:flutter/material.dart';
import '../data/services/admin_api_client.dart';
import '../data/models/posts_model.dart';

class AdminRepository {
  final AdminApiClient apiClient;

  AdminRepository({required this.apiClient});

  /// Fetches analytics data from the backend for the specified duration.
  Future<Map<String, int>> fetchAnalytics(String duration) async {
    try {
      final analytics = await Future.wait([
        apiClient.getJobsCount(duration),
        apiClient.getPostsCount(duration),
        apiClient.getUsersCount(duration),
        apiClient.getFollowsCount(duration),
        apiClient.getConnectionsCount(duration),
        apiClient.getReportedJobsCount(duration),
        apiClient.getReportedPostsCount(duration),
      ]);

      return {
        'Total Users': analytics[2],
        'Total Jobs': analytics[0],
        'Total Posts': analytics[1],
        'Connections': analytics[4],
        'Follows': analytics[3],
        'Reported Jobs': analytics[5],
        'Reported Posts': analytics[6],
      };
    } catch (e) {
      debugPrint('Error fetching analytics: $e');
      throw Exception('Failed to fetch analytics: $e');
    }
  }

  /// Fetches a list of reported posts.
  Future<List<ReportedPost>> fetchReportedPosts({int page = 1}) async {
    return _fetchList<ReportedPost>(
      endpoint: '/posts/reported',
      fromJson: (json) => ReportedPost.fromJson(json),
      page: page, // Pass the page parameter
    );
  }

  /// Fetches details of a specific post by its ID.
  Future<ReportedPost> fetchPostDetails(String postId) async {
    return _fetchSingle<ReportedPost>(
      endpoint: '/posts/$postId',
      fromJson: (json) => ReportedPost.fromJson(json),
    );
  }

  /// Fetches all reports for a specific job by its ID.
  Future<List<JobReport>> fetchJobReports(int jobId, {int page = 1}) async {
    try {
      final endpoint = '/jobs/$jobId/reports';
      final paginatedEndpoint = '$endpoint?page=$page';

      debugPrint(
        'Fetching job reports from URL: $paginatedEndpoint',
      ); // Log the URL

      final response = await apiClient.get(paginatedEndpoint);

      debugPrint(
        'Response from API for job reports: $response',
      ); // Debug response

      if (response['data'] != null) {
        final data = response['data'] as List;
        return data.map((item) => JobReport.fromJson(item)).toList();
      } else {
        return []; // Return empty list if no data
      }
    } catch (e) {
      debugPrint('Error fetching job reports for job $jobId: $e');
      throw Exception('Failed to fetch job reports: $e');
    }
  }

  /// Fetches a list of reported jobs.
  Future<List<ReportedJob>> fetchReportedJobs({int page = 1}) async {
    return _fetchList<ReportedJob>(
      endpoint: '/jobs/reported',
      fromJson: (json) => ReportedJob.fromJson(json),
      page: page,
    );
  }

  /// Deletes a specific job by its ID.
  Future<bool> deleteJob(String jobId) async {
    try {
      await _delete(endpoint: '/jobs/$jobId');
      return true; // Return true if deletion was successful
    } catch (e) {
      debugPrint('Error deleting job: $e');
      return false; // Return false if deletion failed
    }
  }

  /// Updates the status of a specific job report.
  Future<void> updateJobReportStatus(int reportId, String status) async {
    await _patch(endpoint: '/jobs/reports/$reportId', data: {'status': status});
  }

  /// Generic method to fetch a list of items.
  Future<List<T>> _fetchList<T>({
    required String endpoint,
    required T Function(Map<String, dynamic>) fromJson,
    int page = 1,
  }) async {
    try {
      final paginatedEndpoint =
          endpoint.contains('?')
              ? '$endpoint&page=$page'
              : '$endpoint?page=$page';

      debugPrint('Fetching from URL: $paginatedEndpoint'); // Log the URL

      final response = await apiClient.get(paginatedEndpoint);

      // Debug the response structure
      debugPrint('Response from API: $response');

      // Parse the data field
      final data = response['data'] as List;

      // Map the data to the required type
      return data.map((json) => fromJson(json)).toList();
    } catch (e) {
      if (e.toString().contains('404')) {
        debugPrint('No data found for $endpoint');
        return []; // Return an empty list if 404
      }
      debugPrint('Error fetching list from $endpoint: $e');
      throw Exception('Failed to fetch list from $endpoint: $e');
    }
  }

  /// Generic method to fetch a single item.
  Future<T> _fetchSingle<T>({
    required String endpoint,
    required T Function(Map<String, dynamic>) fromJson,
  }) async {
    try {
      final response = await apiClient.get(endpoint);
      return fromJson(response);
    } catch (e) {
      debugPrint('Error fetching item from $endpoint: $e');
      throw Exception('Failed to fetch item from $endpoint: $e');
    }
  }

  /// Generic method to delete an item.
  Future<void> _delete({required String endpoint}) async {
    try {
      await apiClient.delete(endpoint);
    } catch (e) {
      debugPrint('Error deleting item at $endpoint: $e');
      throw Exception('Failed to delete item at $endpoint: $e');
    }
  }

  /// Generic method to patch an item.
  Future<void> _patch({
    required String endpoint,
    required Map<String, dynamic> data,
  }) async {
    try {
      await apiClient.patch(endpoint, data);
    } catch (e) {
      debugPrint('Error patching item at $endpoint: $e');
      throw Exception('Failed to patch item at $endpoint: $e');
    }
  }
}
