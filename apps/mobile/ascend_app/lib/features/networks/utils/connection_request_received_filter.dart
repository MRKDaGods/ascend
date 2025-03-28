import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/widgets/selection_buttons.dart';
import 'package:ascend_app/features/networks/utils/enums.dart';

Widget buildReceived(
  List<UserModel> allUsers,
  List<ConnectionRequestModel> pendingRequestsReceived,
  ConnectionRequestReceivedFilterMode selection,
  Function(String) onAccept,
  Function(String) onDecline,
) {
  switch (selection) {
    case ConnectionRequestReceivedFilterMode.All:
      return Expanded(
        child: ListView.builder(
          itemCount: allUsers.length,
          itemBuilder: (context, index) {
            final invitation = allUsers[index];
            final connectionRequest = pendingRequestsReceived.firstWhere(
              (element) => element.senderId == invitation.id,
              orElse:
                  () => ConnectionRequestModel(
                    requestId: '',
                    senderId: '',
                    receiverId: '',
                    status: '',
                    timestamp: '',
                  ),
            );

            if (connectionRequest.requestId != '') {
              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Profile Picture
                        CircleAvatar(
                          radius: 24,
                          backgroundImage:
                              invitation.profilePic.startsWith('http')
                                  ? NetworkImage(invitation.profilePic)
                                  : AssetImage(invitation.profilePic)
                                      as ImageProvider,
                        ),
                        const SizedBox(
                          width: 12,
                        ), // Spacing between avatar and text
                        // Name and Bio
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                invitation.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                invitation.bio,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                connectionRequest.timestamp,
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(
                          width: 8,
                        ), // Spacing between text and icons
                        // Action Icons
                        SelectionButtons(
                          onAccept: onAccept,
                          onDecline: onDecline,
                          connectionRequest: connectionRequest,
                        ),
                      ],
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
      break;
    case ConnectionRequestReceivedFilterMode.Newsletter:
      return Center(
        child: Text(
          'No Newsletters',
          style: TextStyle(
            fontSize: 30,
            fontWeight: FontWeight.bold,
            color: Colors.grey,
          ),
        ),
      );
      break;

    case ConnectionRequestReceivedFilterMode.People:
      return Expanded(
        child: ListView.builder(
          itemCount: allUsers.length,
          itemBuilder: (context, index) {
            final invitation = allUsers[index];
            final connectionRequest = pendingRequestsReceived.firstWhere(
              (element) => element.senderId == invitation.id,
              orElse:
                  () => ConnectionRequestModel(
                    requestId: '',
                    senderId: '',
                    receiverId: '',
                    status: '',
                    timestamp: '',
                  ),
            );

            if (connectionRequest.requestId != '') {
              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Profile Picture
                        CircleAvatar(
                          radius: 24,
                          backgroundImage:
                              invitation.profilePic.startsWith('http')
                                  ? NetworkImage(invitation.profilePic)
                                  : AssetImage(invitation.profilePic)
                                      as ImageProvider,
                        ),
                        const SizedBox(
                          width: 12,
                        ), // Spacing between avatar and text
                        // Name and Bio
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                invitation.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                invitation.bio,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                connectionRequest.timestamp,
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(
                          width: 8,
                        ), // Spacing between text and icons
                        // Action Icons
                        SelectionButtons(
                          onAccept: onAccept,
                          onDecline: onDecline,
                          connectionRequest: connectionRequest,
                        ),
                      ],
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
      break;
    default:
      return SizedBox.shrink();
  }
}
