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
  final Map<String, String> _conversationParticipants = {};

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

    _typingSubscription = _repository.typingStatusStream.listen((typingData) {
      // The typingData should be a Map with conversationId as the key
      final Object conversationId =
          typingData is Map
              ? (typingData['conversationId']?.toString() ?? '')
              : (typingData is String ? typingData : '');

      if (conversationId.toString().isNotEmpty) {
        add(TypingStatusUpdated(conversationId.toString()));
      }
    });

    // Listen for read receipt updates
    _readReceiptSubscription = _repository.readReceiptStream.listen((
      conversationId,
    ) {
      add(ReadReceiptReceived(conversationId));
    });
  }

  Future<void> _onInitializeMessaging(
    IntializeMessaging event,
    Emitter<MessagingBlocState> emit,
  ) async {
    // Skip if already intialized
    if (_isIntialized && !event.forceReconnect) {
      debugPrint(
        '[MessagingBloc] Messaging already intialized, Skipping intialization.',
      );
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
      debugPrint(
        '[MessagingBloc] Inside _onInitializeMessaging: User ID: $userId',
      );

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
        debugPrint(
          '[MessagingBloc] WebSocket connected and registered successfully!',
        );
        // Load initial Conversations
        add(LoadConversations());

        // Get Unseen Count
        final unseenCount = await _repository.getUnseenCount();

        emit(MessagingIntialized(unseenCount ?? 0));
      }

      // Set initialized flag to true
      _isIntialized = true;

      debugPrint('[MessagingBloc] Messaging initialized successfully!');
    } catch (e) {
      debugPrint('[MessagingBloc] Error initializing messaging: $e');
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

      // Store the other user IDs for each conversation
      for (var conversation in conversations) {
        _conversationParticipants[conversation.conversationId] =
            conversation.userId;
      }
      emit(
        ConversationLoaded(
          conversations,
          unseenCount ?? 0,
          1,
          conversations.isEmpty || conversations.length < 20,
        ),
      );
    } catch (e) {
      debugPrint('[MessagingBloc] Error loading conversations: $e');
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

        // Store the other user ID for each new conversation
        for (var conversation in moreConversations) {
          _conversationParticipants[conversation.conversationId] =
              conversation.userId;
        }

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
        debugPrint('[MessagingBloc] Error loading more conversations: $e');
        emit(MessagingError('Failed to load more conversations: $e'));
      }
    }
  }

  Future<void> _onLoadMessages(
    LoadMessages event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      debugPrint(
        '[MessagingBloc] Loading messages for conversation ${event.conversationId} ,',
      );
      // keep track of the active conversation ID
      _activeConversationId = event.conversationId;

      emit(MessagesLoading(event.conversationId));

      final messages = await _repository.getMessages(event.conversationId);
      // Reverse the initial list to store chronologically (oldest first)
      final chronologicalMessages = messages.reversed.toList();

      debugPrint(
        '[MessagingBloc] Loaded ${chronologicalMessages.length} messages for conversation ${event.conversationId}',
      );
      // mark messages as read
      add(MarkMessagesasRead(event.conversationId));

      emit(
        MessagesLoaded(
          chronologicalMessages, // Emit the reversed list
          event.conversationId,
          1,
          messages.isEmpty ||
              messages.length < 20, // Use original list length for check
          isTyping: _repository.isAnyoneTyping(event.conversationId),
        ),
      );
    } catch (e) {
      debugPrint('[MessagingBloc] Error loading messages: $e');
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
        debugPrint(
          '[MessagingBloc] Loading more messages for conversation ${currentState.conversationId}, page $nextPage',
        );
        final moreMessages = await _repository.getMessages(
          event.conversationId,
          page: nextPage,
        );

        if (moreMessages.isEmpty) {
          emit(currentState.copyWith(hasReachedMax: true));
        } else {
          // Reverse the newly fetched older messages to be chronological
          final chronologicalMoreMessages = moreMessages.reversed.toList();
          debugPrint(
            '[MessagingBloc] Loaded ${chronologicalMoreMessages.length} more messages for conversation ${currentState.conversationId}',
          );
          // Prepend the older chronological messages to the existing chronological list
          final combinedMessages = [
            ...chronologicalMoreMessages,
            ...currentState.messages,
          ];
          emit(
            MessagesLoaded(
              combinedMessages, // Emit the combined chronological list
              event.conversationId,
              nextPage,
              moreMessages.length < 20, // Use original list length for check
              isTyping: currentState.isTyping,
            ),
          );
        }
      } catch (e) {
        debugPrint('[MessagingBloc] Error loading more messages: $e');
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
      await _repository.sendMessage(event.receiverId, event.content);

      // No need to update UI again unless you get a server response with ID
    } catch (e) {
      // Handle error, possibly revert optimistic update
      debugPrint('[MessagingBloc] Error sending message: $e');
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
      debugPrint('[MessagingBloc] Error sending typing notification: $e');
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
      debugPrint('[MessagingBloc] Error marking messages as read: $e');
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
      debugPrint('[MessagingBloc] Error refreshing unseen count: $e');
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
      debugPrint('[MessagingBloc] Error connecting WebSocket: $e');
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
      debugPrint('[MessagingBloc] Error disconnecting WebSocket: $e');
      emit(MessagingError('Failed to disconnect from WebSocket: $e'));
    }
  }

  void _onWebSocketMessageReceived(
    WebSocketMessageReceived event,
    Emitter<MessagingBlocState> emit,
  ) async {
    final message = event.message;
    debugPrint(
      '[MessagingBloc] Received WebSocket message: $message',
    ); // Log raw message

    final currentState = state;
    try {
      // final message = event.message; // Already defined above
      final messageData = message['data'] ?? {};
      final conversationId =
          messageData['conversationId']?.toString() ?? ''; // Safer parsing
      debugPrint(
        '[MessagingBloc] Parsed conversationId: $conversationId from message',
      );

      // get the otherUserId from the conversationParticipants map
      final otherUserId = _conversationParticipants[conversationId] ?? '';
      debugPrint(
        '[MessagingBloc] Found otherUserId: $otherUserId for conversation $conversationId',
      );

      // if I am in the active conversation, update the messages
      if (_activeConversationId == conversationId && state is MessagesLoaded) {
        final MessagesLoaded currentState = state as MessagesLoaded;
        debugPrint(
          '[MessagingBloc] Active conversation matches ($conversationId). Current state is MessagesLoaded. Processing message...',
        );

        // Parse the message into a proper model
        final newMessage = MessageModel(
          messageId:
              messageData['messageId']?.toString() ??
              DateTime.now().millisecondsSinceEpoch
                  .toString(), // Safer parsing with fallback
          conversationId: conversationId,
          content: messageData['content'] ?? '',
          fileUrl: messageData['fileUrl'],
          fileType: messageData['fileType'],
          sentAt:
              DateTime.tryParse(messageData['sentAt'] ?? '') ??
              DateTime.now(), // Safer parsing with fallback
          isRead: messageData['isRead'] ?? false,
          readAt:
              messageData['readAt'] != null
                  ? DateTime.tryParse(messageData['readAt'])
                  : null, // Safer parsing
          senderId:
              messageData['senderId']?.toString() ??
              otherUserId, // Prefer senderId from message data if available
        );
        debugPrint(
          '[MessagingBloc] Parsed newMessage: ID=${newMessage.messageId}, Sender=${newMessage.senderId}, Content=${newMessage.content}',
        );

        // Check if this is a message we sent (based on messageId matching an optimistic one)
        // Note: This logic might need refinement based on how optimistic IDs are handled vs server IDs.
        // If the server sends back the *same* ID as the optimistic one, this works.
        // If the server assigns a *new* ID, you might need to match based on content/timestamp or have the server echo back the temp ID.
        final tempIndex = currentState.messages.indexWhere(
          (msg) =>
              msg.messageId == newMessage.messageId &&
              msg.senderId ==
                  SecureStorageHelper.getUserId()
                      .toString(), // Check if it's *our* optimistic message
        );

        List<MessageModel> updatedMessages;
        if (tempIndex >= 0) {
          // Update the temporary message with server data (or confirm it)
          debugPrint(
            '[MessagingBloc] Found matching optimistic message at index $tempIndex. Updating message ID: ${newMessage.messageId}',
          );
          updatedMessages = List<MessageModel>.from(currentState.messages);
          // Replace the optimistic message with the confirmed one from the server
          updatedMessages[tempIndex] = newMessage;
          debugPrint(
            '[MessagingBloc] Updated existing optimistic message (ID: ${newMessage.messageId}). Emitting new state.',
          );
        } else {
          // Add new message from someone else (or our own message confirmed with a new ID)
          debugPrint(
            '[MessagingBloc] Adding new message (ID: ${newMessage.messageId}) to the list.',
          );
          updatedMessages = [...currentState.messages, newMessage];
          debugPrint(
            '[MessagingBloc] Added new message (ID: ${newMessage.messageId}). Emitting new state.',
          );
        }

        // Emit the updated message list for the active chat
        emit(currentState.copyWith(messages: updatedMessages));

        // Mark as read since we're actively viewing it and it's not ours
        final currentUserId = await SecureStorageHelper.getUserId();
        if (newMessage.senderId != currentUserId && tempIndex < 0) {
          // Only mark as read if it's a new message from someone else
          debugPrint(
            '[MessagingBloc] Message is from other user. Marking conversation $conversationId as read.',
          );
          add(MarkMessagesasRead(conversationId));
        } else {
          debugPrint(
            '[MessagingBloc] Message is from current user or an update to optimistic message. Not marking as read.',
          );
        }

        // Consider if a conversation list update is still needed here,
        // perhaps just updating the single conversation item's preview
        // instead of reloading all. For now, we omit the full reload.
        // add(LoadConversations()); // Removed from here
      } else {
        // Message is for a non-active conversation or state is not MessagesLoaded
        debugPrint(
          '[MessagingBloc] Message received for conversation $conversationId, but not processing for active chat view. Active: $_activeConversationId, State: ${state.runtimeType}',
        );
        // Refresh unseen count as the user is not seeing it immediately
        add(RefreshUnseenCount(1));
        // Refresh conversations list to update latest message preview and order
        add(LoadConversations());
      }
    } catch (e, stackTrace) {
      // Catch stack trace
      debugPrint(
        '[MessagingBloc] Error processing WebSocket message: $e\n$stackTrace',
      ); // Log stack trace
      emit(MessagingError('Failed to process WebSocket message: $e'));
    }
  }

  void _onTypingStatusUpdated(
    TypingStatusUpdated event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      // Find conversation ID and typing status
      final String conversationId = event.conversationId;
      final bool isTyping = true;

      // Only update if we are viewing conversation
      if (_activeConversationId == conversationId) {
        final currentState = state;
        if (currentState is MessagesLoaded) {
          emit(currentState.copyWith(isTyping: isTyping));
        }
      }
    } catch (e) {
      debugPrint('[MessagingBloc] Error processing typing status: $e');
      emit(MessagingError('Failed to process typing status: $e'));
    }
  }

  void _onReadReceiptReceived(
    ReadReceiptReceived event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
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
              if (message.conversationId == conversationId) {
                return message.copyWith(isRead: isRead);
              }
              return message;
            }).toList();

        emit(currentState.copyWith(messages: updatedMessages));
      }
    } catch (e) {
      debugPrint('[MessagingBloc] Error processing read receipt: $e');
      emit(MessagingError('Failed to process read receipt: $e'));
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
