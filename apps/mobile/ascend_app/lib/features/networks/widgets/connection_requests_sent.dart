import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';

class ConnectionRequestsSent extends StatelessWidget {
  final List<UserModel> invitations;
  final List<ConnectionRequestModel> pendingRequestsSent;
  final Function(String) onRemove;

  const ConnectionRequestsSent({
    Key? key,
    required this.invitations,
    required this.pendingRequestsSent,
    required this.onRemove,
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
                    'All (${state.pendingRequestsSent.length})',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  // trailing: Icon(Icons.arrow_forward),
                ),
              ),
              if (invitations.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text('No invitations sent'),
                ),
              Column(
                children:
                    invitations.map((invitation) {
                      final connectionRequest = state.pendingRequestsSent
                          .firstWhere(
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
                          trailing: TextButton(
                            onPressed:
                                () => onRemove(connectionRequest.requestId),
                            child: Text('WITHDRAW'),
                          ),
                        );
                      } else {
                        return SizedBox.shrink();
                      }
                    }).toList(),
              ),
            ],
          );
        } else {
          return Center(child: CircularProgressIndicator());
        }
      },
    );
  }
}
