import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/managers/follow_manager.dart';

class MutualFollow extends StatelessWidget {
  final List<UserModel> mutualUsers;
  final int numFollowers;

  const MutualFollow({
    super.key,
    required this.mutualUsers,
    required this.numFollowers,
  });

  @override
  Widget build(BuildContext context) {
    return IntrinsicWidth(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            height: 30,
            width:
                mutualUsers.length > 1
                    ? 50
                    : mutualUsers.isNotEmpty
                    ? 30
                    : 0,
            child: Stack(
              clipBehavior: Clip.none,
              children: buildAvatarStack(mutualUsers),
            ),
          ),
          SizedBox(width: mutualUsers.isNotEmpty ? 5 : 0),
          Flexible(
            fit: FlexFit.loose,
            child: Text(
              buildMutualFollowText(mutualUsers, numFollowers),
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
