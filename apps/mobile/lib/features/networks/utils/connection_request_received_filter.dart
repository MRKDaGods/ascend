import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/widgets/selection_buttons.dart';
import 'package:ascend_app/features/networks/utils/enums.dart';
import 'package:ascend_app/features/networks/utils/helper_functions.dart';
import 'package:ascend_app/features/networks/widgets/mutual_connection.dart'; // Add this import

Widget buildReceived(
  List<UserPendingModel> pendingRequestsReceived,
  ConnectionRequestReceivedFilterMode selection,
  Function(String) onAccept,
  Function(String) onDecline,
) {
  Widget buildUserCard(UserPendingModel invitation) {
    return Column(
      children: [
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile Picture
              CircleAvatar(
                radius: 24,
                backgroundImage:
                    invitation.profile_picture_url != null
                        ? NetworkImage(invitation.profile_picture_url!)
                        : AssetImage('assets/EmptyUser.png') as ImageProvider,
              ),
              const SizedBox(width: 12), // Spacing between avatar and text
              // Name, Bio and Mutual Connections
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
                      invitation.bio ?? 'No bio available',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      timeDifference(invitation.created_at!),
                      style: const TextStyle(color: Colors.grey, fontSize: 10),
                    ),

                    // Add Mutual Connections widget right here - after timestamp
                    if (invitation.connected_users != null &&
                        invitation.connected_users!.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: MutualConnections(
                          mutualUsers: invitation.connected_users!,
                          numConnections: invitation.connected_users_count ?? 0,
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 8), // Spacing between text and icons
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
  }

  switch (selection) {
    case ConnectionRequestReceivedFilterMode.all:
      return Expanded(
        child:
            pendingRequestsReceived.isEmpty
                ? Center(
                  child: Text(
                    'No pending requests',
                    style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                  ),
                )
                : ListView.builder(
                  itemCount: pendingRequestsReceived.length,
                  itemBuilder: (context, index) {
                    return buildUserCard(pendingRequestsReceived[index]);
                  },
                ),
      );

    case ConnectionRequestReceivedFilterMode.newsletter:
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

    case ConnectionRequestReceivedFilterMode.people:
      return Expanded(
        child:
            pendingRequestsReceived.isEmpty
                ? Center(
                  child: Text(
                    'No people requests',
                    style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                  ),
                )
                : ListView.builder(
                  itemCount: pendingRequestsReceived.length,
                  itemBuilder: (context, index) {
                    return buildUserCard(pendingRequestsReceived[index]);
                  },
                ),
      );
  }
}
