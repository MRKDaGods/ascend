import 'dart:async';
import 'dart:io';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/data/datasources/remote_datasource.dart';
import 'package:ascend_app/services/web_socket_service.dart' as custom_ws;

part 'messaging_bloc_event.dart';
part 'messaging_bloc_state.dart';

class MessagingBloc extends Bloc<MessagingBlocEvent, MessagingBlocState> {
  bool _isIntialized = false;
  bool get isIntialized => _isIntialized;
  final MessagingRepoistoryImpl _repository;

  // Stream subscriptions to be canceled in the close method
  StreamSubscription? _messageSubscription;
  StreamSubscription? _connectionSubscription;
  StreamSubscription? _typingSubscription;
  StreamSubscription? _readReceiptSubscription;

  // Keep track of active conversation for UI purposes
  String? _activeConversationId;

  MessagingBloc({required MessagingRepoistoryImpl repository})
    : _repository = repository,
      super(MessagingBlocInitial()) {
    // Register event handlers
    on<IntializeMessaging>(_onInitializeMessaging);
    on<LoadConversations>(_onLoadConversations);
    on<LoadMoreConversations>(_onLoadMoreConversations);
    on<LoadMessages>(_onLoadMessages);
    on<LoadMoreMessages>(_onLoadMoreMessages);
    on<SendMessage>(_onSendMessage);
    on<SetActiveConversation>(_onSetActiveConversation);
    on<SendTypingNotification>(_onSendTypingNotification);
    on<MarkMessagesasRead>(_onMarkMessagesAsRead);
    on<RefreshUnseenCount>(_onRefreshUnseenCount);
    on<ConnectWebSocket>(_onConnectWebSocket);
    on<DisconnectWebSocket>(_onDisconnectWebSocket);
    on<WebSocketMessageReceived>(_onWebSocketMessageReceived);
    on<TypingStatusUpdated>(_onTypingStatusUpdated);
    on<ReadReceiptReceived>(_onReadReceiptReceived);

    // Setup WebSocket listeners
    _setupWebSocketListeners();
  }

  Future<void> _setupWebSocketListeners() async {
    // Listen for WebSocket connection changes
    _connectionSubscription = _repository.connectionStatusStream.listen((
      state,
    ) {
      if (state == custom_ws.ConnectionState.connected) {
        add(ConnectWebSocket());
      } else if (state == custom_ws.ConnectionState.disconnected) {
        add(DisconnectWebSocket());
      }
    });

    // Listen for WebSocket messages
    _messageSubscription = _repository.messageStream.listen((message) {
      add(WebSocketMessageReceived(message));
    });

    // Listen for typing status updates
    _typingSubscription = _repository.typingStatusStream.listen((typingData) {
      add(TypingStatusUpdated(typingData));
    });

    // Listen for read receipt updates
    _readReceiptSubscription = _repository.readReceiptStream.listen((readData) {
      add(ReadReceiptReceived(readData));
    });
  }

  Future<void> _onInitializeMessaging(
    IntializeMessaging event,
    Emitter<MessagingBlocState> emit,
  ) async {
    // Skip if already intialized
    if (_isIntialized && !event.forceReconnect) {
      debugPrint('Messaging already intialized, Skipping intialization.');
      return;
    }

    try {
      emit(MessagingBlocInitial()); // Add this state to show connecting status

      // check if there is a user connected
      final userId = await SecureStorageHelper.getUserId();

      if (userId == null) {
        emit(MessagingError('User ID not found in secure storage'));
        return;
      }
      debugPrint('Inside _onInitializeMessaging: User ID: $userId');

      // Connect to WebSocket through repository (repository handles both WebSocketService and ApiClient)
      await _repository.connectWebSocket();

      // Give it a moment to establish connection
      await Future.delayed(Duration(milliseconds: 500));

      // Now check connection status
      final isConnected = _repository.isConnected();
      final isRegistered = _repository.isRegistered();

      if (!isConnected || !isRegistered) {
        emit(MessagingError('WebSocket failed to connect or register'));
        return;
      } else {
        debugPrint('WebSocket connected and registered successfully!');
        // Load initial Conversations
        add(LoadConversations());

        // Get Unseen Count
        final unseenCount = await _repository.getUnseenCount();

        emit(MessagingIntialized(unseenCount ?? 0));
      }

      // Set initialized flag to true
      _isIntialized = true;

      debugPrint('Messaging initialized successfully!');
    } catch (e) {
      emit(MessagingError('Failed to initialize messaging: $e'));
    }
  }

  Future<void> _onLoadConversations(
    LoadConversations event,
    Emitter<MessagingBlocState> emit,
  ) async {
    emit(ConversationLoading());
    try {
      final conversations = await _repository.getConversations();
      final unseenCount = await _repository.getUnseenCount();
      emit(
        ConversationLoaded(
          conversations,
          unseenCount ?? 0,
          1,
          conversations.isEmpty || conversations.length < 20,
        ),
      );
    } catch (e) {
      emit(MessagingError('Failed to load conversations: $e'));
    }
  }

  Future<void> _onLoadMoreConversations(
    LoadMoreConversations event,
    Emitter<MessagingBlocState> emit,
  ) async {
    if (state is ConversationLoaded) {
      final currentState = state as ConversationLoaded;
      try {
        final moreConversations = await _repository.getConversations();

        if (moreConversations.isEmpty) {
          emit(currentState.copyWith(hasReachedMax: true));
        } else {
          emit(
            ConversationLoaded(
              [...currentState.conversations, ...moreConversations],
              currentState.unseenCount,
              event.page,
              moreConversations.length < 20,
            ),
          );
        }
      } catch (e) {
        emit(MessagingError('Failed to load more conversations: $e'));
      }
    }
  }

  Future<void> _onLoadMessages(
    LoadMessages event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      // keep track of the active conversation ID
      _activeConversationId = event.conversationId;

      emit(MessagesLoading(event.conversationId));

      final messages = await _repository.getMessages(event.conversationId);

      // mark messages as read
      add(MarkMessagesasRead(event.conversationId));

      emit(
        MessagesLoaded(
          messages,
          event.conversationId,
          1,
          messages.isEmpty || messages.length < 20,
          isTyping: _repository.isAnyoneTyping(event.conversationId),
        ),
      );
    } catch (e) {
      emit(MessagingError('Failed to load messages: $e'));
    }
  }

  Future<void> _onLoadMoreMessages(
    LoadMoreMessages event,
    Emitter<MessagingBlocState> emit,
  ) async {
    final currentState = state;
    if (currentState is MessagesLoaded &&
        currentState.conversationId == event.conversationId &&
        !currentState.hasReachedMax) {
      try {
        final nextPage = currentState.page + 1;
        final moreMessages = await _repository.getMessages(
          event.conversationId,
          page: nextPage,
        );

        if (moreMessages.isEmpty) {
          emit(currentState.copyWith(hasReachedMax: true));
        } else {
          // For messages, we usually prepend older messages
          emit(
            MessagesLoaded(
              [...moreMessages, ...currentState.messages],
              event.conversationId,
              nextPage,
              moreMessages.length < 20,
              isTyping: currentState.isTyping,
            ),
          );
        }
      } catch (e) {
        emit(MessagingError('Failed to load more messages: ${e.toString()}'));
      }
    }
  }

  Future<void> _onSendMessage(
    SendMessage event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      // Get current state
      final currentState = state;
      if (currentState is! MessagesLoaded) {
        return;
      }

      // Create optimistic message
      final String currentUserId = await SecureStorageHelper.getUserId() ?? '';
      final newMessage = MessageModel(
        messageId: DateTime.now().millisecondsSinceEpoch.toString(), // Temp ID
        senderId: currentUserId,
        conversationId: event.conversationId, // Use conversationId consistently
        content: event.content,
        fileUrl: null,
        fileType: null,
        sentAt: DateTime.now(),
        isRead: false,
        readAt: null,
      );

      // Update UI with optimistic message
      final updatedMessages = [...currentState.messages, newMessage];

      emit(
        MessagesLoaded(
          updatedMessages,
          event.conversationId,
          currentState.page,
          currentState.hasReachedMax,
          isTyping: currentState.isTyping,
        ),
      );

      // Attempt to send to server
      await _repository.sendMessage(event.conversationId, event.content);

      // No need to update UI again unless you get a server response with ID
    } catch (e) {
      // Handle error, possibly revert optimistic update
      debugPrint('Error sending message: $e');
    }
  }

  void _onSetActiveConversation(
    SetActiveConversation event,
    Emitter<MessagingBlocState> emit,
  ) {
    _activeConversationId = event.conversationId;

    // If conversation ID is not null, mark messages as read
    if (event.conversationId != '') {
      add(MarkMessagesasRead(event.conversationId!));
    }
  }

  void _onSendTypingNotification(
    SendTypingNotification event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      _repository.sendTypingNotification(event.conversationId);
    } catch (e) {
      emit(MessagingError('Failed to send typing notification: $e'));
    }
  }

  void _onMarkMessagesAsRead(
    MarkMessagesasRead event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      await _repository.markMessageAsSeen(event.conversationId);

      // now Refresh the unseen count
      add(RefreshUnseenCount(0));
    } catch (e) {
      emit(MessagingError('Failed to mark messages as read: $e'));
    }
  }

  Future<void> _onRefreshUnseenCount(
    RefreshUnseenCount event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      final unseenCount = await _repository.getUnseenCount();
      final currentState = state;
      if (currentState is ConversationLoaded) {
        emit(currentState.copyWith(unseenCount: unseenCount ?? 0));
      } else if (currentState is MessagingIntialized) {
        emit(currentState.copyWith(unseenCount: unseenCount ?? 0));
      }
    } catch (e) {
      emit(MessagingError('Failed to refresh unseen count: $e'));
    }
  }

  void _onConnectWebSocket(
    ConnectWebSocket event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      // update state
      emit(MessagingConnected());

      // Refresh Conversations
      add(LoadConversations());

      if (_activeConversationId != null) {
        // Refresh Messages
        add(LoadMessages(_activeConversationId!));
      }
    } catch (e) {
      emit(MessagingError('Failed to connect to WebSocket: $e'));
    }
  }

  void _onDisconnectWebSocket(
    DisconnectWebSocket event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      // update state
      emit(MessagingDisconnected());
    } catch (e) {
      emit(MessagingError('Failed to disconnect from WebSocket: $e'));
    }
  }

  void _onWebSocketMessageReceived(
    WebSocketMessageReceived event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      // get the message from the event
      final message = event.message;
      final conversationId = message['conversationId'] ?? '';

      // if you are not in the active conversation, refresh unSeen Count
      if (_activeConversationId != conversationId) {
        add(RefreshUnseenCount(0));
      }

      // if I am in the active conversation, update the messages
      if (_activeConversationId == conversationId && state is MessagesLoaded) {
        final MessagesLoaded currentState = state as MessagesLoaded;

        // Parse the message into a proper model
        final newMessage = MessageModel(
          messageId: message['messageId'] ?? '',
          senderId: message['senderId'] ?? '',
          content: message['content'] ?? '',
          fileUrl: message['fileUrl'],
          fileType: message['fileType'],
          sentAt: DateTime.parse(
            message['sentAt'] ?? DateTime.now().toIso8601String(),
          ),
          isRead: message['isRead'] ?? false,
          readAt:
              message['readAt'] != null
                  ? DateTime.parse(message['readAt'])
                  : null,
        );

        // Check if this is a message we sent (based on messageId)
        final tempIndex = currentState.messages.indexWhere(
          (msg) => msg.messageId == message['messageId'],
        );

        if (tempIndex >= 0) {
          // Update the temporary message with server data
          final updatedMessages = List<MessageModel>.from(
            currentState.messages,
          );
          updatedMessages[tempIndex] = newMessage;

          emit(currentState.copyWith(messages: updatedMessages));
        } else {
          // Add new message from someone else
          emit(
            currentState.copyWith(
              messages: [...currentState.messages, newMessage],
            ),
          );

          // Mark as read since we're actively viewing it
          add(MarkMessagesasRead(conversationId));
        }

        // Always refresh conversations to update latest message
        add(LoadConversations());
      }
    } catch (e) {
      emit(MessagingError('Failed to process WebSocket message: $e'));
    }
  }

  void _onTypingStatusUpdated(
    TypingStatusUpdated event,
    Emitter<MessagingBlocState> emit,
  ) async {
    final typingData = event.typingData;

    // Find conversation ID and typing status
    final String conversationId = typingData.keys.first;
    final bool isTyping = typingData[conversationId] ?? false;

    // Only update if we are viewing conversation
    if (_activeConversationId == conversationId) {
      final currentState = state;
      if (currentState is MessagesLoaded) {
        emit(currentState.copyWith(isTyping: isTyping));
      }
    }
  }

  void _onReadReceiptReceived(
    ReadReceiptReceived event,
    Emitter<MessagingBlocState> emit,
  ) async {
    final readData = event.readData;

    // Find conversation ID and read status
    final String conversationId = readData.keys.first;
    final bool isRead = readData[conversationId] ?? false;

    // Only update if we're viewing this conversation and messages are read
    if (_activeConversationId == conversationId &&
        isRead &&
        state is MessagesLoaded) {
      final currentState = state as MessagesLoaded;

      // Update the message status to read
      final updatedMessages =
          currentState.messages.map<MessageModel>((message) {
            if (message.senderId == conversationId) {
              return message.copyWith(isRead: isRead);
            }
            return message;
          }).toList();

      emit(currentState.copyWith(messages: updatedMessages));
    }
  }

  @override
  Future<void> close() {
    _messageSubscription?.cancel();
    _connectionSubscription?.cancel();
    _typingSubscription?.cancel();
    _readReceiptSubscription?.cancel();
    return super.close();
  }
}
