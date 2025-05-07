import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/profile/models/user_profile_model.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class UserSearchService {
  final String baseUrl = 'https://api.ascendx.tech';
  final http.Client _client;

  UserSearchService({http.Client? client}) : _client = client ?? http.Client();

  Future<List<UserProfileModel>> searchUsers(String query, {int page = 1, int limit = 10}) async {
    if (query.isEmpty) {
      // Return empty list for empty queries
      return [];
    }

    try {
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint('❌ [UserSearchService] Auth token is null. Cannot search users.');
        throw Exception('Authentication token not found.');
      }

      final url = Uri.parse('$baseUrl/connection/search?q=$query&page=$page&limit=$limit');
      debugPrint('🔍 [UserSearchService] Searching users with query: "$query" at $url');

      final response = await _client.get(
        url,
        headers: {
          'Authorization': 'Bearer $authToken',
          'Accept': 'application/json',
        },
      );

      debugPrint('🔍 [UserSearchService] Search response status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        // Parse the JSON response safely
        dynamic jsonData;
        try {
          jsonData = json.decode(response.body);
          debugPrint('✅ [UserSearchService] Search successful. Processing results...');
        } catch (e) {
          debugPrint('❌ [UserSearchService] Failed to parse JSON response: $e');
          return [];
        }
        
        // Handle different API response formats
        List<dynamic> usersData = [];
        
        // Special handling for the exact response format you shared
        // {success: true, data: {data: [users], pagination: {...}}}
        if (jsonData is Map && jsonData['success'] == true && 
            jsonData['data'] is Map && jsonData['data']['data'] is List) {
          usersData = jsonData['data']['data'];
          debugPrint('✅ [UserSearchService] Found nested data.data format with ${usersData.length} users');
        }
        // Standard success/data pattern
        else if (jsonData is Map && jsonData['success'] == true && jsonData['data'] is List) {
          usersData = jsonData['data'];
          debugPrint('✅ [UserSearchService] Found standard data format with ${usersData.length} users');
        } 
        // Direct array format
        else if (jsonData is List) {
          usersData = jsonData;
          debugPrint('✅ [UserSearchService] Found direct array format with ${usersData.length} users');
        }
        // Users array format
        else if (jsonData is Map && jsonData['users'] is List) {
          usersData = jsonData['users'];
          debugPrint('✅ [UserSearchService] Found users array format with ${usersData.length} users');
        }
        
        if (usersData.isEmpty) {
          debugPrint('ℹ️ [UserSearchService] No users found or unexpected data format');
          return [];
        }
        
        // Map API data to UserProfileModel - updated to match the actual API response
        final users = usersData.map((userData) {
          if (userData == null || userData is! Map) {
            return null; // Skip invalid entries
          }
          
          String fullName = '';
          // First try to get first_name and last_name
          if (userData['first_name'] != null && userData['last_name'] != null) {
            fullName = '${userData['first_name']} ${userData['last_name']}';
          } 
          // Fall back to name or fullname if available
          else {
            fullName = userData['name'] ?? userData['fullname'] ?? '';
          }
          
          return UserProfileModel(
            id: userData['user_id']?.toString() ?? userData['id']?.toString() ?? '',
            name: fullName,
            position: userData['industry'] ?? userData['occupation'] ?? userData['position'] ?? '',
            avatarUrl: userData['profile_picture_url'] ?? userData['profilePictureUrl'] ?? '',
            // Add other fields as needed based on the API response structure
          );
        }).whereType<UserProfileModel>().toList(); // Filter out nulls
        
        debugPrint('✅ [UserSearchService] Parsed ${users.length} users from API');
        return users;
      } else {
        debugPrint('❌ [UserSearchService] Failed to search users. Status: ${response.statusCode}, Body: ${response.body}');
        return [];
      }
    } catch (e) {
      debugPrint('❌ [UserSearchService] Error searching users: $e');
      return []; // Return empty list on error to prevent UI crashes
    }
  }

  void dispose() {
    _client.close();
  }
}