import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class AdminApiClient {
  final String baseUrl;

  AdminApiClient({required this.baseUrl});

  /// Makes a GET request to the specified endpoint.
  Future<Map<String, dynamic>> get(String endpoint) async {
    final token =
        await SecureStorageHelper.getAuthToken(); // Use SecureStorageHelper to get the token
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    debugPrint('Request URL: $baseUrl$endpoint');
    debugPrint(
      'Request Headers: ${{'Authorization': 'Bearer $token', 'Content-Type': 'application/json'}}',
    );
    debugPrint('Response Status Code: ${response.statusCode}');
    debugPrint('Response Body: ${response.body}');

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return json.decode(response.body);
    } else {
      debugPrint('Error: ${response.statusCode} - ${response.body}');
      throw Exception('GET $endpoint failed with ${response.statusCode}');
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
}
