import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class AdminApiClient {
  final String baseUrl;
  final Duration _defaultTimeout = const Duration(seconds: 15);
  final int _maxRetries = 2;

  AdminApiClient({required this.baseUrl});

  /// Makes a GET request to the specified endpoint with retry logic.
  Future<Map<String, dynamic>> get(String endpoint) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };

    int retryCount = 0;

    while (true) {
      try {
        final response = await http
            .get(Uri.parse('$baseUrl$endpoint'), headers: headers)
            .timeout(_defaultTimeout);

        if (response.statusCode >= 200 && response.statusCode < 300) {
          return json.decode(response.body);
        } else {
          throw Exception(
            'GET $endpoint failed with ${response.statusCode}: ${response.body}',
          );
        }
      } catch (e) {
        if (e is TimeoutException ||
            (e.toString().contains('SocketException') ||
                e.toString().contains('Connection refused'))) {
          if (retryCount < _maxRetries) {
            retryCount++;
            debugPrint(
              'Request timed out, retrying ($retryCount/$_maxRetries): $endpoint',
            );
            await Future.delayed(
              Duration(seconds: retryCount),
            ); // Exponential backoff
            continue;
          }
        }
        debugPrint('Error in GET request to $endpoint: $e');
        rethrow;
      }
    }
  }

  /// Makes a DELETE request to the specified endpoint with retry logic.
  Future<void> delete(String endpoint) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    final url = Uri.parse('$baseUrl$endpoint');

    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };

    int retryCount = 0;

    while (true) {
      try {
        final response = await http
            .delete(url, headers: headers)
            .timeout(_defaultTimeout);

        if (response.statusCode >= 200 && response.statusCode < 300) {
          return;
        } else {
          throw Exception(
            'DELETE $endpoint failed with ${response.statusCode}: ${response.body}',
          );
        }
      } catch (e) {
        if (e is TimeoutException ||
            (e.toString().contains('SocketException') ||
                e.toString().contains('Connection refused'))) {
          if (retryCount < _maxRetries) {
            retryCount++;
            debugPrint(
              'Request timed out, retrying ($retryCount/$_maxRetries): $endpoint',
            );
            await Future.delayed(
              Duration(seconds: retryCount),
            ); // Exponential backoff
            continue;
          }
        }
        debugPrint('Error in DELETE request to $endpoint: $e');
        rethrow;
      }
    }
  }

  /// Makes a PATCH request to the specified endpoint with retry logic.
  Future<Map<String, dynamic>> patch(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    int retryCount = 0;

    while (true) {
      try {
        final response = await http
            .patch(
              Uri.parse('$baseUrl$endpoint'),
              headers: {
                'Authorization': 'Bearer $token',
                'Content-Type': 'application/json',
              },
              body: json.encode(body),
            )
            .timeout(_defaultTimeout);

        if (response.statusCode >= 200 && response.statusCode < 300) {
          try {
            if (response.body.isNotEmpty) {
              return json.decode(response.body);
            }
            return {}; // Return empty map for empty responses
          } catch (e) {
            debugPrint('Error parsing response body: ${response.body}');
            return {}; // Return empty map on parse failure
          }
        } else {
          throw Exception(
            'PATCH $endpoint failed with ${response.statusCode}: ${response.body}',
          );
        }
      } catch (e) {
        if (e is TimeoutException ||
            (e.toString().contains('SocketException') ||
                e.toString().contains('Connection refused'))) {
          if (retryCount < _maxRetries) {
            retryCount++;
            debugPrint(
              'Request timed out, retrying ($retryCount/$_maxRetries): $endpoint',
            );
            await Future.delayed(
              Duration(seconds: retryCount),
            ); // Exponential backoff
            continue;
          }
        }
        debugPrint('Error in PATCH request to $endpoint: $e');
        rethrow;
      }
    }
  }

  /// Fetches the count of jobs based on the specified duration.
  Future<int> getJobsCount(String duration) async {
    final response = await get('/jobs/count?duration=$duration');
    return response['count'] ?? 0;
  }

  /// Fetches the count of posts based on the specified duration.
  Future<int> getPostsCount(String duration) async {
    final response = await get('/posts/count?duration=$duration');
    return response['count'] ?? 0;
  }

  /// Fetches the count of users based on the specified duration.
  Future<int> getUsersCount(String duration) async {
    final response = await get('/users/count?duration=$duration');
    return response['count'] ?? 0;
  }

  /// Fetches the count of follows based on the specified duration.
  Future<int> getFollowsCount(String duration) async {
    final response = await get('/follows/count?duration=$duration');
    return response['count'] ?? 0;
  }

  /// Fetches the count of connections based on the specified duration.
  Future<int> getConnectionsCount(String duration) async {
    final response = await get('/connections/count?duration=$duration');
    return response['count'] ?? 0;
  }

  /// Fetches the count of reported jobs based on the specified duration.
  Future<int> getReportedJobsCount(String duration) async {
    final response = await get('/jobs/reports/count?duration=$duration');
    return response['count'] ?? 0;
  }

  /// Fetches the count of reported posts based on the specified duration.
  Future<int> getReportedPostsCount(String duration) async {
    final response = await get('/posts/reports/count?duration=$duration');
    return response['count'] ?? 0;
  }

  /// Fetches reported posts with pagination and error handling.
  Future<Map<String, dynamic>> getReportedPosts(int page) async {
    try {
      debugPrint('Fetching reported posts for page $page');
      final response = await get('/posts/reported?page=$page');
      return response;
    } catch (e) {
      debugPrint('Error in getReportedPosts: $e');
      rethrow;
    }
  }

  /// Fetches reports for a specific post with pagination and error handling.
  Future<Map<String, dynamic>> getPostReports(String postId, int page) async {
    try {
      debugPrint('Fetching reports for post $postId, page $page');
      final response = await get('/posts/$postId/reports?page=$page');
      return response;
    } catch (e) {
      debugPrint('Error in getPostReports: $e');
      rethrow;
    }
  }

  /// Deletes a specific post by its ID with error handling.
  Future<void> deletePost(String postId) async {
    try {
      debugPrint('Deleting post $postId');
      await delete('/posts/$postId');
    } catch (e) {
      debugPrint('Error in deletePost: $e');
      rethrow;
    }
  }

  /// Updates a specific report by its ID with error handling.
  Future<Map<String, dynamic>> updateReport(
    String reportId,
    Map<String, dynamic> data,
  ) async {
    try {
      debugPrint('Updating report $reportId with data: $data');
      final response = await patch('/posts/reports/$reportId', data);
      return response;
    } catch (e) {
      debugPrint('Error in updateReport: $e');
      rethrow;
    }
  }

  /// Fetches reported jobs with pagination and error handling.
  Future<Map<String, dynamic>> getReportedJobs({int page = 1}) async {
    try {
      debugPrint('Fetching reported jobs for page $page');
      final response = await get('/jobs/reported?page=$page');
      return response;
    } catch (e) {
      debugPrint('Error in getReportedJobs: $e');
      rethrow;
    }
  }

  /// Fetches reports for a specific job with pagination and error handling.
  Future<Map<String, dynamic>> getJobReports(int jobId, {int page = 1}) async {
    try {
      debugPrint('Fetching reports for job $jobId, page $page');
      final response = await get('/jobs/$jobId/reports?page=$page');
      return response;
    } catch (e) {
      debugPrint('Error in getJobReports: $e');
      rethrow;
    }
  }

  /// Deletes a specific job by its ID with error handling.
  Future<void> deleteJob(String jobId) async {
    try {
      debugPrint('Deleting job $jobId');
      await delete('/jobs/$jobId');
    } catch (e) {
      debugPrint('Error in deleteJob: $e');
      rethrow;
    }
  }

  /// Updates the status of a specific job report with error handling.
  Future<Map<String, dynamic>> updateJobReportStatus(
    int reportId,
    String status,
  ) async {
    try {
      debugPrint('Updating job report $reportId status to: $status');
      final response = await patch('/jobs/reports/$reportId', {
        'status': status,
      });
      return response;
    } catch (e) {
      debugPrint('Error in updateJobReportStatus: $e');
      rethrow;
    }
  }
}
