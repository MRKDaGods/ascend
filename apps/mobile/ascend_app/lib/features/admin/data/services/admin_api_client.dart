import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class AdminApiClient {
  final String baseUrl;
  final Duration _defaultTimeout = const Duration(seconds: 15);
  final int _maxRetries = 2;

  AdminApiClient({required this.baseUrl});

  Future<Map<String, dynamic>> _makeRequest(
    String method,
    String endpoint, {
    Map<String, dynamic>? body,
  }) async {
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
        final uri = Uri.parse('$baseUrl$endpoint');
        final response = await _sendRequest(
          method,
          uri,
          headers,
          body,
        ).timeout(_defaultTimeout);

        if (response.statusCode >= 200 && response.statusCode < 300) {
          return response.body.isNotEmpty ? json.decode(response.body) : {};
        } else {
          throw Exception(
            '$method $endpoint failed with ${response.statusCode}: ${response.body}',
          );
        }
      } catch (e) {
        if (_shouldRetry(e) && retryCount < _maxRetries) {
          retryCount++;
          await Future.delayed(Duration(seconds: retryCount));
          continue;
        }
        rethrow;
      }
    }
  }

  Future<http.Response> _sendRequest(
    String method,
    Uri uri,
    Map<String, String> headers,
    Map<String, dynamic>? body,
  ) {
    switch (method) {
      case 'GET':
        return http.get(uri, headers: headers);
      case 'POST':
        return http.post(uri, headers: headers, body: json.encode(body));
      case 'PATCH':
        return http.patch(uri, headers: headers, body: json.encode(body));
      case 'DELETE':
        return http.delete(uri, headers: headers);
      default:
        throw Exception('Unsupported HTTP method: $method');
    }
  }

  bool _shouldRetry(dynamic error) {
    return error is TimeoutException ||
        error.toString().contains('SocketException') ||
        error.toString().contains('Connection refused');
  }

  Future<Map<String, dynamic>> get(String endpoint) =>
      _makeRequest('GET', endpoint);

  Future<void> delete(String endpoint) async {
    await _makeRequest('DELETE', endpoint);
  }

  Future<Map<String, dynamic>> patch(
    String endpoint,
    Map<String, dynamic> body,
  ) => _makeRequest('PATCH', endpoint, body: body);

  Future<void> post(String endpoint, Map<String, dynamic> body) async {
    await _makeRequest('POST', endpoint, body: body);
  }

  Future<int> _getCount(String endpoint) async {
    final response = await get(endpoint);
    return response['count'] ?? 0;
  }

  Future<int> getJobsCount(String duration) =>
      _getCount('/jobs/count?duration=$duration');

  Future<int> getPostsCount(String duration) =>
      _getCount('/posts/count?duration=$duration');

  Future<int> getUsersCount(String duration) =>
      _getCount('/users/count?duration=$duration');

  Future<int> getFollowsCount(String duration) =>
      _getCount('/follows/count?duration=$duration');

  Future<int> getConnectionsCount(String duration) =>
      _getCount('/connections/count?duration=$duration');

  Future<int> getReportedJobsCount(String duration) =>
      _getCount('/jobs/reports/count?duration=$duration');

  Future<int> getReportedPostsCount(String duration) =>
      _getCount('/posts/reports/count?duration=$duration');

  Future<Map<String, dynamic>> getReportedPosts(int page) =>
      get('/posts/reported?page=$page');

  Future<Map<String, dynamic>> getPostReports(String postId, int page) =>
      get('/posts/$postId/reports?page=$page');

  Future<void> deletePost(String postId) async {
    await delete('/posts/$postId');
  }

  Future<Map<String, dynamic>> updateReport(
    String reportId,
    Map<String, dynamic> data,
  ) => patch('/posts/reports/$reportId', data);

  Future<Map<String, dynamic>> getReportedJobs({int page = 1}) =>
      get('/jobs/reported?page=$page');

  Future<Map<String, dynamic>> getJobReports(int jobId, {int page = 1}) =>
      get('/jobs/$jobId/reports?page=$page');

  Future<void> deleteJob(String jobId) async {
    await delete('/jobs/$jobId');
  }

  Future<Map<String, dynamic>> updateJobReportStatus(
    int reportId,
    String status,
  ) => patch('/jobs/reports/$reportId', {'status': status});
}
