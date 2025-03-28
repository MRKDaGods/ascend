import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/utils/overlay_builder.dart';
import 'package:ascend_app/features/networks/widgets/selection_buttons.dart';

class ConnectionRequestsReceivedListPartial extends StatelessWidget {
  final List<UserModel> invitations;
  final List<ConnectionRequestModel> pendingRequestsReceived;
  final Function(String) onAccept;
  final Function(String) onDecline;

  const ConnectionRequestsReceivedListPartial({
    super.key,
    required this.invitations,
    required this.pendingRequestsReceived,
    required this.onAccept,
    required this.onDecline,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (invitations.isEmpty)
          const SizedBox(height: 20)
        else
          Column(
            children:
                invitations
                    .sublist(0, invitations.length > 2 ? 2 : invitations.length)
                    .map((invitation) {
                      final connectionRequest = pendingRequestsReceived
                          .firstWhere(
                            (element) => element.senderId == invitation.id,
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
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                vertical: 8.0,
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Profile Picture
                                  CircleAvatar(
                                    radius: 24,
                                    backgroundImage:
                                        invitation.profilePic.startsWith('http')
                                            ? NetworkImage(
                                              invitation.profilePic,
                                            )
                                            : AssetImage(invitation.profilePic)
                                                as ImageProvider,
                                  ),
                                  const SizedBox(
                                    width: 12,
                                  ), // Spacing between avatar and text
                                  // Name and Bio
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
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
                    })
                    .toList(),
          ),
      ],
    );
  }
}
