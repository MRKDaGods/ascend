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
    int limit = 10, // Note: The API response doesn't seem paginated per category yet
    int offset = 0, // Note: Offset might apply to the overall query, not categories
  }) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null) {
      throw Exception('Authentication token not found.');
    }

    // Using /search/ultimate endpoint now
    final uri = Uri.parse(
      '$baseUrl/post/search/ultimate?q=${Uri.encodeComponent(query)}&limit=$limit&offset=$offset',
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

      if (response.statusCode == 200) {
        final jsonData = json.decode(responseBody);

        // --- Adjusted Result Extraction for {"data": {"users": [], "posts": []}} ---
        List<dynamic> combinedResults = []; // Initialize empty list

        if (jsonData is Map<String, dynamic> && jsonData.containsKey('data')) {
          final dataMap = jsonData['data'];
          if (dataMap is Map<String, dynamic>) {
            // Extract users if present
            if (dataMap.containsKey('users') && dataMap['users'] is List) {
              final users = dataMap['users'] as List;
              // Add type information for easier rendering later
              combinedResults.addAll(users.map((user) => {'type': 'user', 'data': user}));
            }
            // Extract posts if present
            if (dataMap.containsKey('posts') && dataMap['posts'] is List) {
              final posts = dataMap['posts'] as List;
              // Add type information
              combinedResults.addAll(posts.map((post) => {'type': 'post', 'data': post}));
            }
            // Add extraction for other types (jobs, companies) here if needed
            // e.g., if (dataMap.containsKey('jobs') && dataMap['jobs'] is List) { ... }
          } else {
             debugPrint('⚠️ [SearchRepository] "data" field is not a Map: $dataMap');
          }
        } else {
           debugPrint('⚠️ [SearchRepository] Unexpected JSON structure or missing "data" key: $jsonData');
        }
        // --- End of Adjustment ---

        // Optional: Sort results by rank or relevance if needed
        // combinedResults.sort((a, b) => (b['data']['rank'] ?? 0.0).compareTo(a['data']['rank'] ?? 0.0));

        debugPrint(
          '✅ [SearchRepository] Found ${combinedResults.length} combined search results.',
        );
        return combinedResults; // Return the combined list
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
