part of 'messaging_bloc.dart';

@immutable
sealed class MessagingEvent {}

final class FetchReceivedMessagingRequests extends MessagingEvent {}

final class SendMessageRequest extends MessagingEvent {
  final String receiverId;

  SendMessageRequest({required this.receiverId});
}

final class AcceptMessageRequest extends MessagingEvent {
  final String messageId;

  AcceptMessageRequest({required this.messageId});
}

final class DeclineMessageRequest extends MessagingEvent {
  final String messageId;

  DeclineMessageRequest({required this.messageId});
}
