import 'package:ascend_app/features/networks/model/connection_request_model.dart';

void addConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  ConnectionRequestModel connectionRequest,
) {
  connectionRequests.add(connectionRequest);
}

void removeConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  String requestId,
) {
  connectionRequests.removeWhere((element) => element.requestId == requestId);
  print("Connection request removed number $requestId");
}

void acceptConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  String requestId,
) {
  print("Connection request accepted number $requestId");
  connectionRequests.forEach((element) {
    if (element.requestId == requestId) {
      element.status = "accepted";
      print(
        "Connection request accepted number ${element.requestId} from ${element.senderId} to ${element.receiverId}",
      );
    }
  });
}

void declineConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  String requestId,
) {
  connectionRequests.forEach((element) {
    if (element.requestId == requestId) {
      element.status = "rejected";
    }
  });
}

List<ConnectionRequestModel> fetchPendingSentConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
) {
  final List<ConnectionRequestModel> pendingRequestsSent =
      connectionRequests
          .where(
            (element) => element.status == "pending" && element.senderId == "1",
          )
          .toList();
  print("Pending requests sent:");
  pendingRequestsSent.forEach((element) => print(element.requestId));
  return pendingRequestsSent;
}

List<ConnectionRequestModel> fetchPendingReceivedConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
) {
  final List<ConnectionRequestModel> pendingRequestsReceived =
      connectionRequests
          .where(
            (element) =>
                element.status == "pending" && element.receiverId == "1",
          )
          .toList();
  print("Pending requests received:");
  pendingRequestsReceived.forEach((element) => print(element.requestId));
  return pendingRequestsReceived;
}

List<ConnectionRequestModel> fetchAcceptedConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
) {
  final List<ConnectionRequestModel> acceptedConnections =
      connectionRequests
          .where(
            (element) =>
                element.status == "accepted" &&
                (element.senderId == "1" || element.receiverId == "1"),
          )
          .toList();
  print("Accepted connections:");
  acceptedConnections.forEach((element) => print(element.requestId));
  return acceptedConnections;
}

List<ConnectionRequestModel> ConnectionRequests() {
  return [
    ConnectionRequestModel(
      requestId: "101",
      senderId: "1",
      receiverId: "2",
      status: "pending",
      timestamp: "2021-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "102",
      senderId: "3",
      receiverId: "1",
      status: "pending",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "103",
      senderId: "4",
      receiverId: "2",
      status: "pending",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "104",
      senderId: "5",
      receiverId: "2",
      status: "pending",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "105",
      senderId: "6",
      receiverId: "1",
      status: "pending",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "106",
      senderId: "7",
      receiverId: "2",
      status: "pending",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "107",
      senderId: "8",
      receiverId: "5",
      status: "pending",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "108",
      senderId: "1",
      receiverId: "9",
      status: "pending",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "109",
      senderId: "7",
      receiverId: "1",
      status: "accepted",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "110",
      senderId: "1",
      receiverId: "8",
      status: "accepted",
      timestamp: "2024-09-01T12:00:00Z",
    ),
    ConnectionRequestModel(
      requestId: "111",
      senderId: "1",
      receiverId: "4",
      status: "rejected",
      timestamp: "2024-09-01T12:00:00Z",
    ),
  ];
}
