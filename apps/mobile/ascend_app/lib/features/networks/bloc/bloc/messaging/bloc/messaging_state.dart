part of 'messaging_bloc.dart';

@immutable
sealed class MessagingState {}

final class MessagingInitial extends MessagingState {}

final class MessagingLoading extends MessagingState {}

final class MessagingRequestsLoaded extends MessagingState {
  final List<MessageRequestModel> receivedRequests;

  MessagingRequestsLoaded({required this.receivedRequests});
}

final class MessagingRequestsError extends MessagingState {
  final String message;

  MessagingRequestsError(this.message);
}
