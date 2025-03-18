part of 'connection_request_bloc.dart';

@immutable
sealed class ConnectionRequestEvent {}

class SendConnectionRequest extends ConnectionRequestEvent {
  final ConnectionRequestModel connectionRequest;
  SendConnectionRequest({required this.connectionRequest});
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

/*class RemoveConnection extends ConnectionRequestEvent {
  final String connectionId;
  RemoveConnection({required this.connectionId});
}
*/
class FetchPendingRequestsSent extends ConnectionRequestEvent {}

class FetchPendingRequestsReceived extends ConnectionRequestEvent {}

class FetchAcceptedConnections extends ConnectionRequestEvent {}
