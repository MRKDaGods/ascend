import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/utils/helper_functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/utils/overlay_builder.dart';
import 'package:ascend_app/features/networks/widgets/selection_buttons.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';

class ConnectionRequestsReceivedListPartial extends StatelessWidget {
  final List<UserPendingModel> pendingRequestsReceived;
  final Function(String) onAccept;
  final Function(String) onDecline;

  const ConnectionRequestsReceivedListPartial({
    super.key,
    required this.pendingRequestsReceived,
    required this.onAccept,
    required this.onDecline,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (pendingRequestsReceived.isEmpty)
          const SizedBox(height: 20)
        else
          Column(
            children:
                pendingRequestsReceived
                    .sublist(
                      0,
                      pendingRequestsReceived.length > 2
                          ? 2
                          : pendingRequestsReceived.length,
                    )
                    .map((invitation) {
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
                                      invitation.profile_image_id!.startsWith(
                                            'http',
                                          )
                                          ? NetworkImage(
                                            invitation.profile_image_id!,
                                          )
                                          : AssetImage(
                                                invitation.profile_image_id!,
                                              )
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
                    })
                    .toList(),
          ),
      ],
    );
  }
}
