import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_requests_sent.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_received_list_full.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/pages/invitations_settings_page.dart';
import 'package:ascend_app/features/networks/pages/network_invites_settings_page.dart';

class ConnectionRequestsPage extends StatefulWidget {
  final List<UserModel> invitationsReceived;
  final List<UserModel> invitationsSent;
  final List<ConnectionRequestModel> pendingRequestsReceived;
  final List<ConnectionRequestModel> pendingRequestsSent;

  const ConnectionRequestsPage({
    super.key,
    required this.invitationsReceived,
    required this.invitationsSent,
    required this.pendingRequestsReceived,
    required this.pendingRequestsSent,
  });
  @override
  _ConnectionRequestsPageState createState() => _ConnectionRequestsPageState();
}

class _ConnectionRequestsPageState extends State<ConnectionRequestsPage> {
  int _selectedIndex = 0;
  bool isReceivedSelected = true;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _showSettingsModal(BuildContext context) {
    showModalBottomSheet(
      context: context,

      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Drag Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Title
              const Text(
                "Invitation settings",
                style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              // Option 1
              ListTile(
                contentPadding: EdgeInsets.zero,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => InvitationsSettingsPage(),
                    ),
                  );
                },
                title: const Text(
                  "Choose who can Connect with you",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
              ),
              // Option 2
              ListTile(
                contentPadding: EdgeInsets.zero,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => NetworkInvitesSettingsPage(),
                    ),
                  );
                },
                title: const Text(
                  "Choose What invitations to receive",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                subtitle: const Text(
                  "Events, Newsletters, Pages and more",
                  style: TextStyle(
                    color: Color.fromARGB(255, 147, 143, 143),
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: ClipRRect(
          borderRadius: BorderRadius.circular(
            20,
          ), // Rounded corners for the clipping effect
          child: Container(
            color: Colors.grey[200], // Background color for the tab container
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Received Tab
                GestureDetector(
                  onTap: () {
                    setState(() {
                      isReceivedSelected = true;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color:
                          isReceivedSelected
                              ? Colors.green
                              : Colors.transparent,
                    ),
                    child: Text(
                      "Received",
                      style: TextStyle(
                        color: isReceivedSelected ? Colors.white : Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                // Sent Tab
                GestureDetector(
                  onTap: () {
                    setState(() {
                      isReceivedSelected = false;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color:
                          isReceivedSelected
                              ? Colors.transparent
                              : Colors.green,
                    ),
                    child: Text(
                      "Sent",
                      style: TextStyle(
                        color: isReceivedSelected ? Colors.black : Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () => _showSettingsModal(context),
          ),
        ],
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1),
        ),
      ),

      body: BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
        builder: (context, state) {
          if (state is ConnectionRequestLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ConnectionRequestSuccess) {
            return isReceivedSelected
                ? state.pendingRequestsReceived.isNotEmpty
                    ? ConnectionRequestsReceivedListFull(
                      invitations: widget.invitationsReceived,
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
                    )
                    : Center(
                      child: Text(
                        'No invitations here',
                        style: TextStyle(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    )
                : state.pendingRequestsSent.isNotEmpty
                ? ConnectionRequestsSent(
                  invitations: widget.invitationsSent,
                  pendingRequestsSent: state.pendingRequestsSent,
                  onRemove: (requestId) {
                    context.read<ConnectionRequestBloc>().add(
                      CancelConnectionRequest(requestId: requestId),
                    );
                  },
                )
                : Center(
                  child: Text(
                    'No Sent Invitations',
                    style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                  ),
                );
          } else if (state is ConnectionRequestError) {
            return Center(child: Text('Error: ${state.toString()}'));
          } else {
            return const Center(child: Text('No data available.'));
          }
        },
      ),
    );
  }
}
