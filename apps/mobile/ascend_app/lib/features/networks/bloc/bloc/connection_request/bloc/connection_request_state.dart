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
  final List<ConnectionRequestModel> pendingRequestsReceived;
  final List<ConnectionRequestModel> pendingRequestsSent;
  final List<ConnectionRequestModel> acceptedConnections;

  ConnectionRequestSuccess({
    required this.pendingRequestsReceived,
    required this.pendingRequestsSent,
    required this.acceptedConnections,
  });

  ConnectionRequestSuccess copyWith({
    pendingRequestsReceived,
    pendingRequestsSent,
    acceptedConnections,
  }) {
    return ConnectionRequestSuccess(
      pendingRequestsReceived:
          pendingRequestsReceived ?? this.pendingRequestsReceived,
      pendingRequestsSent: pendingRequestsSent ?? this.pendingRequestsSent,
      acceptedConnections: acceptedConnections ?? this.acceptedConnections,
    );
  }
}
