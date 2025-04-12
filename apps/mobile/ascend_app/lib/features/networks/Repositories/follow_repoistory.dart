import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_follow.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_followed_users.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_suggested_to_follow.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/core/constants/api_bases.dart';

class FollowRepoistory {
  final http.Client _client;
  //final AuthService _authService;

  // Keep the mock data for development
  /*
  final List<FollowedUser> followedUsers = MockFollowedUsers.getFollowing('10');
  final List<UserSuggestedtoFollow> suggestedUsers =
      MockSuggestedToFollow.getSuggestedToFollow();
  */

  FollowRepoistory({
    http.Client? client,
    //AuthService? authService,
  }) : _client = client ?? http.Client();
  //_authService = authService ?? AuthService();
  Future<void> addFollowingRepoistory(String userId) async {
    try {
      //final token = await _authService.getToken();
      final token = 'your_token_here'; // Replace with actual token retrieval
      final response = await _client.post(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.follow}/:${userId}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(userId),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to send connection request: ${response.body}');
      }
    } catch (e) {
      // For development, use mock implementation
      await Future.delayed(const Duration(milliseconds: 500));
      //addFollowing(Follows, followModel.followingId);
    }
  }

  Future<void> deleteFollowingRepoistory(String userId) async {
    try {
      //final token = await _authService.getToken();
      final token = 'your_token_here'; // Replace with actual token retrieval
      final response = await _client.delete(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.follow}/:${userId}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(userId),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to send connection request: ${response.body}');
      }
    } catch (e) {
      // For development, use mock implementation
      await Future.delayed(const Duration(milliseconds: 500));
      //addFollowing(Follows, followModel.followingId);
    }
  }

  Future<List<FollowedUser>> fetchFollowersRepoistory({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final token = 'your_token_here';
      final uri = Uri.parse(
        '${ApiBases.Connection_Base}${ApiEndpoints.follow}',
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
        return data.map((json) => FollowedUser.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch blocked users: ${response.body}');
      }
    } catch (e) {
      // For now, return mock data for development
      await Future.delayed(const Duration(milliseconds: 500));
      return [];
    }
  }

  Future<List<UserSuggestedtoFollow>> fetchSuggestedUsersRepoistory({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final token = 'your_token_here';
      final uri = Uri.parse(
        '${ApiBases.Connection_Base}${ApiEndpoints.follow}',
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
        return data
            .map((json) => UserSuggestedtoFollow.fromJson(json))
            .toList();
      } else {
        throw Exception('Failed to fetch blocked users: ${response.body}');
      }
    } catch (e) {
      // For now, return mock data for development
      await Future.delayed(const Duration(milliseconds: 500));
      return [];
    }
  }
}
