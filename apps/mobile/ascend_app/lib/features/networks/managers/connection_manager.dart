import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/Mock%20Data/connections_request.dart';
import 'package:ascend_app/features/networks/Mock%20Data/users.dart';

List<UserModel> getSuggestedUsersforConnection(
  List<UserModel> connections,
  List<UserModel> sentconnectionRequests,
  List<UserModel> receivedconnectionRequests,
) {
  final allUsers = generateUsers();
  final unConnectedUsers =
      allUsers.where((user) {
        // Check if the user's ID is not in the connections or followedUsers lists
        final isConnected = connections.any(
          (connection) => connection.id == user.id || connection.id == "1",
        );
        final isRequested = sentconnectionRequests.any(
          (request) => request.id == user.id || request.id == "1",
        );
        final isReceived = receivedconnectionRequests.any(
          (request) => request.id == user.id || request.id == "1",
        );
        return !isConnected && !isRequested && !isReceived;
      }).toList();

  unConnectedUsers.removeWhere((element) => element.id == "1");
  unConnectedUsers.removeWhere((element) => element.firstFollow == true);
  /*print("Users to Connect:");
  for (var element in unConnectedUsers) {
    print(element.id);
  }*/
  return unConnectedUsers;
}

Map<String, List<UserModel>> getAllconnectionsforEachUser(
  List<ConnectionRequestModel> connectionRequests,
) {
  final Map<String, List<UserModel>> connectionsMap = {};

  for (var request in connectionRequests) {
    // Add receiverId to senderId's connection list
    if (connectionsMap.containsKey(request.senderId) &&
        request.status == "accepted") {
      connectionsMap[request.senderId]!.add(getUser(request.receiverId));
    } else if (request.status == "accepted") {
      connectionsMap[request.senderId] = [getUser(request.receiverId)];
    }

    // Add senderId to receiverId's connection list
    if (connectionsMap.containsKey(request.receiverId) &&
        request.status == "accepted") {
      connectionsMap[request.receiverId]!.add(getUser(request.senderId));
    } else if (request.status == "accepted") {
      connectionsMap[request.receiverId] = [getUser(request.senderId)];
    }
  }

  // Remove duplicates from each user's connection list
  connectionsMap.forEach((key, value) {
    connectionsMap[key] = value.toSet().toList();
  });

  //print("connectionsMap for all users");
  /*connectionsMap.forEach((key, value) {
    print("key: $key, value: ${value.map((e) => e.id)}");
  });*/
  return connectionsMap;
}

Map<String, List<UserModel>> getMutualConnectionsforeachUser(
  String userId,
  Map<String, List<UserModel>> connections,
) {
  final Map<String, List<UserModel>> mutualConnections = {};
  final myConnections = connections[userId] ?? [];
  for (var key in connections.keys) {
    if (key == userId) {
      continue;
    }
    final mutualUsers =
        connections[key]!.where((element) {
          return myConnections.any((connection) => connection.id == element.id);
        }).toList();

    if (mutualUsers.isNotEmpty) {
      mutualConnections[key] = mutualUsers;
    } else {
      mutualConnections[key] = [];
    }
  }
  /*print("mutualConnections for all users");
  mutualConnections.forEach((key, value) {
    print("key: $key, value: ${value.map((e) => e.id)}");
  });*/
  return mutualConnections;
}
