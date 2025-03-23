import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';

class MutualFollow extends StatelessWidget {
  final List<UserModel> mutualUsers;
  final int numFollowers;

  const MutualFollow({
    Key? key,
    required this.mutualUsers,
    required this.numFollowers,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return IntrinsicWidth(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            height: 30,
            width: mutualUsers.length > 1 ? 50 : 30,
            child: Stack(
              clipBehavior: Clip.none,
              children: _buildAvatarStack(mutualUsers),
            ),
          ),
          SizedBox(width: mutualUsers.length > 0 ? 5 : 0),
          Flexible(
            fit: FlexFit.loose,
            child: Text(
              _buildMutualFollowText(mutualUsers),
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  String _buildMutualFollowText(List<UserModel> mutualUsers) {
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
}

/// Builds the avatar stack based on the number of mutual users
List<Widget> _buildAvatarStack(List<UserModel> mutualUsers) {
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
