part of 'connection_request_bloc.dart';

@immutable
sealed class ConnectionRequestEvent {}

class SendConnectionRequest extends ConnectionRequestEvent {
  final String connctionId;
  SendConnectionRequest({required this.connctionId});
}

class AcceptConnectionRequest extends ConnectionRequestEvent {
  final String requestId;
  AcceptConnectionRequest({required this.requestId});
}

class DeclineConnectionRequest extends ConnectionRequestEvent {
  final String requestId;
  DeclineConnectionRequest({required this.requestId});
}

class CancelConnectionRequest extends ConnectionRequestEvent {
  final String requestId;
  CancelConnectionRequest({required this.requestId});
}

class RemoveConnection extends ConnectionRequestEvent {
  final String connectionId;
  RemoveConnection({required this.connectionId});
}

class FetchConnectionRequests extends ConnectionRequestEvent {}
