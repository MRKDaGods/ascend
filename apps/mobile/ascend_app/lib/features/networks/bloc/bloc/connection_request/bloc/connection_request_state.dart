part of 'connection_request_bloc.dart';

@immutable
sealed class ConnectionRequestState {}

final class ConnectionRequestInitial extends ConnectionRequestState {}

final class ConnectionRequestLoading extends ConnectionRequestState {}

final class ConnectionRequestError extends ConnectionRequestState {
  final String error;

  ConnectionRequestError(this.error);
}

final class ConnectionRequestSuccess extends ConnectionRequestState {
  final List<UserPendingModel> pendingRequestsReceived;
  final List<UserPendingModel> pendingRequestsSent;
  final List<ConnectedUser> acceptedConnections;
  final List<UserSuggestedtoConnect> suggestedToConnect;

  ConnectionRequestSuccess({
    required this.pendingRequestsReceived,
    required this.pendingRequestsSent,
    required this.acceptedConnections,
    required this.suggestedToConnect,
  });
}
