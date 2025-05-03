import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/blocked_user_model.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
//import 'package:ascend_app/core/services/auth_service.dart';

class BlockRepository {
  final ApiClient _client;

  BlockRepository({required ApiClient client}) : _client = client;

  /// Block a user by their ID
  Future<void> blockUser(String userId) async {
    try {
      final response = await _client.post('${ApiEndpoints.block}/:$userId');

      if (response.statusCode == 200) {
        // Successfully blocked the user
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint('$data["message"]');
      } else {
        throw Exception('Failed to block user: ${response.body}');
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
    }
  }

  /// Unblock a user by their ID
  Future<void> unblockUser(String userId) async {
    try {
      final int userIdInt = int.parse(userId);
      final response = await _client.delete(
        '${ApiEndpoints.unblock}/$userIdInt',
      );

      if (response.statusCode == 200) {
        // Successfully unblocked the user
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint('$data["message"]');
      } else {
        throw Exception('Failed to unblock user: ${response.body}');
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
    }
  }

  Future<List<BlockedUser>> fetchBlockedUsers({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.fetchBlockedUsers}?page=$page&limit=$limit',
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final data = responseData['data'];
        final status = responseData['success'];
        if (status == true) {
          final List<BlockedUser> blockedUsers =
              (data['data'] as List)
                  .map((user) => BlockedUser.fromJson(user))
                  .toList();
          return blockedUsers;
        } else {
          debugPrint('No blocked Users: ');
          return [];
        }
      } else {
        throw Exception('Failed to fetch blocked users: ${response.body}');
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
      return [];
    }
  }

  /// Check if a user is blocked
  Future<bool> isUserBlocked(String userId) async {
    try {
      final blockedUsers = await fetchBlockedUsers();
      return blockedUsers.any((user) => user.user_id == userId);
    } catch (e) {
      return false;
    }
  }
}
