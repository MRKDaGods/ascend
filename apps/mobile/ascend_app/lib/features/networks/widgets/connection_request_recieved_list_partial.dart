import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:flutter/material.dart';

class ConnectionRequestsReceivedListPartial extends StatelessWidget {
  final List<UserModel> invitations;
  final List<ConnectionRequestModel> pendingRequestsReceived;
  final Function(String) onAccept;
  final Function(String) onDecline;

  const ConnectionRequestsReceivedListPartial({
    Key? key,
    required this.invitations,
    required this.pendingRequestsReceived,
    required this.onAccept,
    required this.onDecline,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (invitations.isEmpty)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text('No invitations received'),
          ),
        Column(
          children:
              invitations
                  .sublist(0, invitations.length > 2 ? 2 : invitations.length)
                  .map((invitation) {
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundImage:
                            invitation.profilePic.startsWith('http')
                                ? NetworkImage(invitation.profilePic)
                                : AssetImage(invitation.profilePic)
                                    as ImageProvider,
                      ),

                      title: Text(invitation.name),
                      subtitle: Text(invitation.bio),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: Icon(Icons.check, color: Colors.green),
                            onPressed:
                                () => onAccept(
                                  pendingRequestsReceived
                                      .firstWhere(
                                        (element) =>
                                            element.senderId == invitation.id,
                                      )
                                      .requestId,
                                ),
                          ),
                          IconButton(
                            icon: Icon(Icons.close, color: Colors.red),
                            onPressed:
                                () => onDecline(
                                  pendingRequestsReceived
                                      .firstWhere(
                                        (element) =>
                                            element.senderId == invitation.id,
                                      )
                                      .requestId,
                                ),
                          ),
                        ],
                      ),
                    );
                  })
                  .toList(),
        ),
      ],
    );
  }
}
