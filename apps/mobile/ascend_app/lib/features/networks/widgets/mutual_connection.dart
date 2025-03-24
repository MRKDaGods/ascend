import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/mutual_follow.dart';

class MutualConnections extends StatelessWidget {
  final List<UserModel> mutualUsers;
  final int numFollowers;

  const MutualConnections({
    Key? key,
    required this.mutualUsers,
    required this.numFollowers,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return IntrinsicWidth(
      child: SizedBox(
        height: 30,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              height: 30,
              width: mutualUsers.length > 0 ? 30 : 0,
              child: CircleAvatar(
                radius: 15,
                backgroundImage:
                    mutualUsers.length > 0
                        ? AssetImage(mutualUsers[0].profilePic)
                        : null,
              ),
            ),
            SizedBox(width: mutualUsers.length > 0 ? 5 : 0),
            Flexible(
              fit: FlexFit.loose,
              child: Text(
                _buildMutualConnecctionsText(mutualUsers),
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _buildMutualConnecctionsText(List<UserModel> mutualUsers) {
    if (mutualUsers.isEmpty) {
      return "$numFollowers Connections";
    } else if (mutualUsers.length == 1) {
      return "${mutualUsers[0].name} is a mutual connection";
    } else if (mutualUsers.length == 2) {
      return "${mutualUsers[0].name} and ${mutualUsers[1].name} are mutual connections";
    } else {
      return "${mutualUsers[0].name}, ${mutualUsers[1].name} and ${mutualUsers.length - 2} other mutual connection";
    }
  }
}
