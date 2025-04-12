import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/widgets/mutual_follow.dart';

class MutualConnections extends StatelessWidget {
  final List<ConnectedUser> mutualUsers;
  final int numConnections;

  const MutualConnections({
    super.key,
    required this.mutualUsers,
    required this.numConnections,
  });

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
              width: mutualUsers.isNotEmpty ? 30 : 0,
              child: CircleAvatar(
                radius: 15,
                backgroundImage:
                    mutualUsers.isNotEmpty
                        ? NetworkImage(mutualUsers[0].profile_image_id!)
                        : AssetImage('assets/EmptyUser.png') as ImageProvider,
              ),
            ),
            SizedBox(width: mutualUsers.isNotEmpty ? 5 : 0),
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

  String _buildMutualConnecctionsText(List<ConnectedUser> mutualUsers) {
    if (mutualUsers.isEmpty) {
      return "$numConnections Connections";
    } else if (mutualUsers.length == 1) {
      return "${mutualUsers[0].first_name} is a mutual connection";
    } else if (mutualUsers.length == 2) {
      return "${mutualUsers[0].first_name} and ${mutualUsers[1].first_name} are mutual connections";
    } else {
      return "${mutualUsers[0].first_name}, ${mutualUsers[1].first_name} and ${mutualUsers.length - 2} other mutual connection";
    }
  }
}
