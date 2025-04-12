import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/widgets/selection_buttons.dart';
import 'package:ascend_app/features/networks/utils/enums.dart';
import 'package:ascend_app/features/networks/utils/helper_functions.dart';

Widget buildReceived(
  List<UserPendingModel> pendingRequestsReceived,
  ConnectionRequestReceivedFilterMode selection,
  Function(String) onAccept,
  Function(String) onDecline,
) {
  switch (selection) {
    case ConnectionRequestReceivedFilterMode.All:
      return Expanded(
        child: ListView.builder(
          itemCount: pendingRequestsReceived.length,
          itemBuilder: (context, index) {
            final invitation = pendingRequestsReceived[index];
            if (invitation is UserPendingModel) {
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
                              invitation.profile_image_id!.startsWith('http')
                                  ? NetworkImage(invitation.profile_image_id!)
                                  : AssetImage(invitation.profile_image_id!)
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
                                '${invitation.first_name} ${invitation.last_name}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                invitation.bio!,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                timeDifference(invitation.requestedAt!),
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
                          userpending: invitation,
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
          itemCount: pendingRequestsReceived.length,
          itemBuilder: (context, index) {
            final invitation = pendingRequestsReceived[index];
            if (invitation is UserPendingModel) {
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
                              invitation.profile_image_id!.startsWith('http')
                                  ? NetworkImage(invitation.profile_image_id!)
                                  : AssetImage(invitation.profile_image_id!)
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
                                '${invitation.first_name} ${invitation.last_name}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                invitation.bio!,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                timeDifference(invitation.requestedAt!),
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
                          userpending: invitation,
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
