import 'dart:async';
import 'dart:io';

import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/data/datasources/remote_datasource.dart';
import 'package:ascend_app/services/web_socket_service.dart' as custom_ws;
import 'package:flutter_bloc/flutter_bloc.dart';

part 'messaging_bloc_event.dart';
part 'messaging_bloc_state.dart';

class MessagingBloc extends Bloc<MessagingBlocEvent, MessagingBlocState> {
  bool _isIntialized = false;
  bool get isIntialized => _isIntialized;
  final MessagingRepoistoryImpl _repository;
  final Map<String, String> _conversationParticipants = {};
  final Map<String, Timer> _typingTimers = {}; // Keep track of typing timers

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
    on<MarkasUnRead>(_onMarkasUnRead);

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
      try {
        debugPrint('[MessagingBloc] Received typing data: $typingData');

        String? conversationId;

        // Extract from standard format
        if (typingData.containsKey('conversationId')) {
          conversationId = typingData['conversationId']?.toString();
        }
        // Fallback for {10: 10} format
        else if (typingData.keys.isNotEmpty) {
          conversationId = typingData.keys.first.toString();
        }
        // Direct value
        else {
          conversationId = typingData.toString();
        }

        if (conversationId != null && conversationId.isNotEmpty) {
          debugPrint(
            '[MessagingBloc] Extracted conversationId: $conversationId',
          );
          add(TypingStatusUpdated(conversationId, true));
        }
      } catch (e, stackTrace) {
        debugPrint(
          '[MessagingBloc] Error processing typing data: $e\n$stackTrace',
        );
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

        emit(MessagingIntialized(unseenCount));
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

      debugPrint(
        '[MessagingBloc] Loaded ${conversations.length} conversations',
      );

      // update the Typing status map
      final typingStatus = <String, bool>{};
      for (var conversation in conversations) {
        typingStatus[conversation.conversationId] = _repository.isAnyoneTyping(
          conversation.conversationId,
        );
      }

      // Store the other user IDs for each conversation
      for (var conversation in conversations) {
        _conversationParticipants[conversation.conversationId] =
            conversation.userId;
      }
      emit(
        ConversationLoaded(
          conversations,
          unseenCount,
          1,
          conversations.isEmpty || conversations.length < 20,
          typingStatus,
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
              currentState.typingStatus,
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

      // Set state to sending
      emit(
        currentState.copyWith(
          sendingStatus: {'status': 'sending', 'error': null},
        ),
      );

      // Attempt to send to server
      final String result = await _repository.sendMessage(
        event.receiverId,
        event.content,
        contentType: event.contentType,
        file: event.file,
      );

      if (result == 'success') {
        // Create optimistic message
        final String currentUserId =
            await SecureStorageHelper.getUserId() ?? '';
        final newMessage = MessageModel(
          messageId:
              DateTime.now().millisecondsSinceEpoch.toString(), // Temp ID
          senderId: currentUserId,
          conversationId: event.conversationId,
          content: event.content,
          fileUrl: event.file?.path,
          fileType: event.contentType,
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
            sendingStatus: {
              'status': 'success',
              'error': null,
            }, // Clear error status
          ),
        );
      } else {
        debugPrint('[MessagingBloc] Failed to send message: $result');

        // Emit error status
        emit(
          currentState.copyWith(
            sendingStatus: {'status': 'error', 'error': result},
          ),
        );
      }
    } catch (e) {
      debugPrint('[MessagingBloc] Error sending message: $e');

      // Get current state and update with error
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

  void _onSetActiveConversation(
    SetActiveConversation event,
    Emitter<MessagingBlocState> emit,
  ) {
    _activeConversationId = event.conversationId;

    // If conversation ID is not null, mark messages as read
    if (event.conversationId != '') {
      add(MarkMessagesasRead(event.conversationId));
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
        emit(currentState.copyWith(unseenCount: unseenCount));
      } else if (currentState is MessagingIntialized) {
        emit(currentState.copyWith(unseenCount: unseenCount));
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
        // cancel timers
        _typingTimers[conversationId]?.cancel();
        _typingTimers.remove(conversationId);

        // Emit the updated message list for the active chat
        emit(currentState.copyWith(messages: updatedMessages, isTyping: false));

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
      } else if (state is ConversationLoaded) {
        final currentState = state as ConversationLoaded;

        // Reset typing status for this conversation
        if (currentState.typingStatus.containsKey(conversationId) &&
            currentState.typingStatus[conversationId] == true) {
          final updatedTypingStatus = Map<String, bool>.from(
            currentState.typingStatus,
          );
          updatedTypingStatus[conversationId] = false;

          // We'll refresh conversations, but include the updated typing status
          add(RefreshUnseenCount(1));

          // Emit updated typing status immediately
          emit(currentState.copyWith(typingStatus: updatedTypingStatus));

          // Refresh conversations list after typing status update
          add(LoadConversations());
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
      final String conversationId = event.conversationId;
      final bool isTyping = event.isTyping;

      debugPrint(
        '[MessagingBloc] Typing status updated for conversation $conversationId: $isTyping',
      );

      // Cancel existing timer if any
      _typingTimers[conversationId]?.cancel();

      // Update for active conversation (chat view)
      if (_activeConversationId == conversationId) {
        final currentState = state;
        if (currentState is MessagesLoaded) {
          debugPrint(
            '[MessagingBloc] Updating MessagesLoaded typing status: $isTyping',
          );

          // Only emit if status actually changed
          if (currentState.isTyping != isTyping) {
            emit(
              currentState.copyWith(
                isTyping: isTyping,
                typingUpdatedAt: DateTime.now(), // Force state change
              ),
            );
          }
        }
      }

      // Update for conversation list
      if (state is ConversationLoaded) {
        final conversationState = state as ConversationLoaded;

        // Only update if the status is different
        if (conversationState.typingStatus[conversationId] != isTyping) {
          final updatedTypingStatus = Map<String, bool>.from(
            conversationState.typingStatus,
          );
          updatedTypingStatus[conversationId] = isTyping;

          debugPrint(
            '[MessagingBloc] Updating ConversationLoaded typing status for $conversationId: $isTyping',
          );
          emit(conversationState.copyWith(typingStatus: updatedTypingStatus));
        }
      }

      // If typing is true, set a timer to reset it
      if (isTyping) {
        _typingTimers[conversationId] = Timer(Duration(milliseconds: 1000), () {
          debugPrint(
            '[MessagingBloc] Typing timer expired for conversation: $conversationId',
          );
          add(TypingStatusUpdated(conversationId, false));
          _typingTimers.remove(conversationId);
        });
      }
    } catch (e) {
      debugPrint('[MessagingBloc] Error updating typing status: $e');
      emit(MessagingError('Failed to update typing status: $e'));
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

  void _onMarkasUnRead(
    MarkasUnRead event,
    Emitter<MessagingBlocState> emit,
  ) async {
    try {
      // Only proceed if we have a loaded state
      if (state is ConversationLoaded) {
        final currentState = state as ConversationLoaded;

        // Update conversations list - only mark as unread if unseenCount is 0
        final updatedConversations =
            currentState.conversations.map((conversation) {
              if (conversation.conversationId == event.conversationId &&
                  (conversation.unseenCount == 0)) {
                // Set unseen count to 1 and mark as not seen
                return conversation.copyWith(unseenCount: 1);
              }
              return conversation;
            }).toList();

        // Calculate new total unseen count
        final newUnseenCount = updatedConversations.fold<int>(
          0,
          (sum, conv) => sum + conv.unseenCount,
        );

        // Emit updated state
        emit(
          ConversationLoaded(
            updatedConversations,
            newUnseenCount,
            currentState.page,
            currentState.hasReachedMax,
            currentState.typingStatus,
          ),
        );
      }
    } catch (e) {
      debugPrint('[MessagingBloc] Error marking as unread: $e');
    }
  }

  @override
  Future<void> close() {
    _messageSubscription?.cancel();
    _connectionSubscription?.cancel();
    _typingSubscription?.cancel();
    _readReceiptSubscription?.cancel();

    // Cancel all typing timers
    for (var timer in _typingTimers.values) {
      timer.cancel();
    }
    _typingTimers.clear();

    return super.close();
  }
}
