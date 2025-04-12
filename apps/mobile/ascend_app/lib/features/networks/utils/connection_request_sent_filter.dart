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
    case ConnectionRequestSentFilterMode.People:
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
                        invitation.profile_image_id!.startsWith('http')
                            ? NetworkImage(invitation.profile_image_id!)
                            : AssetImage(invitation.profile_image_id!)
                                as ImageProvider,
                  ),
                  title: Text(
                    '${invitation.first_name} ${invitation.last_name}',
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        invitation.bio!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 12,
                        ),
                      ),
                      Text(
                        timeDifference(invitation.requestedAt!),
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                  trailing: TextButton(
                    onPressed: () => onRemove(invitation.request_id!),
                    child: const Text('Withdraw'),
                  ),
                ),
                const Divider(thickness: 3, height: 16),
              ],
            );
          },
        ),
      );
    case ConnectionRequestSentFilterMode.Pages:
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
    case ConnectionRequestSentFilterMode.Events:
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

    default:
      return const SizedBox.shrink();
  }
}
