import 'package:ascend_app/features/networks/bloc/bloc/messaging/bloc/messaging_bloc.dart';
import 'package:ascend_app/features/networks/model/message_model.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/core/constants/api_bases.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MessageRequestRepoistory {
  final http.Client _client;
  //final AuthService _authService;

  // Keep the mock data for development
  /*
  final List<FollowedUser> followedUsers = MockFollowedUsers.getFollowing('10');
  final List<UserSuggestedtoFollow> suggestedUsers =
      MockSuggestedToFollow.getSuggestedToFollow();
  */

  MessageRequestRepoistory({
    http.Client? client,
    //AuthService? authService,
  }) : _client = client ?? http.Client();

  Future<void> sendMessagingRequests(String userId) async {
    try {
      final token = 'your_token_here';
      final response = await _client.post(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.messageRequest}/:${userId}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'userId': userId,
          'message': 'Hello, I would like to chat with you',
        }),
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to send message request: ${response.body}');
      }
    } catch (e) {
      // print error
      print('Error sending message request: $e');
    }
  }

  Future<void> acceptMessagingRequest(String requestId) async {
    try {
      final token = 'your_token_here';
      final response = await _client.put(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.messageRequest}/:${requestId}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'accept': 'true'}),
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to send message request: ${response.body}');
      }
    } catch (e) {
      // print error
      print('Error accepting message request: $e');
    }
  }

  Future<void> rejectMessagingRequests(String requestId) async {
    try {
      final token = 'your_token_here';
      final response = await _client.put(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.messageRequest}/:${requestId}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'accept': 'true'}),
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to send message request: ${response.body}');
      }
    } catch (e) {
      // print error
      print('Error rejecting message request: $e');
    }
  }

  Future<List<MessageRequestModel>> fetchMessagingRequests() {
    // Simulate fetching message requests from a repository or API
    return Future.delayed(const Duration(milliseconds: 500), () {
      return [
        MessageRequestModel(
          message_id: '1',
          receiverId: 'user1',
          message: 'Hello!',
          timestamp: DateTime.now(),
        ),
        MessageRequestModel(
          message_id: '2',
          receiverId: 'user2',
          message: 'How are you?',
          timestamp: DateTime.now(),
        ),
      ];
    });
  }
}
