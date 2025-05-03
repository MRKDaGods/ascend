import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/utils/enums.dart';
import 'package:ascend_app/features/networks/utils/helper_functions.dart';

Widget buildSent(
  List<UserPendingModel> pendingConnectionRequests,
  Function(String) onRemove,
  ConnectionRequestSentFilterMode filterMode,
) {
  switch (filterMode) {
    case ConnectionRequestSentFilterMode.people:
      return Expanded(
        child: ListView.builder(
          itemCount: pendingConnectionRequests.length,
          itemBuilder: (context, index) {
            final invitation = pendingConnectionRequests[index];
            return Column(
              children: [
                ListTile(
                  leading: CircleAvatar(
                    backgroundImage:
                        invitation.profile_image_id != null
                            ? NetworkImage(invitation.profile_image_id!)
                            : AssetImage('assets/EmptyUser.png')
                                as ImageProvider,
                  ),
                  title: Text(
                    '${invitation.first_name} ${invitation.last_name}',
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        invitation.bio ?? 'No bio available',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 12,
                        ),
                      ),
                      Text(
                        timeDifference(invitation.created_at!),
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                  trailing: TextButton(
                    onPressed: () => onRemove(invitation.id!),
                    child: const Text('Withdraw'),
                  ),
                ),
                const Divider(thickness: 3, height: 16),
              ],
            );
          },
        ),
      );
    case ConnectionRequestSentFilterMode.pages:
      return Center(
        child: Text(
          'No Invitations Sent',
          style: TextStyle(
            fontSize: 25,
            color: Colors.grey,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    case ConnectionRequestSentFilterMode.events:
      return Center(
        child: Text(
          'No Invitations Sent',
          style: TextStyle(
            fontSize: 25,
            color: Colors.grey,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
  }
}
