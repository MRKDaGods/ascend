import 'package:ascend_app/features/admin/data/models/jobs_model.dart';
import 'package:ascend_app/features/admin/data/models/users_model.dart';
import 'package:flutter/material.dart';
import '../data/services/admin_api_client.dart';
import '../data/models/posts_model.dart';
import 'package:ascend_app/features/admin/data/services/user_api_client.dart';

class AdminRepository {
  final AdminApiClient apiClient;
  final UserApiClient userApiClient;

  AdminRepository({required this.apiClient, required this.userApiClient});

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

  /// Fetches a list of reported jobs with pagination support.
  Future<List<ReportedJob>> getReportedJobs({int page = 1}) async {
    try {
      final response = await apiClient.get('/jobs/reported?page=$page');

      if (response['data'] != null) {
        final data = response['data'] as List;
        return data.map((json) => ReportedJob.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      debugPrint('Error fetching reported jobs: $e');
      throw Exception('Failed to fetch reported jobs: $e');
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

  /// Fetches all reports for a specific post by its ID.
  Future<List<PostReport>> fetchPostReports(
    String postId, {
    int page = 1,
  }) async {
    try {
      final endpoint = '/posts/$postId/reports';
      final paginatedEndpoint = '$endpoint?page=$page';

      debugPrint(
        'Fetching post reports from URL: $paginatedEndpoint',
      ); // Log the URL

      final response = await apiClient.get(paginatedEndpoint);

      debugPrint(
        'Response from API for post reports: $response',
      ); // Debug response

      if (response['data'] != null) {
        final data = response['data'] as List;
        return data.map((item) => PostReport.fromJson(item)).toList();
      } else {
        return []; // Return empty list if no data
      }
    } catch (e) {
      debugPrint('Error fetching post reports for post $postId: $e');
      throw Exception('Failed to fetch post reports: $e');
    }
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
        // Fix: Return directly instead of wrapping in a List
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
    try {
      final response = await apiClient.get('/jobs/reported?page=$page');

      if (response['data'] == null) {
        debugPrint('Warning: Missing data field in response');
        return []; // Return empty list instead of null
      }

      final data = response['data'] as List;
      return data.map((json) => ReportedJob.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error fetching reported jobs: $e');
      // Check if it's a 404 error, which means we've reached the end of the list
      if (e.toString().contains('404')) {
        // Return empty list to indicate end of data without throwing an exception
        return [];
      }
      // For other errors, we still throw the exception
      throw Exception('Failed to fetch reported jobs: $e');
    }
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

  /// Deletes a specific post by its ID.
  Future<bool> deletePost(String postId) async {
    try {
      await _delete(endpoint: '/posts/$postId');
      return true; // Return true if deletion was successful
    } catch (e) {
      debugPrint('Error deleting post: $e');
      return false; // Return false if deletion failed
    }
  }

  /// Updates the status of a specific job report.
  Future<bool> updateJobReportStatus(int reportId, String status) async {
    try {
      // Call the patch method without trying to use its return value
      await apiClient.patch('/jobs/reports/$reportId', {'status': status});

      // If we reach this point without exceptions, consider it successful
      debugPrint('Successfully updated job report status');
      return true;
    } catch (e) {
      debugPrint('Error updating job report status: $e');
      throw Exception('Failed to update job report status: $e');
    }
  }

  /// Updates the status of a specific post report.
  Future<void> updatePostReportStatus(String reportId, String status) async {
    await _patch(
      endpoint: '/posts/reports/$reportId',
      data: {'status': status},
    );
  }

  /// Deletes a specific user by their ID.
  Future<void> deleteUser(int userId) async {
    try {
      await userApiClient.deleteUser(userId);
      debugPrint('Successfully deleted user with ID: $userId');
    } catch (e) {
      debugPrint('Error deleting user with ID $userId: $e');
      throw Exception('Failed to delete user: $e');
    }
  }

  /// Fetches a list of reported users.
  Future<List<UserReport>> getReportedUsers() async {
    try {
      final response = await userApiClient.getList('/admin-get-user-reports');
      return response.map((json) => UserReport.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error fetching reported users: $e');
      throw Exception('Failed to fetch reported users');
    }
  }

  /// Bans a user by their ID.
  Future<void> banUser({
    required int userId,
    String? expiresAt, // Optional expiration date for temporary bans
    String? reason, // Optional reason for the ban
  }) async {
    try {
      final Map<String, dynamic> body = {
        'user_id': userId,
        if (expiresAt != null) 'expires_at': expiresAt,
        if (reason != null) 'reason': reason,
      };

      await userApiClient.post('/ban-user', body);
      debugPrint('Successfully banned user with ID: $userId');
    } catch (e) {
      debugPrint('Error banning user with ID $userId: $e');
      throw Exception('Failed to ban user: $e');
    }
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
