import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/utils/enums.dart';

Widget buildSent(
  List<UserModel> allUsers,
  List<ConnectionRequestModel> pendingConnectionRequests,
  Function(String) onRemove,
  ConnectionRequestSentFilterMode filterMode,
) {
  switch (filterMode) {
    case ConnectionRequestSentFilterMode.People:
      return Expanded(
        child: ListView.builder(
          itemCount: allUsers.length,
          itemBuilder: (context, index) {
            final invitation = allUsers[index];
            final connectionRequest = pendingConnectionRequests.firstWhere(
              (element) => element.receiverId == invitation.id,
              orElse:
                  () => ConnectionRequestModel(
                    requestId: '',
                    senderId: '',
                    receiverId: '',
                    timestamp: DateTime.now().toIso8601String(),
                    status: '',
                  ),
            );

            if (connectionRequest.requestId != '') {
              return Column(
                children: [
                  ListTile(
                    leading: CircleAvatar(
                      backgroundImage:
                          invitation.profilePic.startsWith('http')
                              ? NetworkImage(invitation.profilePic)
                              : AssetImage(invitation.profilePic)
                                  as ImageProvider,
                    ),
                    title: Text(invitation.name),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          invitation.bio,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          connectionRequest.timestamp,
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                    trailing: TextButton(
                      onPressed: () => onRemove(connectionRequest.requestId),
                      child: const Text('Withdraw'),
                    ),
                  ),
                  const Divider(thickness: 3, height: 16),
                ],
              );
            } else {
              return const SizedBox.shrink();
            }
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
