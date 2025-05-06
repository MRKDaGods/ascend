import 'dart:async';
import 'dart:io';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:bloc_test/bloc_test.dart';

import 'package:ascend_app/features/Messaging/data/datasources/remote_datasource.dart';
import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/services/web_socket_service.dart' as custom_ws;

@GenerateMocks([MessagingRepoistoryImpl])
import 'messaging_bloc_test.mocks.dart';

// Create a testable version of the bloc that overrides SecureStorageHelper dependency
class TestableMessagingBloc extends MessagingBloc {
  final MessagingRepoistoryImpl _repository;
  bool _isIntialized = false;
  bool get isInitialized => _isIntialized;

  String _activeConversationId = '';

  @override
  String get activeConversationId => _activeConversationId;

  @override
  TestableMessagingBloc(
    this._repository, {
    required MessagingRepoistoryImpl repository,
  }) : super(repository: repository);

  // Override methods to avoid SecureStorageHelper
  @override
  Future<void> _onInitializeMessaging(
    IntializeMessaging event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      emit(MessagingBlocInitial());

      // Hard-code user ID
      final userId = '123';

      await _repository.connectWebSocket();
      await Future.delayed(const Duration(milliseconds: 500));

      final isConnected = _repository.isConnected();
      final isRegistered = _repository.isRegistered();

      if (!isConnected || !isRegistered) {
        emit(MessagingError('WebSocket failed to connect or register'));
        return;
      } else {
        add(LoadConversations());
        final unseenCount = await _repository.getUnseenCount();
        emit(MessagingIntialized(unseenCount));
      }

      _isIntialized = true;
    } catch (e) {
      emit(MessagingError('Failed to initialize messaging: $e'));
    }
  }

  @override
  Future<void> _onSendMessage(
    SendMessage event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      final currentState = state;
      if (currentState is! MessagesLoaded) {
        return;
      }

      emit(
        currentState.copyWith(
          sendingStatus: {'status': 'sending', 'error': null},
        ),
      );

      final String result = await _repository.sendMessage(
        event.receiverId,
        event.content,
      );

      if (result == 'success') {
        // Hard-coded user ID
        final String currentUserId = '123';

        final newMessage = MessageModel(
          messageId: DateTime.now().millisecondsSinceEpoch.toString(),
          senderId: currentUserId,
          conversationId: event.conversationId,
          content: event.content,
          fileUrl: null,
          fileType: null,
          sentAt: DateTime.now(),
          isRead: false,
          readAt: null,
        );

        final updatedMessages = [...currentState.messages, newMessage];

        emit(
          MessagesLoaded(
            updatedMessages,
            event.conversationId,
            currentState.page,
            currentState.hasReachedMax,
            isTyping: currentState.isTyping,
            sendingStatus: {'status': 'success', 'error': null},
          ),
        );
      } else {
        emit(
          currentState.copyWith(
            sendingStatus: {'status': 'error', 'error': result},
          ),
        );
      }
    } catch (e) {
      final currentState = state;
      if (currentState is MessagesLoaded) {
        emit(
          currentState.copyWith(
            sendingStatus: {'status': 'error', 'error': e.toString()},
          ),
        );
      } else {
        emit(MessagingError('Failed to send message: $e'));
      }
    }
  }
}

void main() {
  late MockMessagingRepoistoryImpl mockRepository;
  late TestableMessagingBloc messagingBloc;

  // Streams to control mock repository responses
  late StreamController<Map<String, dynamic>> messageStreamController;
  late StreamController<custom_ws.ConnectionState> connectionStreamController;
  late StreamController<Map<String, String>> typingStatusStreamController;
  late StreamController<Map<String, bool>> readReceiptStreamController;

  setUp(() {
    // Initialize controllers
    messageStreamController =
        StreamController<Map<String, dynamic>>.broadcast();
    connectionStreamController =
        StreamController<custom_ws.ConnectionState>.broadcast();
    typingStatusStreamController =
        StreamController<Map<String, String>>.broadcast();
    readReceiptStreamController =
        StreamController<Map<String, bool>>.broadcast();

    // Setup mocks
    mockRepository = MockMessagingRepoistoryImpl();

    // Set up default responses
    when(mockRepository.getUnseenCount()).thenAnswer((_) async => 0);
    when(mockRepository.getConversations()).thenAnswer((_) async => []);
    when(mockRepository.isAnyoneTyping(any)).thenReturn(false);
    when(mockRepository.isConnected()).thenReturn(true);
    when(mockRepository.isRegistered()).thenReturn(true);
    when(mockRepository.getMessages(any)).thenAnswer((_) async => []);
    when(mockRepository.markMessageAsSeen(any)).thenAnswer((_) async {});
    when(
      mockRepository.sendMessage(any, any),
    ).thenAnswer((_) async => 'success');
    when(mockRepository.connectWebSocket()).thenAnswer((_) async => true);

    when(
      mockRepository.sendFileMessage(
        conversationId: anyNamed('conversationId'),
        receiverId: anyNamed('receiverId'),
        file: anyNamed('file'),
        content: anyNamed('content'),
        fileType: anyNamed('fileType'),
      ),
    ).thenAnswer((_) async => true);

    // Mock repository streams
    when(
      mockRepository.messageStream,
    ).thenAnswer((_) => messageStreamController.stream);
    when(
      mockRepository.connectionStatusStream,
    ).thenAnswer((_) => connectionStreamController.stream);
    when(
      mockRepository.typingStatusStream,
    ).thenAnswer((_) => typingStatusStreamController.stream);
    when(
      mockRepository.readReceiptStream,
    ).thenAnswer((_) => readReceiptStreamController.stream);

    // Use TestWidgetsFlutterBinding to provide mock implementation
    TestWidgetsFlutterBinding.ensureInitialized();

    // Initialize the bloc with mocks
    messagingBloc = TestableMessagingBloc(
      mockRepository,
      repository: mockRepository,
    );
  });

  tearDown(() {
    messageStreamController.close();
    connectionStreamController.close();
    typingStatusStreamController.close();
    readReceiptStreamController.close();
    messagingBloc.close();
  });

  group('MessagingBloc initialization tests', () {
    test('Initial state is MessagingBlocInitial', () {
      expect(messagingBloc.state, isA<MessagingBlocInitial>());
    });

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'emits [MessagingBlocInitial, MessagingIntialized] when IntializeMessaging is added',
      build: () {
        when(mockRepository.connectWebSocket()).thenAnswer((_) async => true);
        when(mockRepository.isConnected()).thenReturn(true);
        when(mockRepository.isRegistered()).thenReturn(true);
        when(mockRepository.getUnseenCount()).thenAnswer((_) async => 5);
        when(mockRepository.getConversations()).thenAnswer((_) async => []);

        return messagingBloc;
      },
      act: (bloc) => bloc.add(IntializeMessaging()),
      expect:
          () => [
            isA<MessagingBlocInitial>(),
            isA<MessagingIntialized>().having(
              (state) => state.unseenCount,
              'unseenCount',
              5,
            ),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'emits [MessagingBlocInitial, MessagingError] when connection fails',
      build: () {
        when(
          mockRepository.connectWebSocket(),
        ).thenAnswer((_) async => throw Exception('Connection failed'));

        return messagingBloc;
      },
      act: (bloc) => bloc.add(IntializeMessaging()),
      expect: () => [isA<MessagingBlocInitial>(), isA<MessagingError>()],
    );
  });

  group('MessagingBloc conversation tests', () {
    final mockConversations = [
      ConversationModel(
        conversationId: '1',
        userId: '456',
        latestTimestamp: DateTime.now(),
        unseenCount: 2,
        isBlocked: false,
        otherUserName: 'Test User',
        otherUserProfileImageUrl: 'test_image.jpg',
        latestMessage: 'Hello',
      ),
      ConversationModel(
        conversationId: '2',
        userId: '789',
        latestTimestamp: DateTime.now(),
        unseenCount: 1,
        isBlocked: false,
        otherUserName: 'Another User',
        otherUserProfileImageUrl: 'another_image.jpg',
        latestMessage: 'Hi there',
      ),
    ];

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'emits [ConversationLoading, ConversationLoaded] when LoadConversations is added',
      build: () {
        when(
          mockRepository.getConversations(),
        ).thenAnswer((_) async => mockConversations);
        when(mockRepository.getUnseenCount()).thenAnswer((_) async => 3);
        when(mockRepository.isAnyoneTyping(any)).thenReturn(false);

        return messagingBloc;
      },
      act: (bloc) => bloc.add(LoadConversations()),
      expect:
          () => [
            isA<ConversationLoading>(),
            isA<ConversationLoaded>()
                .having(
                  (state) => state.conversations.length,
                  'conversations count',
                  2,
                )
                .having((state) => state.unseenCount, 'unseenCount', 3)
                .having((state) => state.hasReachedMax, 'hasReachedMax', false),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'updates unseen count when RefreshUnseenCount is added',
      seed: () => ConversationLoaded(mockConversations, 3, 1, false, {}),
      build: () {
        when(mockRepository.getUnseenCount()).thenAnswer((_) async => 1);
        return messagingBloc;
      },
      act: (bloc) => bloc.add(RefreshUnseenCount(0)),
      expect:
          () => [
            isA<ConversationLoaded>().having(
              (state) => state.unseenCount,
              'unseenCount',
              1,
            ),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'updates conversation when MarkasUnRead is added',
      seed: () => ConversationLoaded(mockConversations, 3, 1, false, {}),
      build: () => messagingBloc,
      act: (bloc) => bloc.add(MarkasUnRead('1')),
      expect:
          () => [
            isA<ConversationLoaded>().having(
              (state) =>
                  state.conversations
                      .firstWhere((c) => c.conversationId == '1')
                      .unseenCount,
              'unseenCount of conversation 1',
              1,
            ),
          ],
    );
  });

  group('MessagingBloc messages tests', () {
    final mockMessages = [
      MessageModel(
        messageId: '1',
        senderId: '456',
        conversationId: '1',
        content: 'Hello',
        fileUrl: null,
        fileType: null,
        sentAt: DateTime.now(),
        isRead: true,
        readAt: DateTime.now(),
      ),
      MessageModel(
        messageId: '2',
        senderId: '123', // Current user
        conversationId: '1',
        content: 'Hi there!',
        fileUrl: null,
        fileType: null,
        sentAt: DateTime.now(),
        isRead: false,
        readAt: null,
      ),
    ];

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'emits [MessagesLoading, MessagesLoaded] when LoadMessages is added',
      build: () {
        when(
          mockRepository.getMessages('1'),
        ).thenAnswer((_) async => mockMessages.reversed.toList());
        when(mockRepository.isAnyoneTyping('1')).thenReturn(false);
        when(mockRepository.markMessageAsSeen(any)).thenAnswer((_) async {});

        return messagingBloc;
      },
      act: (bloc) => bloc.add(LoadMessages('1')),
      expect:
          () => [
            isA<MessagesLoading>().having(
              (state) => state.conversationId,
              'conversationId',
              '1',
            ),
            isA<MessagesLoaded>()
                .having((state) => state.messages.length, 'messages count', 2)
                .having((state) => state.conversationId, 'conversationId', '1')
                .having((state) => state.hasReachedMax, 'hasReachedMax', false),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'updates messages when LoadMoreMessages is added',
      seed: () => MessagesLoaded(mockMessages, '1', 1, false, isTyping: false),
      build: () {
        final olderMessages = [
          MessageModel(
            messageId: '0',
            senderId: '456',
            conversationId: '1',
            content: 'Earlier message',
            fileUrl: null,
            fileType: null,
            sentAt: DateTime.now().subtract(Duration(days: 1)),
            isRead: true,
            readAt: null,
          ),
        ];

        when(
          mockRepository.getMessages('1', page: 2),
        ).thenAnswer((_) async => olderMessages);
        return messagingBloc;
      },
      act: (bloc) => bloc.add(LoadMoreMessages('1')),
      expect:
          () => [
            isA<MessagesLoaded>()
                .having((state) => state.messages.length, 'messages count', 3)
                .having((state) => state.page, 'page', 2),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'adds message to state when SendMessage is successful',
      seed: () => MessagesLoaded(mockMessages, '1', 1, false, isTyping: false),
      build: () {
        when(
          mockRepository.sendMessage('456', 'New message'),
        ).thenAnswer((_) async => 'success');
        return messagingBloc;
      },
      act: (bloc) => bloc.add(SendMessage('1', '456', 'New message')),
      expect:
          () => [
            isA<MessagesLoaded>().having(
              (state) => state.sendingStatus,
              'sending status',
              'sending',
            ),
            isA<MessagesLoaded>()
                .having((state) => state.messages.length, 'messages count', 3)
                .having(
                  (state) => state.messages.last.content,
                  'last message content',
                  'New message',
                )
                .having((state) => state.sendingStatus, 'status', 'success'),
          ],
      verify: (bloc) {
        verify(mockRepository.sendMessage('456', 'New message')).called(1);
      },
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'emits error state when SendMessage fails',
      seed: () => MessagesLoaded(mockMessages, '1', 1, false, isTyping: false),
      build: () {
        when(
          mockRepository.sendMessage('456', 'New message'),
        ).thenAnswer((_) async => 'error');
        return messagingBloc;
      },
      act: (bloc) => bloc.add(SendMessage('1', '456', 'New message')),
      expect:
          () => [
            isA<MessagesLoaded>().having(
              (state) => state.sendingStatus,
              'sending status',
              'sending',
            ),
            isA<MessagesLoaded>().having(
              (state) => state.sendingStatus,
              'status',
              'error',
            ),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'updates state when SendFileMessage is added',
      seed: () => MessagesLoaded(mockMessages, '1', 1, false, isTyping: false),
      build: () {
        when(
          mockRepository.sendFileMessage(
            conversationId: '1',
            receiverId: '456',
            file: any,
            content: 'File message',
            fileType: 'image',
          ),
        ).thenAnswer((_) async => true);
        when(
          mockRepository.getMessages('1'),
        ).thenAnswer((_) async => mockMessages.reversed.toList());
        when(mockRepository.isAnyoneTyping('1')).thenReturn(false);
        when(mockRepository.markMessageAsSeen(any)).thenAnswer((_) async {});
        return messagingBloc;
      },
      act:
          (bloc) => bloc.add(
            SendFileMessage(
              conversationId: '1',
              receiverId: '456',
              file: File('test_file.jpg'),
              content: 'File message',
              fileType: 'image',
            ),
          ),
      expect:
          () => [
            isA<MessagesLoaded>().having(
              (state) => state.sendingStatus,
              'sending status',
              'sending',
            ),
            isA<MessagesLoaded>().having(
              (state) => state.sendingStatus,
              'sending status',
              'success',
            ),
            isA<MessagesLoading>(),
            isA<MessagesLoaded>(),
          ],
    );
  });

  group('MessagingBloc WebSocket tests', () {
    final mockMessages = [
      MessageModel(
        messageId: '1',
        senderId: '456',
        conversationId: '1',
        content: 'Hello',
        fileUrl: null,
        fileType: null,
        sentAt: DateTime.now(),
        isRead: false,
        readAt: null,
      ),
    ];

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'updates messages when WebSocketMessageReceived is added for active conversation',
      seed: () {
        // Set active conversation and initial state
        messagingBloc.add(SetActiveConversation('1'));
        return MessagesLoaded(mockMessages, '1', 1, false, isTyping: false);
      },
      build: () {
        when(mockRepository.markMessageAsSeen(any)).thenAnswer((_) async {});
        return messagingBloc;
      },
      act: (bloc) {
        bloc.add(
          WebSocketMessageReceived({
            'data': {
              'messageId': '2',
              'conversationId': '1',
              'senderId': '456',
              'content': 'New websocket message',
              'sentAt': DateTime.now().toString(),
              'isRead': false,
            },
          }),
        );
      },
      wait: const Duration(milliseconds: 50),
      expect:
          () => [
            isA<MessagesLoaded>()
                .having((state) => state.messages.length, 'messages count', 2)
                .having(
                  (state) => state.messages.last.content,
                  'last message',
                  'New websocket message',
                ),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'updates typing status when TypingStatusUpdated is added',
      seed: () => MessagesLoaded(mockMessages, '1', 1, false, isTyping: false),
      build: () => messagingBloc,
      act: (bloc) => bloc.add(TypingStatusUpdated('1', true)),
      expect:
          () => [
            isA<MessagesLoaded>().having(
              (state) => state.isTyping,
              'typing status',
              true,
            ),
          ],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'emits MessagingConnected when connecting WebSocket',
      build: () => messagingBloc,
      act: (bloc) => bloc.add(ConnectWebSocket()),
      expect: () => [isA<MessagingConnected>()],
    );

    blocTest<TestableMessagingBloc, MessagingBlocState>(
      'emits MessagingDisconnected when disconnecting WebSocket',
      build: () => messagingBloc,
      act: (bloc) => bloc.add(DisconnectWebSocket()),
      expect: () => [isA<MessagingDisconnected>()],
    );

    test('handles WebSocket connection state changes', () async {
      // Setup
      when(mockRepository.getConversations()).thenAnswer((_) async => []);
      when(mockRepository.getUnseenCount()).thenAnswer((_) async => 0);
      when(mockRepository.isAnyoneTyping(any)).thenReturn(false);

      // Initial state check
      expect(messagingBloc.state, isA<MessagingBlocInitial>());

      // Trigger connection state change
      connectionStreamController.add(custom_ws.ConnectionState.connected);

      // Wait for processing
      await Future.delayed(Duration(milliseconds: 100));

      // Verify state changed
      expect(messagingBloc.state, isA<MessagingConnected>());
    });

    test('processes typing notifications from WebSocket', () async {
      // Setup
      when(mockRepository.getConversations()).thenAnswer((_) async => []);
      when(mockRepository.getUnseenCount()).thenAnswer((_) async => 0);
      when(mockRepository.isAnyoneTyping(any)).thenReturn(true);

      // Set active conversation
      messagingBloc.add(SetActiveConversation('1'));
      await Future.delayed(Duration(milliseconds: 50));

      // Set state for testing
      messagingBloc.emit(MessagesLoaded([], '1', 1, true, isTyping: false));

      // Send typing notification through stream
      typingStatusStreamController.add({'conversationId': '1'});

      // Wait for processing
      await Future.delayed(Duration(milliseconds: 100));

      // Verify typing status updated
      expect((messagingBloc.state as MessagesLoaded).isTyping, true);
    });
  });
}
