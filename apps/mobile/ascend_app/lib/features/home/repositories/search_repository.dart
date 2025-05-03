import 'dart:convert';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

// Define models based on expected API response structure (assuming diverse results)
// Example:
// class UltimateSearchResult {
//   final String type; // e.g., 'user', 'post', 'job', 'company'
//   final dynamic data; // The actual data object (UserProfile, PostModel, etc.)
//   UltimateSearchResult({required this.type, required this.data});
//   // Add fromJson factory
// }

class SearchRepository {
  final String baseUrl = 'https://api.ascendx.tech'; // Use your actual base URL
  final http.Client _client;

  SearchRepository({http.Client? client}) : _client = client ?? http.Client();

  Future<List<dynamic>> searchUltimate({
    required String query,
    int limit = 10,
    int offset = 0,
  }) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null) {
      throw Exception('Authentication token not found.');
    }

    final uri = Uri.parse(
      '$baseUrl/search/ultimate?q=${Uri.encodeComponent(query)}&limit=$limit&offset=$offset',
    );
    debugPrint('🔄 [SearchRepository] Searching: $uri');

    try {
      final response = await _client.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      debugPrint(
        '✅ [SearchRepository] Search API response status: ${response.statusCode}',
      );
      final responseBody = response.body;
      // debugPrint('📄 [SearchRepository] Search API response body: $responseBody');

      if (response.statusCode == 200) {
        final jsonData = json.decode(responseBody);
        // Assuming the API returns a list directly under a key like 'data' or root
        final List<dynamic> results = jsonData['data'] ?? jsonData ?? [];
        debugPrint(
          '✅ [SearchRepository] Found ${results.length} search results.',
        );
        // Here, you would map 'results' to your defined models (e.g., UltimateSearchResult)
        // For now, returning List<dynamic>
        return results;
      } else {
        debugPrint(
          '❌ [SearchRepository] Search failed. Status: ${response.statusCode}, Body: $responseBody',
        );
        throw Exception('Search failed: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ [SearchRepository] Exception during search: $e');
      throw Exception('Error during search: $e');
    }
  }

  void dispose() {
    _client.close();
  }
}
