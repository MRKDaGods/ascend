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

  Future<void> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl + endpoint),
        body: jsonEncode(body),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to post to $endpoint: ${response.body}');
      }
    } catch (e) {
      debugPrint('Error in POST request to $endpoint: $e');
      throw Exception('POST request failed: $e');
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
