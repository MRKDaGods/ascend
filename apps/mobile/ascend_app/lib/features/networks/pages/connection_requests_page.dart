import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_requests_sent.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_received_list_full.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';

class ConnectionRequestsPage extends StatelessWidget {
  final List<UserModel> invitationsReceived;
  final List<UserModel> invitationsSent;
  final List<ConnectionRequestModel> pendingRequestsReceived;
  final List<ConnectionRequestModel> pendingRequestsSent;

  const ConnectionRequestsPage({
    Key? key,
    required this.invitationsReceived,
    required this.invitationsSent,
    required this.pendingRequestsReceived,
    required this.pendingRequestsSent,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Connection Requests'),
          bottom: const TabBar(
            tabs: [Tab(text: 'Received'), Tab(text: 'Sent')],
          ),
        ),
        body: BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
          builder: (context, state) {
            if (state is ConnectionRequestLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is ConnectionRequestSuccess) {
              return TabBarView(
                children: [
                  ConnectionRequestsReceivedListFull(
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
                  ConnectionRequestsSent(
                    invitations: invitationsSent,
                    pendingRequestsSent: state.pendingRequestsSent,
                    onRemove: (requestId) {
                      context.read<ConnectionRequestBloc>().add(
                        CancelConnectionRequest(requestId: requestId),
                      );
                    },
                  ),
                ],
              );
            } else if (state is ConnectionRequestError) {
              return Center(child: Text('Error: ${state.toString()}'));
            } else {
              return const Center(child: Text('No data available.'));
            }
          },
        ),
      ),
    );
  }
}
