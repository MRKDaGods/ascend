import 'dart:convert';
import 'dart:io';

import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/Messaging/data/datasources/remote_datasource.dart';
import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:ascend_app/services/web_socket_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

// Generate mock classes
@GenerateMocks([WebSocketService, ApiClient])
import 'remote_datasource_test.mocks.dart';

void main() {
  late MessagingRepoistoryImpl repository;
  late MockWebSocketService mockWebSocketService;
  late MockApiClient mockApiClient;

  setUp(() {
    mockWebSocketService = MockWebSocketService();
    mockApiClient = MockApiClient();
    repository = MessagingRepoistoryImpl(
      webSocketService: mockWebSocketService,
      apiClient: mockApiClient,
    );
  });

  group('getConversations', () {
    test(
      'should return list of conversations when API call is successful',
      () async {
        // Arrange
        final response = http.Response(
          json.encode({
            'conversations': {
              'data': [
                {
                  'conversationId': '1',
                  'userId': 'user1',
                  'otherUserName': 'John Doe',
                  'otherUserProfileImageUrl': 'http://example.com/image.jpg',
                  'latestMessage': 'Hello',
                  'latestTimestamp': DateTime.now().toIso8601String(),
                  'unseenCount': 2,
                },
              ],
            },
          }),
          200,
        );
        when(
          mockApiClient.get('${ApiEndpoints.conversations}?page=1'),
        ).thenAnswer((_) async => response);

        // Act
        final result = await repository.getConversations();

        // Assert
        expect(result, isA<List<ConversationModel>>());
        expect(result.length, 1);
        expect(result[0].conversationId, '1');
        expect(result[0].otherUserName, 'John Doe');
      },
    );

    test('should throw exception when API call fails', () async {
      // Arrange
      when(
        mockApiClient.get('${ApiEndpoints.conversations}?page=1'),
      ).thenThrow(Exception('API Error'));

      // Act & Assert
      expect(() => repository.getConversations(), throwsException);
    });
  });

  group('getMessages', () {
    test(
      'should return list of messages when API call is successful',
      () async {
        // Arrange
        final conversationId = '123';
        final response = http.Response(
          json.encode({
            'data': [
              {
                'messageId': '1',
                'senderId': 'user1',
                'content': 'Hello',
                'sentAt': DateTime.now().toIso8601String(),
                'isRead': false,
              },
            ],
          }),
          200,
        );
        when(
          mockApiClient.get(
            '${ApiEndpoints.conversations}/$conversationId?page=1',
          ),
        ).thenAnswer((_) async => response);

        // Act
        final result = await repository.getMessages(conversationId);

        // Assert
        expect(result, isA<List<MessageModel>>());
        expect(result.length, 1);
        expect(result[0].messageId, '1');
        expect(result[0].content, 'Hello');
        expect(result[0].conversationId, conversationId);
      },
    );
  });

  group('WebSocket connection', () async {
    test(
      'connectWebSocket should return true when connection is successful',
      () async {
        // Arrange
        when(mockWebSocketService.connect(any, any)).thenAnswer((_) async {
          return true;
        });
        when(mockWebSocketService.isConnected).thenReturn(true);
        when(mockWebSocketService.isRegistered).thenReturn(true);
      },
    );
    when(mockWebSocketService.isConnected).thenReturn(true);
    when(mockWebSocketService.isRegistered).thenReturn(true);

    // Act
    final result = await repository.connectWebSocket();

    // Assert
    expect(result, true);
  });

  test('sendTypingNotification should call the WebSocketService', () {
    // Arrange
    final conversationId = '123';

    // Act
    repository.sendTypingNotification(conversationId);

    // Assert
    verify(
      mockWebSocketService.sendTypingNotification(conversationId),
    ).called(1);
  });
}
