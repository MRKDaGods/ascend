import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';

class ConnectionRequestsReceivedListFull extends StatelessWidget {
  final List<UserModel> invitations;
  final List<ConnectionRequestModel> pendingRequestsReceived;
  final Function(String) onAccept;
  final Function(String) onDecline;

  const ConnectionRequestsReceivedListFull({
    Key? key,
    required this.invitations,
    required this.pendingRequestsReceived,
    required this.onAccept,
    required this.onDecline,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        if (state is ConnectionRequestSuccess) {
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ListTile(
                  title: Text(
                    'Invitations (${state.pendingRequestsReceived.length})',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              if (invitations.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text('No invitations received'),
                ),
              Column(
                children:
                    invitations.map((invitation) {
                      final connectionRequest = pendingRequestsReceived
                          .firstWhere(
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

                      if (connectionRequest.requestId.isNotEmpty) {
                        return ListTile(
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
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 12,
                                ),
                              ),
                              Text(
                                'Sent ${connectionRequest.timestamp}',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: Icon(Icons.check, color: Colors.green),
                                onPressed:
                                    () => onAccept(connectionRequest.requestId),
                              ),
                              IconButton(
                                icon: Icon(Icons.close, color: Colors.red),
                                onPressed:
                                    () =>
                                        onDecline(connectionRequest.requestId),
                              ),
                            ],
                          ),
                        );
                      } else {
                        return SizedBox.shrink(); // Fix for null return issue
                      }
                    }).toList(), // Fix for null filtering
              ),
            ],
          );
        } else {
          return SizedBox.shrink();
        }
      },
    );
  }
}
