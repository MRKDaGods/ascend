import 'package:ascend_app/features/networks/Mock%20Data/users.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_recieved_list_partial.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Repositories/user_repoistory.dart';
import 'package:ascend_app/features/networks/pages/connection_requests_page.dart';

class Grow extends StatelessWidget {
  const Grow({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        print(state);
        if (state is ConnectionRequestLoading) {
          return Center(child: CircularProgressIndicator());
        } else if (state is ConnectionRequestSuccess) {
          print("state: ${state.pendingRequestsSent.length}");
          print("state: ${state.pendingRequestsReceived.length}");
          print("state: ${state.acceptedConnections.length}");
          final invitationsSent =
              state.pendingRequestsSent.map((request) {
                print(request.receiverId);
                // Assuming you have a method to get UserModel by id
                return getUser(request.receiverId);
              }).toList();

          final invitationsReceived =
              state.pendingRequestsReceived.map((request) {
                // Assuming you have a method to get UserModel by id
                print(request.senderId);
                return getUser(request.senderId);
              }).toList();

          final connections =
              state.acceptedConnections.map((request) {
                // Assuming you have a method to get UserModel by id
                return request.senderId == "1"
                    ? getUser(request.receiverId)
                    : getUser(request.senderId);
              }).toList();

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ListTile(
                  title: Text(
                    'Invitations (${invitationsReceived.length})',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  trailing: Icon(Icons.arrow_forward),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) {
                          final bloc = BlocProvider.of<ConnectionRequestBloc>(
                            context,
                          );
                          print('Bloc in Grow widget: $bloc');
                          return BlocProvider.value(
                            value: bloc,
                            child: ConnectionRequestsPage(
                              invitationsSent: invitationsSent,
                              invitationsReceived: invitationsReceived,
                              pendingRequestsReceived:
                                  state.pendingRequestsReceived,
                              pendingRequestsSent: state.pendingRequestsSent,
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
              ),
              ConnectionRequestsReceivedListPartial(
                invitations: invitationsReceived,
                pendingRequestsReceived: state.pendingRequestsReceived,
                onAccept: (requestId) {
                  context.read<ConnectionRequestBloc>().add(
                    AcceptConnectionRequest(requestId: requestId),
                  );
                },
                onDecline: (requestId) {
                  context.read<ConnectionRequestBloc>().add(
                    DeclineConnectionRequest(requestId: requestId),
                  );
                },
              ),
              ListTile(
                title: Text(
                  'Manage your network',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                trailing: Icon(Icons.arrow_forward),
                onTap: () {},
              ),
            ],
          );
        } else if (state is ConnectionRequestError) {
          return Center(child: Text('Failed to load connection requests'));
        } else {
          return Container();
        }
      },
    );
  }
}
