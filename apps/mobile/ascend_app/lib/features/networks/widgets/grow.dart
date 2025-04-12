import 'package:ascend_app/features/networks/bloc/bloc/blocked/bloc/block_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:ascend_app/features/networks/model/connection_preferences.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/people_to_follow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_recieved_list_partial.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/pages/connection_requests_page.dart';
import 'package:ascend_app/features/networks/pages/manage_my_network.dart';
import 'package:ascend_app/features/networks/widgets/single_follow.dart';
import 'package:ascend_app/features/networks/pages/recommended_to_follow.dart';
import 'package:ascend_app/features/networks/Mock%20Data/connections_request.dart';
import 'package:ascend_app/features/networks/managers/follow_manager.dart';
import 'package:ascend_app/features/networks/widgets/connection_suggestions.dart';
import 'package:uuid/uuid.dart';
import 'package:ascend_app/features/networks/pages/suggested_connections_page.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_preferences/bloc/connection_preferences_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/messaging/bloc/messaging_bloc.dart';

class Grow extends StatefulWidget {
  const Grow({super.key});

  @override
  _GrowState createState() => _GrowState();
}

class _GrowState extends State<Grow> {
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController(); // Initialize the ScrollController
  }

  @override
  void dispose() {
    _scrollController
        .dispose(); // Dispose of the ScrollController to prevent memory leaks
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
              final suggestedUserstoFollow = followState.suggestedUsers;
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
                                        value:
                                            BlocProvider.of<SearchFiltersBloc>(
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
                            users: suggestedUserstoFollow,
                            onSentMessageRequest: (userId) {
                              context.read<MessagingBloc>().add(
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
                                final bloc = BlocProvider.of<FollowBloc>(
                                  context,
                                );
                                return BlocProvider.value(
                                  value: bloc,
                                  child: RecommendedToFollow(
                                    Message:
                                        'People to follow based on your activity',
                                    users: suggestedUserstoFollow,
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
                                      context.read<MessagingBloc>().add(
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
                              context.read<MessagingBloc>().add(
                                SendMessageRequest(receiverId: userId),
                              );
                            },
                            onSend: (userId) {
                              context.read<ConnectionRequestBloc>().add(
                                SendConnectionRequest(connctionId: userId),
                              );
                            },
                            ShowAll: false,
                          ),
                          ListTile(
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
                                      child: SuggestedConnectionsPage(
                                        Message:
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
