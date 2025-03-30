import 'package:ascend_app/features/networks/model/follow_model.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/Mock%20Data/follow.dart';
import 'package:ascend_app/features/networks/Mock%20Data/users.dart';
import 'package:flutter/material.dart';

List<UserModel> getSuggestedUsersforFollow(
  List<UserModel> connections,
  List<UserModel> followedUsers,
  List<UserModel> sentconnectionRequests,
  List<UserModel> receivedconnectionRequests,
) {
  final allUsers = generateUsers();
  final unFollowedUsers =
      allUsers.where((user) {
        // Check if the user's ID is not in the connections or followedUsers lists
        final isConnected = connections.any(
          (connection) => connection.id == user.id || connection.id == "1",
        );
        final isFollowed = followedUsers.any(
          (followed) => followed.id == user.id || followed.id == "1",
        );
        final isRequested = sentconnectionRequests.any(
          (request) => request.id == user.id || request.id == "1",
        );
        final isReceived = receivedconnectionRequests.any(
          (request) => request.id == user.id || request.id == "1",
        );
        return !isConnected && !isFollowed && !isRequested && !isReceived;
      }).toList();

  unFollowedUsers.removeWhere((element) => element.id == "1");
  unFollowedUsers.removeWhere((element) => element.firstFollow == false);
  /*print("Users to Follow:");
  for (var element in unFollowedUsers) {
    print(element.id);
  }*/
  return unFollowedUsers;
}

Map<String, List<UserModel>> getallconnectionsforMutualFollow(
  List<UserModel> connections,
) {
  final Map<String, List<UserModel>> customConnections = {};
  final userstobeFollowed = generateFollowers();

  for (var user in userstobeFollowed) {
    final mutualUser =
        connections.where((connection) {
          return user.followerId == connection.id;
        }).toList();

    if (customConnections.containsKey(user.followingId)) {
      customConnections[user.followingId]!.addAll(mutualUser);
    } else {
      customConnections[user.followingId] = mutualUser;
    }
  }
  /*customConnections.forEach(
    (key, value) =>
        print("User: $key, Mutual Users: ${value.map((e) => e.id)}"),
  );*/
  return customConnections;
}

/// Builds the avatar stack based on the number of mutual users
List<Widget> buildAvatarStack(List<UserModel> mutualUsers) {
  if (mutualUsers.isEmpty) {
    return [SizedBox.shrink()]; // No avatars if there are no mutual users
  } else if (mutualUsers.length == 1) {
    return [
      CircleAvatar(
        radius: 15,
        backgroundImage:
            mutualUsers[0].profilePic.isNotEmpty
                ? AssetImage(mutualUsers[0].profilePic)
                : const AssetImage('assets/placeholder.png'),
      ),
    ];
  } else {
    return List.generate(
      mutualUsers.length > 2 ? 2 : mutualUsers.length, // Show up to 2 avatars
      (index) {
        return Positioned(
          left: index * 20.0, // Adjust spacing between avatars
          child: CircleAvatar(
            radius: 15,
            backgroundImage:
                mutualUsers[index].profilePic.isNotEmpty
                    ? AssetImage(mutualUsers[index].profilePic)
                    : const AssetImage('assets/placeholder.png'),
          ),
        );
      },
    );
  }
}

String buildMutualFollowText(List<UserModel> mutualUsers, int numFollowers) {
  if (mutualUsers.isEmpty) {
    return "$numFollowers followers";
  } else if (mutualUsers.length == 1) {
    return "${mutualUsers[0].name} followed";
  } else if (mutualUsers.length == 2) {
    return "${mutualUsers[0].name} and ${mutualUsers[1].name} followed";
  } else {
    return "${mutualUsers[0].name}, ${mutualUsers[1].name} and ${mutualUsers.length - 2} others you know followed";
  }
}
