import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_requests_sent.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_received_list_full.dart';
import 'package:ascend_app/features/networks/pages/invitations_settings_page.dart';
import 'package:ascend_app/features/networks/pages/network_invites_settings_page.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';

class ConnectionRequestsPage extends StatefulWidget {
  final List<UserPendingModel> sentUsers;
  final List<UserPendingModel> receivedUsers;

  const ConnectionRequestsPage({
    super.key,
    required this.sentUsers,
    required this.receivedUsers,
  });
  @override
  State<ConnectionRequestsPage> createState() => _ConnectionRequestsPageState();
}

class _ConnectionRequestsPageState extends State<ConnectionRequestsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

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
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() {
      setState(() {});
    });
    context.read<ConnectionRequestBloc>().add(FetchConnectionRequests());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        int receivedCount = 0;
        int sentCount = 0;

        if (state is ConnectionRequestSuccess) {
          receivedCount = state.pendingRequestsReceived.length;
          sentCount = state.pendingRequestsSent.length;
        }

        return Scaffold(
          appBar: AppBar(
            title: const Text(
              'Invitations',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            centerTitle: false,
            actions: [
              IconButton(
                icon: const Icon(Icons.settings),
                onPressed: () => _showSettingsModal(context),
              ),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(48),
              child: Align(
                alignment: Alignment.centerLeft,
                child: TabBar(
                  controller: _tabController,
                  isScrollable: false,
                  labelColor: Colors.green,
                  unselectedLabelColor: Colors.grey,
                  labelStyle: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  indicatorColor: Colors.green,
                  indicatorWeight: 3,
                  indicatorSize: TabBarIndicatorSize.label,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  tabs: [
                    Tab(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Received'),
                          if (receivedCount > 0)
                            Container(
                              margin: const EdgeInsets.only(left: 8),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.green,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                '$receivedCount',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    Tab(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Sent'),
                          if (sentCount > 0)
                            Container(
                              margin: const EdgeInsets.only(left: 8),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.green,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                '$sentCount',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          body: TabBarView(
            controller: _tabController,
            children: [
              // Received Tab
              _buildReceivedTab(state),
              // Sent Tab
              _buildSentTab(state),
            ],
          ),
        );
      },
    );
  }

  Widget _buildReceivedTab(ConnectionRequestState state) {
    if (state is ConnectionRequestLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is ConnectionRequestSuccess) {
      return state.pendingRequestsReceived.isNotEmpty
          ? ConnectionRequestsReceivedListFull(
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
          : const Center(
            child: Text(
              'No invitations here',
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
            ),
          );
    } else if (state is ConnectionRequestError) {
      return Center(child: Text('Error: ${state.toString()}'));
    } else {
      return const Center(child: Text('No data available.'));
    }
  }

  Widget _buildSentTab(ConnectionRequestState state) {
    if (state is ConnectionRequestLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is ConnectionRequestSuccess) {
      return state.pendingRequestsSent.isNotEmpty
          ? ConnectionRequestsSent(
            onRemove: (requestId) {
              context.read<ConnectionRequestBloc>().add(
                CancelConnectionRequest(requestId: requestId),
              );
            },
          )
          : const Center(
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
  }
}
