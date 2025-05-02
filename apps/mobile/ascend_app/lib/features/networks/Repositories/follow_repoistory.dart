import 'dart:convert';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_follow.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:flutter/material.dart';

class FollowRepoistory {
  final ApiClient _client;

  FollowRepoistory({required ApiClient client}) : _client = client;

  /// Follow a user by their ID
  Future<void> followUser(String userId) async {
    try {
      final int userIdInt = int.parse(userId);
      final response = await _client.post('${ApiEndpoints.follow}/$userIdInt');

      if (response.statusCode == 200) {
        // Successfully followed the user
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint('$data["message"]');
      } else {
        throw Exception('Failed to follow user: ${response.body}');
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
    }
  }

  /// Unfollow a user by their ID
  Future<void> unfollowUser(String userId) async {
    try {
      final response = await _client.delete(
        '${ApiEndpoints.unfollow}/:$userId',
      );

      if (response.statusCode == 200) {
        // Successfully unfollowed the user
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint('$data["message"]');
      } else {
        throw Exception('Failed to unfollow user: ${response.body}');
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
    }
  }

  Future<List<FollowedUser>> fetchFollowedUsers({
    String userId = '',
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.followed}?userId=$userId?page=$page&limit=$limit',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final Map<String, dynamic> responseData = data['data'];
        return responseData['data']
            .map<FollowedUser>((json) => FollowedUser.fromJson(json))
            .toList()
            .cast<FollowedUser>();
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to fetch followed users: ${data["success"]} with error: ${data["message"]}',
        );
        return [];
      }
    } catch (e) {
      // For now, debugdebugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
      return []; // Return an empty list in case of an error
    }
  }

  /// Get users for follow recommendations
  Future<List<UserSuggestedtoFollow>> getFollowRecommendations({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.followedRecommendations}?page=$page&limit=$limit',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final Map<String, dynamic> responseData = data['data'];
        return responseData['data']
            .map((json) => UserSuggestedtoFollow.fromJson(json))
            .toList()
            .cast<UserSuggestedtoFollow>();
      } else {
        debugPrint('Failed to fetch follow recommendations: ${response.body}');
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching follow recommendations: $e');
      return []; // Return an empty list in case of an error
    }
  }
}
