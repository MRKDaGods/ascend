import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/domain/repoistories/messaging_repoistory.dart'
    show MessagingRepository;
import 'package:ascend_app/features/StartPages/repository/ApiClient.dart';
import 'package:ascend_app/services/web_socket_service.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/foundation.dart';

class MessagingRepoistoryImpl implements MessagingRepository {
  final WebSocketService _webSocketService;
  final ApiClient _apiClient;

  MessagingRepoistoryImpl({
    required WebSocketService webSocketService,
    required ApiClient apiClient,
  }) : _webSocketService = webSocketService,
       _apiClient = apiClient;

  /// REST API CALLS
  Future<List<ConversationModel>> getConversations({int page = 1}) async {
    try {
      final response = await _apiClient.get(
        '${ApiEndpoints.conversations}?page=$page',
      );

      if (response.statusCode == 200) {
        // Parse the JSON response
        final dynamic responseData = json.decode(response.body);

        // Check if we have data
        if (responseData == null) {
          return [];
        }

        // Handle the specific structure where "conversations" contains "data"
        if (responseData is Map) {
          // Check if response has a "conversations" object with "data" field
          if (responseData.containsKey('conversations') &&
              responseData['conversations'] is Map &&
              responseData['conversations'].containsKey('data')) {
            final dataList = responseData['conversations']['data'];

            if (dataList == null) {
              return [];
            }

            if (dataList is List) {
              return dataList.map((item) {
                // Print item to debug
                debugPrint('Converting item: $item');
                return ConversationModel.fromJson(item as Map<String, dynamic>);
              }).toList();
            }
            return [];
          }
          // Check if response directly has a "data" field
          else if (responseData.containsKey('data')) {
            final dataList = responseData['data'];

            if (dataList == null) {
              return [];
            }

            if (dataList is List) {
              return dataList
                  .map(
                    (item) => ConversationModel.fromJson(
                      item as Map<String, dynamic>,
                    ),
                  )
                  .toList();
            }
            return [];
          }
        }
        // Check if the response is directly a list
        else if (responseData is List) {
          return responseData
              .map(
                (item) =>
                    ConversationModel.fromJson(item as Map<String, dynamic>),
              )
              .toList();
        }

        // If we reach here, the response format is unexpected
        debugPrint('Unexpected response format: $responseData');
        return [];
      } else {
        throw Exception('Failed to load conversations: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error getting conversations: $e');
      throw Exception('Failed to load conversations: $e');
    }
  }

  @override
  Future<int> getUnseenCount() async {
    final url = '${ApiEndpoints.unseenCount}';
    final response = await _apiClient.get(url);
    if (response.statusCode == 200) {
      // Parse the response body and return the unseen count
      final Map<String, dynamic> data = json.decode(response.body);
      return data['unseenMessageCount'] ?? 0;
    } else {
      throw Exception('Failed to load unseen count');
    }
  }

  @override
  Future<List<MessageModel>> getMessages(
    String conversationId, {
    int page = 1,
  }) async {
    try {
      final response = await _apiClient.get(
        // Fix the URL format - remove the colon before conversationId
        '${ApiEndpoints.conversations}/$conversationId?page=$page',
      );

      if (response.statusCode == 200) {
        // Decode the JSON string first
        final dynamic responseData = json.decode(response.body);

        // Check if we have a nested data structure
        List<dynamic>? messagesList;

        if (responseData is Map && responseData.containsKey('data')) {
          messagesList = responseData['data'] as List<dynamic>?;
        } else if (responseData is List) {
          messagesList = responseData;
        } else if (responseData is Map &&
            responseData.containsKey('messages') &&
            responseData['messages'] is Map &&
            responseData['messages'].containsKey('data')) {
          messagesList = responseData['messages']['data'] as List<dynamic>?;
        }

        // If no valid data found
        if (messagesList == null) {
          return [];
        }

        // Convert to message models and assign conversationId
        return messagesList.map((message) {
          // Create message model from JSON
          final messageModel = MessageModel.fromJson(
            message as Map<String, dynamic>,
          );

          // Add the conversationId to each message
          return messageModel.copyWith(conversationId: conversationId);
        }).toList();
      } else {
        throw Exception('Failed to load messages: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error getting messages: $e');
      throw Exception('Failed to load messages: $e');
    }
  }

  @override
  Future<void> sendMessage(
    String receiverId,
    String content, {
    String contentType = 'text',
    File? file,
  }) async {
    final response = await _apiClient.post(
      '${ApiEndpoints.message}',
      data: {'receiverId': receiverId, 'content': content, 'file': file},
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to send message');
    }
  }

  // Streams and WebSocket related methods
  @override
  Stream<Map<String, dynamic>> get messageStream =>
      _webSocketService.messageStream;

  @override
  Stream<ConnectionState> get connectionStatusStream =>
      _webSocketService.connectionStatusStream;

  @override
  Stream<Map<String, bool>> get typingStatusStream =>
      _webSocketService.typingStatusStream;

  @override
  Stream<Map<String, bool>> get readReceiptStream =>
      _webSocketService.readReceiptStream;

  @override
  bool isConnected() => _webSocketService.isConnected;

  @override
  bool isRegistered() => _webSocketService.isRegistered;

  @override
  Future<bool> connectWebSocket() async {
    try {
      // Get WebSocket URL from API client
      String url = await _apiClient.getSocketServerUrl();
      final authToken = await SecureStorageHelper.getAuthToken();

      if (authToken == null) {
        debugPrint('WebSocket connection error: Auth token is null');
        return false;
      }

      // Debug the URL before connecting
      debugPrint('Connecting to WebSocket URL: $url');

      // Try connecting with appropriate error handling
      await _webSocketService.connect(url, authToken);

      // Check if user ID is needed for registration after connection

      return _webSocketService.isConnected && _webSocketService.isRegistered;
    } catch (e) {
      debugPrint('WebSocket connection error: $e');
      return false;
    }
  }

  @override
  Future<void> disconnectWebSocket() async {
    await _webSocketService.disconnect();
  }

  @override
  void sendTypingNotification(String conversationId) {
    _webSocketService.sendTypingNotification(conversationId);
  }

  @override
  Future<void> markMessageAsSeen(String conversationId) async {
    await _webSocketService.markMessageAsRead(conversationId);
  }

  @override
  bool isAnyoneTyping(String conversationId) {
    return _webSocketService.isAnyoneTyping(conversationId);
  }
}
