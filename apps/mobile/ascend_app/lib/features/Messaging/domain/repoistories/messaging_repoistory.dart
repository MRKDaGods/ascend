import 'dart:io';

import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/services/web_socket_service.dart';

/// Repository interface for messaging-related operations.
///
/// This defines the contract for accessing messaging data,
/// independent of the actual data source implementation.
abstract class MessagingRepository {
  // get Conversations
  Future<List<ConversationModel>> getConversations();

  //get Unseen Count
  Future<int> getUnseenCount();

  //get Messages
  Future<List<MessageModel>> getMessages(String conversationId, {int page = 1});

  //send Message
  Future<String> sendMessage(
    String receiverId,
    String content, {
    String contentType = 'text',
    File? file,
  });

  // WebSockets related

  // connect to WebSocket
  Future<bool> connectWebSocket();

  // disconnect from WebSocket
  Future<void> disconnectWebSocket();

  // getting streams
  Stream<Map<String, dynamic>> get messageStream;
  Stream<ConnectionState> get connectionStatusStream;
  Stream<Map<String, dynamic>> get typingStatusStream;
  Stream<Map<String, bool>> get readReceiptStream;
  bool isConnected();
  bool isRegistered();

  // send Typing notification
  void sendTypingNotification(String conversationId);

  // isAnyOne Typing
  bool isAnyoneTyping(String conversationId);

  Future<bool> sendFileMessage({
    required String conversationId,
    required String receiverId,
    required File file,
    required String content,
    required String fileType,
  });
}
