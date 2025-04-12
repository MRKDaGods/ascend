import 'package:ascend_app/features/networks/model/connected_user.dart';

import 'package:flutter/material.dart';

/// Builds the avatar stack based on the number of mutual users
List<Widget> buildAvatarStack(List<ConnectedUser> mutualUsers) {
  if (mutualUsers.isEmpty) {
    return [SizedBox.shrink()]; // No avatars if there are no mutual users
  } else if (mutualUsers.length == 1) {
    return [
      CircleAvatar(
        radius: 15,
        backgroundImage:
            mutualUsers[0].profile_image_id!.isNotEmpty
                ? NetworkImage(mutualUsers[0].profile_image_id!)
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
                mutualUsers[index].profile_image_id!.isNotEmpty
                    ? AssetImage(mutualUsers[index].profile_image_id!)
                    : const AssetImage('assets/placeholder.png'),
          ),
        );
      },
    );
  }
}

String buildMutualFollowText(
  List<ConnectedUser> mutualUsers,
  int numFollowers,
) {
  if (mutualUsers.isEmpty) {
    return "$numFollowers followers";
  } else if (mutualUsers.length == 1) {
    return "${mutualUsers[0].first_name} followed";
  } else if (mutualUsers.length == 2) {
    return "${mutualUsers[0].first_name} and ${mutualUsers[1].first_name} followed";
  } else {
    return "${mutualUsers[0].first_name}, ${mutualUsers[1].first_name} and ${mutualUsers.length - 2} others you know followed";
  }
}
