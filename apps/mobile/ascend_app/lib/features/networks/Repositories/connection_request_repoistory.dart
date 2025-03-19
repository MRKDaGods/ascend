import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Mock Data/connections_request.dart';

import 'dart:async';

class ConnectionRequestRepository {
  final List<ConnectionRequestModel> connectionRequests = ConnectionRequests();

  void sendConnectionRequestRepository(
    ConnectionRequestModel connectionRequest,
  ) {
    //await Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    addConnectionRequest(connectionRequests, connectionRequest);
  }

  void acceptConnectionRequestRepoistory(String requestId) {
    //wait Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    acceptConnectionRequest(connectionRequests, requestId);
  }

  void DeclineConnectionRequestRepoistory(String requestId) {
    //await Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    declineConnectionRequest(connectionRequests, requestId);
  }

  List<ConnectionRequestModel> fetchPendingRequestsSent() {
    //await Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    return fetchPendingSentConnectionRequest(connectionRequests);
  }

  List<ConnectionRequestModel> fetchPendingRequestsReceived() {
    //await Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    return fetchPendingReceivedConnectionRequest(connectionRequests);
  }

  List<ConnectionRequestModel> fetchAcceptedConnections() {
    //await Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    return fetchAcceptedConnectionRequest(connectionRequests);
  }

  void cancelConnectionRequest(String requestId) {
    //await Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    removeConnectionRequest(connectionRequests, requestId);
  }

  void removeConnection(String connectionId) {
    //await Future.delayed(Duration(milliseconds: 500)); // Mock API delay
    removeConnectionRequest(connectionRequests, connectionId);
  }
}
