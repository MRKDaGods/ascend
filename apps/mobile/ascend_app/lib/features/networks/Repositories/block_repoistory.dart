import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/networks/model/blocked_user_model.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/core/constants/api_bases.dart';
//import 'package:ascend_app/core/services/auth_service.dart';

class BlockRepository {
  final http.Client _client;
  //final AuthService _authService;

  BlockRepository({http.Client? client}) : _client = client ?? http.Client();

  /// Block a user by their ID
  Future<void> blockUser(String userId) async {
    try {
      final token = 'your_token_here';
      final uri = Uri.parse(
        '${ApiBases.Connection_Base}${ApiEndpoints.block}/:$userId',
      );
      final response = await _client.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to unblock user: ${response.body}');
      }
    } catch (e) {
      // For now, print the error
      await Future.delayed(const Duration(milliseconds: 500));
      print('Error: $e');
    }
  }

  /// Unblock a user by their ID
  Future<void> unblockUser(String userId) async {
    try {
      final token = 'your_token_here';
      final uri = Uri.parse(
        '${ApiBases.Connection_Base}${ApiEndpoints.block}/:$userId',
      );
      final response = await _client.delete(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to unblock user: ${response.body}');
      }
    } catch (e) {
      // For now, print the error
      await Future.delayed(const Duration(milliseconds: 500));
      print('Error: $e');
    }
  }

  Future<List<BlockedUser>> fetchBlockedUsers({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final token = 'your_token_here';

      final uri = Uri.parse(
        '${ApiBases.Connection_Base}${ApiEndpoints.fetchBlockedUsers}',
      ).replace(
        queryParameters: {'page': page.toString(), 'limit': limit.toString()},
      );

      final response = await _client.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => BlockedUser.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch blocked users: ${response.body}');
      }
    } catch (e) {
      // For now, print the error
      await Future.delayed(const Duration(milliseconds: 500));
      print('Error: $e');
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
