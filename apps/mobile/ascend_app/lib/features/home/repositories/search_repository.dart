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

        // --- Adjusted Result Extraction ---
        List<dynamic> results = []; // Default to empty list

        if (jsonData is Map<String, dynamic>) {
          if (jsonData.containsKey('data')) {
            final dataField = jsonData['data'];
            if (dataField is List) {
              results = dataField; // Case 1: { "data": [...] }
            } else if (dataField is Map<String, dynamic> && dataField.containsKey('results')) {
               final resultsField = dataField['results'];
               if (resultsField is List) {
                 results = resultsField; // Case 2: { "data": { "results": [...] } }
               }
            }
          } else if (jsonData.containsKey('results')) {
             final resultsField = jsonData['results'];
             if (resultsField is List) {
                results = resultsField; // Case 3: { "results": [...] }
             }
          } else {
             debugPrint('⚠️ [SearchRepository] Unexpected Map structure: $jsonData');
          }
        } else if (jsonData is List) {
           results = jsonData; // Case 4: API returns a direct list [...]
        } else {
           debugPrint('⚠️ [SearchRepository] Unexpected JSON structure: $jsonData');
        }
        // --- End of Adjustment ---

        debugPrint(
          '✅ [SearchRepository] Found ${results.length} search results.',
        );
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
