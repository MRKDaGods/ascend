import 'package:ascend_app/features/networks/Mock%20Data/users.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_recieved_list_partial.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Repositories/user_repoistory.dart';
import 'package:ascend_app/features/networks/pages/connection_requests_page.dart';
import 'package:ascend_app/features/networks/pages/manage_my_network.dart';
import 'package:ascend_app/features/networks/model/follow_model.dart';

class Grow extends StatelessWidget {
  const Grow({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, connectionState) {
        return BlocBuilder<FollowBloc, FollowState>(
          builder: (context, followState) {
            if (connectionState is ConnectionRequestLoading ||
                followState is FollowLoading) {
              return Center(child: CircularProgressIndicator());
            } else if (connectionState is ConnectionRequestSuccess &&
                followState is FollowSuccess) {
              final invitationsSent =
                  connectionState.pendingRequestsSent.map((request) {
                    return getUser(request.receiverId);
                  }).toList();

              final invitationsReceived =
                  connectionState.pendingRequestsReceived.map((request) {
                    return getUser(request.senderId);
                  }).toList();

              final connections =
                  connectionState.acceptedConnections.map((request) {
                    return request.senderId == "1"
                        ? getUser(request.receiverId)
                        : getUser(request.senderId);
                  }).toList();

              final followedUsers =
                  followState.following
                      .map((followModel) => getUser(followModel.followingId))
                      .toList();

              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: ListTile(
                      title: Text(
                        'Invitations (${invitationsReceived.length})',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      trailing: Icon(Icons.arrow_forward),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) {
                              final bloc =
                                  BlocProvider.of<ConnectionRequestBloc>(
                                    context,
                                  );
                              return BlocProvider.value(
                                value: bloc,
                                child: ConnectionRequestsPage(
                                  invitationsSent: invitationsSent,
                                  invitationsReceived: invitationsReceived,
                                  pendingRequestsReceived:
                                      connectionState.pendingRequestsReceived,
                                  pendingRequestsSent:
                                      connectionState.pendingRequestsSent,
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
                    pendingRequestsReceived:
                        connectionState.pendingRequestsReceived,
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
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    trailing: Icon(Icons.arrow_forward),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder:
                              (_) => MultiBlocProvider(
                                providers: [
                                  BlocProvider.value(
                                    value:
                                        BlocProvider.of<ConnectionRequestBloc>(
                                          context,
                                        ),
                                  ),
                                  BlocProvider.value(
                                    value: BlocProvider.of<FollowBloc>(context),
                                  ),
                                ],
                                child: ManageMyNetwork(
                                  connections: connections,
                                  followed: followedUsers,
                                ),
                              ),
                        ),
                      );
                    },
                  ),
                ],
              );
            } else if (connectionState is ConnectionRequestError) {
              return Center(child: Text('Failed to load connection requests'));
            } else if (followState is FollowFailure) {
              return Center(child: Text('Failed to load followed users'));
            } else {
              return Container();
            }
          },
        );
      },
    );
  }
}
