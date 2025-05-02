part of 'messaging_bloc_bloc.dart';

abstract class MessagingBlocEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class IntializeMessaging extends MessagingBlocEvent {
  final bool forceReconnect;

  IntializeMessaging({this.forceReconnect = false});

  @override
  List<Object?> get props => [forceReconnect];
}

// Conversation related events
class LoadConversations extends MessagingBlocEvent {}

class LoadMoreConversations extends MessagingBlocEvent {
  final int page;
  LoadMoreConversations(this.page);
}

class RefreshUnseenCount extends MessagingBlocEvent {
  final int unseenCount;
  RefreshUnseenCount(this.unseenCount);
}

class LoadMessages extends MessagingBlocEvent {
  final String conversationId;
  LoadMessages(this.conversationId);

  @override
  List<Object?> get props => [conversationId];
}

class LoadMoreMessages extends MessagingBlocEvent {
  final String conversationId;
  LoadMoreMessages(this.conversationId);

  @override
  List<Object?> get props => [conversationId];
}

class SendMessage extends MessagingBlocEvent {
  final String conversationId;
  final String receiverId;
  final String content;
  final String contentType;
  final File? file;
  SendMessage(
    this.conversationId,
    this.receiverId,
    this.content, {
    this.contentType = 'text',
    this.file,
  });

  @override
  List<Object?> get props => [
    conversationId,
    receiverId,
    content,
    contentType,
    file,
  ];
}

class SetActiveConversation extends MessagingBlocEvent {
  final String conversationId;
  SetActiveConversation(this.conversationId);

  @override
  List<Object?> get props => [conversationId];
}

// Typing and Read Receipt events
class SendTypingNotification extends MessagingBlocEvent {
  final String conversationId;
  SendTypingNotification(this.conversationId);

  @override
  List<Object?> get props => [conversationId];
}

class MarkMessagesasRead extends MessagingBlocEvent {
  final String conversationId;
  MarkMessagesasRead(this.conversationId);

  @override
  List<Object?> get props => [conversationId];
}

// WebSocket events
class ConnectWebSocket extends MessagingBlocEvent {}

class DisconnectWebSocket extends MessagingBlocEvent {}

class WebSocketMessageReceived extends MessagingBlocEvent {
  final Map<String, dynamic> message;
  WebSocketMessageReceived(this.message);

  @override
  List<Object?> get props => [message];
}

class TypingStatusUpdated extends MessagingBlocEvent {
  final String conversationId;

  TypingStatusUpdated(this.conversationId);

  @override
  List<Object?> get props => [conversationId];
}

class ReadReceiptReceived extends MessagingBlocEvent {
  final Map<String, bool> readData;

  ReadReceiptReceived(this.readData);

  @override
  List<Object?> get props => [readData];
}
