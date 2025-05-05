import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/domain/repoistories/messaging_repoistory.dart'
    show MessagingRepository;
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:ascend_app/services/web_socket_service.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:math';

import 'package:http_parser/http_parser.dart';

class MessagingRepoistoryImpl implements MessagingRepository {
  final WebSocketService _webSocketService;
  final ApiClient _apiClient;

  MessagingRepoistoryImpl({
    required WebSocketService webSocketService,
    required ApiClient apiClient,
  }) : _webSocketService = webSocketService,
       _apiClient = apiClient;

  /// REST API CALLS
  @override
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
                debugPrint('[MessagingRepoistoryImpl] Converting item: $item');
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
        debugPrint(
          '[MessagingRepoistoryImpl] Unexpected response format: $responseData',
        );
        return [];
      } else {
        throw Exception('Failed to load conversations: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('[MessagingRepoistoryImpl] Error getting conversations: $e');
      throw Exception('Failed to load conversations: $e');
    }
  }

  @override
  Future<int> getUnseenCount() async {
    final url = ApiEndpoints.unseenCount;
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
      debugPrint(
        '[MessagingRepoistoryImpl] Fetching messages for conversation $conversationId, page $page',
      );
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
          debugPrint(
            '[MessagingRepoistoryImpl] No messages found in response for conversation $conversationId, page $page',
          );
          return [];
        }

        debugPrint(
          '[MessagingRepoistoryImpl] Processing ${messagesList.length} messages from API for conversation $conversationId, page $page',
        );

        // Convert to message models and assign conversationId
        return messagesList.map((message) {
          // Create message model from JSON
          final messageModel = MessageModel.fromJson(
            message as Map<String, dynamic>,
          );
          debugPrint(
            '[MessagingRepoistoryImpl] Processing message ${messageModel.messageId} (Sent: ${messageModel.sentAt})',
          ); // Log message order
          // Add the conversationId to each message
          return messageModel.copyWith(conversationId: conversationId);
        }).toList();
      } else {
        debugPrint(
          '[MessagingRepoistoryImpl] Failed to load messages: ${response.statusCode} for conversation $conversationId, page $page',
        );
        throw Exception('Failed to load messages: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint(
        '[MessagingRepoistoryImpl] Error getting messages for conversation $conversationId, page $page: $e',
      );
      throw Exception('Failed to load messages: $e');
    }
  }

  @override
  Future<String> sendMessage(
    String receiverId,
    String content, {
    String contentType = 'text',
    File? file,
  }) async {
    debugPrint(
      '[MessagingRepoistoryImpl] Sending message: receiverId=$receiverId, content=$content, contentType=$contentType',
    );
    if (file == null) {
      // Text-only message handling - this part is working fine
      final response = await _apiClient.post(
        ApiEndpoints.message,
        data: {'receiverId': receiverId, 'content': content},
      );
      if (response.statusCode == 200) {
        // Parse the response body and return success message
        final Map<String, dynamic> data = json.decode(response.body);
        return 'success';
      } else {
        // Handle error response
        try {
          final Map<String, dynamic> errorResponse = json.decode(response.body);
          return errorResponse['error'] ?? 'Error sending message';
        } catch (e) {
          return 'Error: ${response.statusCode} - ${response.body}';
        }
      }
    } else {
      // File message handling - this needs fixing
      final uriNew = 'https://api.ascendx.tech/messaging';
      final request = http.MultipartRequest('POST', Uri.parse(uriNew));

      // IMPORTANT: Keep headers minimal - only what's absolutely needed
      final authToken = await SecureStorageHelper.getAuthToken();
      request.headers['Authorization'] = 'Bearer $authToken';

      // Don't set these headers - they might be causing problems
      // request.headers['Accept'] = '*/*';
      // request.headers['User-Agent'] = 'AscendApp/1.0';
      // request.headers['Accept-Encoding'] = 'gzip, deflate, br';
      // request.headers['Connection'] = 'keep-alive';

      // Add fields - keep these simple
      request.fields['receiverId'] = receiverId;

      // Add content only if it's not empty
      if (content.isNotEmpty) {
        request.fields['content'] = content;
      }

      // Make sure contentType is sent
      request.fields['contentType'] = contentType;

      debugPrint('[MessagingRepoistoryImpl] File path: ${file.path}');

      try {
        // Check if file exists
        if (!await file.exists()) {
          return 'Error: File not found at path: ${file.path}';
        }

        // Get file size for debug
        final fileSize = await file.length();
        debugPrint('[MessagingRepoistoryImpl] File size: $fileSize bytes');

        // Add file to the request - try with explicit content type
        final fileName = file.path.split('/').last;
        String? mimeType;

        // Try to determine mime type
        final fileExt = fileName.toLowerCase().split('.').last;
        if (['jpg', 'jpeg'].contains(fileExt)) {
          mimeType = 'image/jpeg';
        } else if (fileExt == 'png') {
          mimeType = 'image/png';
        } else if (fileExt == 'pdf') {
          mimeType = 'application/pdf';
        } else if (fileExt == 'mp4') {
          mimeType = 'video/mp4';
        } else if (fileExt == 'doc' || fileExt == 'docx') {
          mimeType = 'application/msword';
        }

        // Use http_parser for content type if available
        final fileStream = http.ByteStream(file.openRead());
        final multipartFile = http.MultipartFile(
          'file', // Field name expected by server
          fileStream,
          await file.length(),
          filename: fileName,
          // Only set contentType if we could determine it
          contentType: mimeType != null ? MediaType.parse(mimeType) : null,
        );

        request.files.add(multipartFile);

        debugPrint(
          '[MessagingRepoistoryImpl] Added file: $fileName (${mimeType ?? 'unknown type'})',
        );
        debugPrint(
          '[MessagingRepoistoryImpl] Request fields: ${request.fields}',
        );

        // Log the request for debugging
        debugPrint('------ REQUEST DETAILS ------');
        debugPrint('URL: $uriNew');
        debugPrint('Method: POST');
        debugPrint('Headers: ${request.headers}');
        debugPrint('Fields: ${request.fields}');
        debugPrint('Files: ${request.files.length} ($fileName)');
        debugPrint('--------------------------');

        // Send the request with a timeout
        final streamedResponse = await request.send().timeout(
          const Duration(seconds: 60),
          onTimeout: () {
            throw TimeoutException('Request timed out after 60 seconds');
          },
        );

        final responseBody = await http.Response.fromStream(streamedResponse);

        debugPrint(
          '[MessagingRepoistoryImpl] Response status: ${responseBody.statusCode}',
        );
        debugPrint(
          '[MessagingRepoistoryImpl] Response body: ${responseBody.body}',
        );

        if (responseBody.statusCode == 200) {
          return 'success';
        } else {
          // Try to parse error response
          try {
            if (responseBody.body.trim().isNotEmpty) {
              final Map<String, dynamic> errorResponse = json.decode(
                responseBody.body,
              );
              return errorResponse['error'] ?? 'Error sending message';
            } else {
              return 'Error: Empty response with status ${responseBody.statusCode}';
            }
          } catch (e) {
            // If can't parse JSON
            if (responseBody.body.contains('<!DOCTYPE html>')) {
              return 'Server error: ${responseBody.statusCode}. Please try again.';
            }
            return 'Error: ${responseBody.statusCode}';
          }
        }
      } catch (e) {
        debugPrint('[MessagingRepoistoryImpl] Exception sending file: $e');
        return 'Error: $e';
      }
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
  Stream<Map<String, String>> get typingStatusStream =>
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
      final authToken = await SecureStorageHelper.getAuthToken();

      if (authToken == null) {
        debugPrint(
          '[MessagingRepoistoryImpl] WebSocket connection error: Auth token is null',
        );
        return false;
      }

      final url = 'https://ascendx.germanywestcentral.cloudapp.azure.com/';

      // Debug the URL before connecting
      debugPrint('[MessagingRepoistoryImpl] Connecting to WebSocket URL: $url');

      // Try connecting with appropriate error handling
      await _webSocketService.connect(url, authToken);

      // Check if user ID is needed for registration after connection

      return _webSocketService.isConnected && _webSocketService.isRegistered;
    } catch (e) {
      debugPrint('[MessagingRepoistoryImpl] WebSocket connection error: $e');
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
