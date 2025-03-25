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
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              if (invitations.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text('No invitations sent'),
                ),
              Expanded(
                child: ListView.builder(
                  itemCount: invitations.length,
                  itemBuilder: (context, index) {
                    final invitation = invitations[index];
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
                          onPressed:
                              () => onRemove(connectionRequest.requestId),
                          child: const Text('Withdraw'),
                        ),
                      );
                    } else {
                      return const SizedBox.shrink();
                    }
                  },
                ),
              ),
            ],
          );
        } else {
          return const Center(child: CircularProgressIndicator());
        }
      },
    );
  }
}
