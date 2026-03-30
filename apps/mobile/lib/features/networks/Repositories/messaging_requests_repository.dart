import 'package:ascend_app/features/networks/model/message_model.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';

class MessageRequestRepository {
  final ApiClient _client;

  MessageRequestRepository({required ApiClient client}) : _client = client;

  Future<void> sendMessagingRequests(String userId) async {
    try {
      final response = await _client.post(
        '${ApiEndpoints.sendMessageRequest}/:$userId',
        data: {'userId': userId, 'message': "Hi, I'd like to chat about..."},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final Map<String, dynamic> data = responseData['data'];
        debugPrint(
          'Message request sent successfully from: ${data["senderId"]} to: ${data["receiverId"]} with Status: ${data["status"]}',
        );
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to send message request: ${data["success"]} with error: ${data["error"]}',
        );
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
    }
  }

  Future<void> acceptMessagingRequest(String requestId) async {
    try {
      final response = await _client.put(
        '${ApiEndpoints.respondMessageRequest}/:$requestId',
        data: {'accept': true},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('Message Request accepted Successfully');
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to accept message request: ${data["success"]} with error: ${data["error"]}',
        );
      }
    } catch (e) {
      debugPrint('Error accepting message request: $e');
    }
  }

  Future<void> rejectMessagingRequests(String requestId) async {
    try {
      final response = await _client.put(
        '${ApiEndpoints.respondMessageRequest}/:$requestId',
        data: {'accept': false},
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('Message Request rejected Successfully');
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to reject message request: ${data["success"]} with error: ${data["error"]}',
        );
      }
    } catch (e) {
      debugPrint('Error rejecting message request: $e');
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
