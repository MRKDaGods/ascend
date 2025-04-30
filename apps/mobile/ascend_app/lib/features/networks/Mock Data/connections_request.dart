import 'package:ascend_app/features/networks/model/connection_request_model.dart';

void addConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  ConnectionRequestModel connectionRequest,
) {
  // Check if the senderId and receiverId combination already exists
  final exists = connectionRequests.any(
    (element) =>
        (element.senderId == connectionRequest.senderId &&
            element.receiverId == connectionRequest.receiverId) ||
        (element.senderId == connectionRequest.receiverId &&
            element.receiverId == connectionRequest.senderId),
  );

  if (!exists) {
    connectionRequests.add(connectionRequest);
  }
}

void removeConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  String requestId,
) {
  connectionRequests.removeWhere((element) => element.requestId == requestId);
}

void acceptConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  String requestId,
) {
  for (var element in connectionRequests) {
    if (element.requestId == requestId) {
      element.status = "accepted";
      element.timestamp =
          DateTime.now(); // Update the timestamp to current time
    }
  }
}

void declineConnectionRequest(
  List<ConnectionRequestModel> connectionRequests,
  String requestId,
) {
  for (var element in connectionRequests) {
    if (element.requestId == requestId) {
      element.status = "rejected";
      element.timestamp =
          DateTime.now(); // Update the timestamp to current time
    }
  }
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
  return acceptedConnections;
}

List<ConnectionRequestModel> ConnectionRequests() {
  return [
    ConnectionRequestModel(
      requestId: "101",
      senderId: "1",
      receiverId: "2",
      status: "pending",
      timestamp: DateTime(2023, 11, 15, 9, 45, 22), // November 15, 2023
    ),
    ConnectionRequestModel(
      requestId: "102",
      senderId: "3",
      receiverId: "1",
      status: "pending",
      timestamp: DateTime(2024, 3, 21, 14, 32, 18), // March 21, 2024
    ),
    ConnectionRequestModel(
      requestId: "103",
      senderId: "4",
      receiverId: "2",
      status: "pending",
      timestamp: DateTime(2024, 2, 8, 11, 27, 45), // February 8, 2024
    ),
    ConnectionRequestModel(
      requestId: "104",
      senderId: "5",
      receiverId: "2",
      status: "pending",
      timestamp: DateTime(2024, 1, 17, 16, 9, 33), // January 17, 2024
    ),
    ConnectionRequestModel(
      requestId: "105",
      senderId: "6",
      receiverId: "1",
      status: "pending",
      timestamp: DateTime(2024, 3, 30, 8, 15, 27), // March 30, 2024
    ),
    ConnectionRequestModel(
      requestId: "106",
      senderId: "7",
      receiverId: "2",
      status: "pending",
      timestamp: DateTime(2023, 12, 12, 19, 42, 51), // December 12, 2023
    ),
    ConnectionRequestModel(
      requestId: "107",
      senderId: "8",
      receiverId: "5",
      status: "pending",
      timestamp: DateTime(2024, 3, 5, 10, 21, 14), // March 5, 2024
    ),
    ConnectionRequestModel(
      requestId: "108",
      senderId: "1",
      receiverId: "9",
      status: "pending",
      timestamp: DateTime(2024, 3, 29, 13, 55, 38), // March 29, 2024
    ),
    ConnectionRequestModel(
      requestId: "109",
      senderId: "7",
      receiverId: "1",
      status: "accepted",
      timestamp: DateTime(2023, 10, 28, 17, 6, 22), // October 28, 2023
    ),
    ConnectionRequestModel(
      requestId: "110",
      senderId: "1",
      receiverId: "8",
      status: "accepted",
      timestamp: DateTime(2023, 9, 14, 8, 37, 11), // September 14, 2023
    ),
    ConnectionRequestModel(
      requestId: "111",
      senderId: "1",
      receiverId: "4",
      status: "accepted",
      timestamp: DateTime(2023, 11, 2, 15, 44, 29), // November 2, 2023
    ),
    ConnectionRequestModel(
      requestId: "112",
      senderId: "1",
      receiverId: "11",
      status: "accepted",
      timestamp: DateTime(2024, 2, 19, 9, 22, 56), // February 19, 2024
    ),
    ConnectionRequestModel(
      requestId: "113",
      senderId: "4",
      receiverId: "12",
      status: "accepted",
      timestamp: DateTime(2023, 8, 5, 14, 11, 47), // August 5, 2023
    ),
    ConnectionRequestModel(
      requestId: "114",
      senderId: "4",
      receiverId: "21",
      status: "accepted",
      timestamp: DateTime(2023, 12, 28, 16, 39, 12), // December 28, 2023
    ),
    ConnectionRequestModel(
      requestId: "115",
      senderId: "4",
      receiverId: "22",
      status: "accepted",
      timestamp: DateTime(2024, 1, 3, 11, 18, 42), // January 3, 2024
    ),
    ConnectionRequestModel(
      requestId: "116",
      senderId: "7",
      receiverId: "22",
      status: "accepted",
      timestamp: DateTime(2023, 10, 11, 12, 27, 35), // October 11, 2023
    ),
    ConnectionRequestModel(
      requestId: "117",
      senderId: "4",
      receiverId: "23",
      status: "accepted",
      timestamp: DateTime(2024, 3, 14, 10, 5, 19), // March 14, 2024
    ),
    ConnectionRequestModel(
      requestId: "118",
      senderId: "23",
      receiverId: "11",
      status: "accepted",
      timestamp: DateTime(2023, 9, 29, 13, 42, 31), // September 29, 2023
    ),
    ConnectionRequestModel(
      requestId: "119",
      senderId: "23",
      receiverId: "8",
      status: "accepted",
      timestamp: DateTime(2024, 2, 26, 15, 33, 27), // February 26, 2024
    ),
    ConnectionRequestModel(
      requestId: "120",
      senderId: "23",
      receiverId: "5",
      status: "accepted",
      timestamp: DateTime(2023, 7, 19, 9, 50, 44), // July 19, 2023
    ),
    ConnectionRequestModel(
      requestId: "121",
      senderId: "24",
      receiverId: "5",
      status: "accepted",
      timestamp: DateTime(2023, 11, 22, 14, 8, 53), // November 22, 2023
    ),
    ConnectionRequestModel(
      requestId: "122",
      senderId: "24",
      receiverId: "10",
      status: "accepted",
      timestamp: DateTime(2024, 1, 15, 11, 26, 39), // January 15, 2024
    ),
  ];
}
