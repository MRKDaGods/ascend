import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class UserApiClient {
  final String baseUrl;
  final Duration _defaultTimeout = const Duration(seconds: 15);
  final int _maxRetries = 2;

  UserApiClient({required this.baseUrl});

  // / Makes a GET request to the specified endpoint and expects a List<dynamic> response.
  Future<List<dynamic>> getList(String endpoint) async {
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
          final decodedResponse = json.decode(response.body);
          if (decodedResponse is List) {
            return decodedResponse;
          } else {
            throw Exception('Unexpected response format: $decodedResponse');
          }
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
            debugPrint('Retrying GET request to $endpoint ($retryCount)...');
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

  Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final token = await SecureStorageHelper.getAuthToken();
      if (token == null || token.isEmpty) {
        throw Exception('Authentication token is missing.');
      }

      final url = baseUrl + endpoint;
      debugPrint('POST request to: $url');
      debugPrint('Request body: ${jsonEncode(body)}');

      final response = await http.post(
        Uri.parse(url),
        body: jsonEncode(body),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      debugPrint('Response status code: ${response.statusCode}');
      debugPrint('Response body: ${response.body}');

      // Accept both 200 OK and 201 Created as successful responses
      if (response.statusCode == 200 || response.statusCode == 201) {
        // Parse and return the response body as a Map
        try {
          return jsonDecode(response.body);
        } catch (e) {
          // If response is not valid JSON, return empty success response
          return {'success': true};
        }
      } else {
        // Try to parse the error response
        Map<String, dynamic> errorData = {};
        try {
          errorData = jsonDecode(response.body);
        } catch (e) {
          // If we can't parse the response body, use default error
        }

        // Check for specific error cases
        if (response.statusCode == 500 &&
            errorData['error'] != null &&
            errorData['error']['code'] == '23505') {
          // Email already exists error
          if (errorData['error']['constraint'] == 'users_email_key') {
            throw Exception('Email address already in use');
          }

          // Other unique constraint violations
          throw Exception('This record already exists');
        }

        throw Exception('Failed to post to $endpoint: ${response.body}');
      }
    } catch (e) {
      debugPrint('Error in POST request to $endpoint: $e');
      rethrow;
    }
  }

  /// Deletes a user by their ID.
  Future<void> deleteUser(int userId) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null || token.isEmpty) {
      throw Exception('Authentication token is missing.');
    }

    final response = await http.post(
      Uri.parse('$baseUrl/admin-delete-user'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'user_id': userId}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete user: ${response.body}');
    }
  }
}
