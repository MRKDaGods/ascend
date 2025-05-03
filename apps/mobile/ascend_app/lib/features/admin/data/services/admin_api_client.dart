import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class AdminApiClient {
  final String baseUrl;

  AdminApiClient({required this.baseUrl});

  /// Makes a GET request to the specified endpoint.
  Future<Map<String, dynamic>> get(String endpoint) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };

    final response = await http
        .get(Uri.parse('$baseUrl$endpoint'), headers: headers)
        .timeout(const Duration(seconds: 10));

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return json.decode(response.body);
    } else {
      throw Exception('GET $endpoint failed with ${response.statusCode}');
    }
  }

  /// Makes a DELETE request to the specified endpoint.
  Future<void> delete(String endpoint) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    final response = await http.delete(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('DELETE $endpoint failed with ${response.statusCode}');
    }
  }

  /// Makes a PATCH request to the specified endpoint with a JSON body.
  Future<void> patch(String endpoint, Map<String, dynamic> body) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    final response = await http.patch(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: json.encode(body),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('PATCH $endpoint failed with ${response.statusCode}');
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

  /// Fetches reported posts with pagination.
  Future<Map<String, dynamic>> getReportedPosts(int page) async {
    try {
      final response = await get('/posts/reported?page=$page');
      return response;
    } catch (e) {
      debugPrint('Error in getReportedPosts: $e');
      rethrow;
    }
  }

  /// Fetches reports for a specific post with pagination.
  Future<Map<String, dynamic>> getPostReports(String postId, int page) async {
    return await get('/posts/$postId/reports?page=$page');
  }

  /// Deletes a specific post by its ID.
  Future<void> deletePost(String postId) async {
    await delete('/posts/$postId');
  }

  /// Updates a specific report by its ID.
  Future<void> updateReport(String reportId, Map<String, dynamic> data) async {
    await patch('/posts/reports/$reportId', data);
  }

  /// Fetches reported jobs with pagination.
  Future<Map<String, dynamic>> getReportedJobs({int page = 1}) async {
    try {
      final response = await get('/jobs/reported?page=$page');
      return response;
    } catch (e) {
      debugPrint('Error in getReportedJobs: $e');
      rethrow;
    }
  }

  /// Fetches reports for a specific job with pagination.
  Future<Map<String, dynamic>> getJobReports(int jobId, {int page = 1}) async {
    try {
      final response = await get('/jobs/$jobId/reports?page=$page');
      return response;
    } catch (e) {
      debugPrint('Error in getJobReports: $e');
      rethrow;
    }
  }

  /// Deletes a specific job by its ID.
  Future<void> deleteJob(int jobId) async {
    try {
      await delete('/jobs/$jobId');
    } catch (e) {
      debugPrint('Error in deleteJob: $e');
      rethrow;
    }
  }

  /// Updates the status of a specific job report.
  Future<void> updateJobReportStatus(int reportId, String status) async {
    try {
      await patch('/jobs/reports/$reportId', {'status': status});
    } catch (e) {
      debugPrint('Error in updateJobReportStatus: $e');
      rethrow;
    }
  }
}
