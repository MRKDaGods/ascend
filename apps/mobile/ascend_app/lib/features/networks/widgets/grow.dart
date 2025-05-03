import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/networks/bloc/bloc/blocked/bloc/block_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/messaging_requests/bloc/messaging_requests_bloc.dart';
import 'package:ascend_app/features/networks/widgets/people_to_follow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_recieved_list_partial.dart';
import 'package:ascend_app/features/networks/pages/connection_requests_page.dart';
import 'package:ascend_app/features/networks/pages/manage_my_network.dart';
import 'package:ascend_app/features/networks/pages/recommended_to_follow.dart';
import 'package:ascend_app/features/networks/widgets/connection_suggestions.dart';
import 'package:ascend_app/features/networks/pages/suggested_connections_page.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_preferences/bloc/connection_preferences_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';

class Grow extends StatefulWidget {
  const Grow({super.key});

  @override
  State<Grow> createState() => _GrowState();
}

class _GrowState extends State<Grow> {
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController(); // Initialize the ScrollController

    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Check current auth state
      final authState = context.read<AuthBloc>().state;

      debugPrint('[Grow] Current auth state: ${authState.runtimeType}');

      if (authState is AuthSuccess) {
        debugPrint('[Grow] User is authenticated, fetching connection data');
        context.read<ConnectionRequestBloc>().add(FetchConnectionRequests());
        context.read<FollowBloc>().add(FetchFollowing());
        context.read<BlockBloc>().add(FetchBlockedUsersEvent());
        context.read<MessagingRequestsBloc>().add(
          FetchReceivedMessagingRequests(),
        );
      } else {
        debugPrint('[Grow] User not authenticated, cannot fetch data');
      }
    });
  }

  @override
  void dispose() {
    _scrollController
        .dispose(); // Dispose of the ScrollController to prevent memory leaks
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthBloc>().state;
    debugPrint('[Grow] Current auth state: ${authState.runtimeType}');
    if (authState is AuthSuccess) {
      debugPrint('[Grow] User is authenticated, building UI');
    } else {
      debugPrint('[Grow] User not authenticated, showing empty container');
      return const SizedBox.shrink(); // Return an empty widget if not authenticated
    }
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, connectionState) {
        return BlocBuilder<FollowBloc, FollowState>(
          builder: (context, followState) {
            if (connectionState is ConnectionRequestLoading ||
                followState is FollowLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (connectionState is ConnectionRequestSuccess &&
                followState is FollowSuccess) {
              final invitationsReceived =
                  connectionState.pendingRequestsReceived;
              final connections = connectionState.acceptedConnections;
              final invitationsSent = connectionState.pendingRequestsSent;
              final suggestedUserstoConnect =
                  connectionState.suggestedToConnect;
              final followedUsers = followState.following;

              return SingleChildScrollView(
                controller: _scrollController, // Add scroll controller
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Invitations Section
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(
                          invitationsReceived.isNotEmpty
                              ? 'Invitations (${invitationsReceived.length})'
                              : 'Invitations',
                          style: const TextStyle(
                            fontSize: 25,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        trailing: const Icon(Icons.arrow_forward),
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
                                    sentUsers: invitationsSent,
                                    receivedUsers: invitationsReceived,
                                  ),
                                );
                              },
                            ),
                          );
                        },
                      ),
                      const Divider(thickness: 3, height: 0),
                      ConnectionRequestsReceivedListPartial(
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
                      if (invitationsReceived.isNotEmpty)
                        const SizedBox(height: 20),
                      const Divider(thickness: 3, height: 0),
                      // Manage Your Network Section
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text(
                          'Manage your network',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        trailing: const Icon(Icons.arrow_forward),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder:
                                  (_) => MultiBlocProvider(
                                    providers: [
                                      BlocProvider.value(
                                        value: BlocProvider.of<
                                          ConnectionRequestBloc
                                        >(context),
                                      ),
                                      BlocProvider.value(
                                        value: BlocProvider.of<FollowBloc>(
                                          context,
                                        ),
                                      ),

                                      BlocProvider.value(
                                        value: BlocProvider.of<
                                          ConnectionPreferencesBloc
                                        >(context),
                                      ),
                                      BlocProvider.value(
                                        value: BlocProvider.of<BlockBloc>(
                                          context,
                                        ),
                                      ),
                                      // Add missing MessagingRequestsBloc provider
                                      BlocProvider.value(
                                        value: BlocProvider.of<
                                          MessagingRequestsBloc
                                        >(context),
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
                      const Divider(thickness: 3, height: 0),
                      SizedBox(height: 20),
                      const Divider(thickness: 3, height: 0),
                      // People to Follow Section
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 4),
                            child: Text(
                              'People to follow based on your activity',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 5),
                          PeopleToFollow(
                            users: [],
                            onSentMessageRequest: (userId) {
                              context.read<MessagingRequestsBloc>().add(
                                SendMessageRequest(receiverId: userId),
                              );
                            },
                            onFollow: (userId) {
                              context.read<FollowBloc>().add(
                                FollowUser(userId: userId),
                              );
                            },
                            onUnfollow: (userId) {
                              context.read<FollowBloc>().add(
                                UnfollowUser(userId: userId),
                              );
                            },
                            showAll: false,
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      //See All button
                      ListTile(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) {
                                return MultiBlocProvider(
                                  providers: [
                                    BlocProvider.value(
                                      value: BlocProvider.of<FollowBloc>(
                                        context,
                                      ),
                                    ),
                                    BlocProvider.value(
                                      value: BlocProvider.of<
                                        MessagingRequestsBloc
                                      >(context),
                                    ),
                                  ],
                                  child: RecommendedToFollow(
                                    message:
                                        'People to follow based on your activity',
                                    users: [],
                                    onFollow: (userId) {
                                      context.read<FollowBloc>().add(
                                        FollowUser(userId: userId),
                                      );
                                    },
                                    onUnfollow: (userId) {
                                      context.read<FollowBloc>().add(
                                        UnfollowUser(userId: userId),
                                      );
                                    },
                                    onSentMessageRequest: (userId) {
                                      context.read<MessagingRequestsBloc>().add(
                                        SendMessageRequest(receiverId: userId),
                                      );
                                    },
                                    showAll: true,
                                  ),
                                );
                              },
                            ),
                          );
                        },
                        contentPadding: EdgeInsets.zero,
                        title: const Center(
                          child: Text(
                            'See all',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                      const Divider(thickness: 3, height: 16),
                      const SizedBox(height: 20),
                      const Divider(thickness: 3, height: 0),
                      // Suggested Users Section
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 4),
                            child: Text(
                              'People to connect based on your activity',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),

                          // Connection Suggestions widget
                          ConnectionSuggestions(
                            suggestedUsers: suggestedUserstoConnect,
                            onSentMessageRequest: (userId) {
                              context.read<MessagingRequestsBloc>().add(
                                SendMessageRequest(receiverId: userId),
                              );
                            },
                            onSend: (userId) {
                              context.read<ConnectionRequestBloc>().add(
                                SendConnectionRequest(connctionId: userId),
                              );
                            },
                            showAll: false,
                          ),
                          ListTile(
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) {
                                    return MultiBlocProvider(
                                      providers: [
                                        BlocProvider.value(
                                          value: BlocProvider.of<
                                            ConnectionRequestBloc
                                          >(context),
                                        ),
                                        BlocProvider.value(
                                          value: BlocProvider.of<
                                            MessagingRequestsBloc
                                          >(context),
                                        ),
                                      ],
                                      child: SuggestedConnectionsPage(
                                        message:
                                            'People to Connect based on your activity',
                                        users: suggestedUserstoConnect,
                                        onSend: (userId) {
                                          context
                                              .read<ConnectionRequestBloc>()
                                              .add(
                                                SendConnectionRequest(
                                                  connctionId: userId,
                                                ),
                                              );
                                        },
                                        showAll: true,
                                      ),
                                    );
                                  },
                                ),
                              );
                            },
                            contentPadding: EdgeInsets.zero,
                            title: const Center(
                              child: Text(
                                'See all',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          ),
                          const Divider(thickness: 1, height: 16),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            } else if (connectionState is ConnectionRequestError) {
              return const Center(
                child: Text('Failed to load connection requests'),
              );
            } else if (followState is FollowFailure) {
              return const Center(child: Text('Failed to load followed users'));
            } else {
              return const SizedBox.shrink();
            }
          },
        );
      },
    );
  }
}
