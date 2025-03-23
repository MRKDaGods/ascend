import 'package:ascend_app/features/networks/Mock%20Data/users.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/people_to_follow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_request_recieved_list_partial.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Repositories/user_repoistory.dart';
import 'package:ascend_app/features/networks/pages/connection_requests_page.dart';
import 'package:ascend_app/features/networks/pages/manage_my_network.dart';
import 'package:ascend_app/features/networks/model/follow_model.dart';
import 'package:ascend_app/features/networks/widgets/single_follow.dart';
import 'package:ascend_app/features/networks/Mock Data/follow.dart';
import 'package:ascend_app/features/networks/pages/recommended_to_follow.dart';

class Grow extends StatefulWidget {
  const Grow({Key? key}) : super(key: key);

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
                  connectionState.pendingRequestsReceived
                      .map((request) => getUser(request.senderId))
                      .toList();

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

              final suggestedUserstoFollow = getSuggestedUsers(
                connections,
                followedUsers,
                invitationsReceived,
                connectionState.pendingRequestsSent
                    .map((request) => getUser(request.receiverId))
                    .toList(),
              );

              final customConnections = buildCustomConnections(connections);

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
                          'Invitations (${invitationsReceived.length})',
                          style: const TextStyle(
                            fontSize: 18,
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
                                    invitationsReceived: invitationsReceived,
                                    pendingRequestsReceived:
                                        connectionState.pendingRequestsReceived,
                                    invitationsSent:
                                        connectionState.pendingRequestsSent
                                            .map(
                                              (request) =>
                                                  getUser(request.receiverId),
                                            )
                                            .toList(),
                                    pendingRequestsSent:
                                        connectionState.pendingRequestsSent,
                                  ),
                                );
                              },
                            ),
                          );
                        },
                      ),
                      const Divider(thickness: 1),
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
                      const Divider(thickness: 1, height: 16),
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
                      const Divider(thickness: 1, height: 16),
                      // People to Follow Section
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 4),
                            child: Text(
                              'People to follow based on your activity',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 5),
                          PeopleToFollow(
                            users: suggestedUserstoFollow,
                            mutualUsers: customConnections,
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
                            onHide: (userId) {
                              context.read<FollowBloc>().add(
                                HideUser(userId: userId),
                              );
                            },
                            showAll: false,
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
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
                                    mutualUsers: customConnections,
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
                                    onHide: (userId) {
                                      context.read<FollowBloc>().add(
                                        HideUser(userId: userId),
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

List<UserModel> getSuggestedUsers(
  List<UserModel> connections,
  List<UserModel> followedUsers,
  List<UserModel> sentconnectionRequests,
  List<UserModel> receivedconnectionRequests,
) {
  final allUsers = generateUsers();
  final unFollowedUsers =
      allUsers.where((user) {
        // Check if the user's ID is not in the connections or followedUsers lists
        final isConnected = connections.any(
          (connection) => connection.id == user.id && connection.id != "1",
        );
        final isFollowed = followedUsers.any(
          (followed) => followed.id == user.id && followed.id != "1",
        );
        final isRequested = sentconnectionRequests.any(
          (request) => request.id == user.id && request.id != "1",
        );
        final isReceived = receivedconnectionRequests.any(
          (request) => request.id == user.id && request.id != "1",
        );
        return !isConnected && !isFollowed && !isRequested && !isReceived;
      }).toList();
  unFollowedUsers.removeWhere((element) => element.id == "1");
  print("Users to Follow:");
  unFollowedUsers.forEach((element) => print(element.id));
  return unFollowedUsers;
}

Map<String, List<UserModel>> buildCustomConnections(
  List<UserModel> connections,
) {
  final Map<String, List<UserModel>> customConnections = {};
  final userstobeFollowed = generateFollowers();

  for (var user in userstobeFollowed) {
    final mutualUser =
        connections.where((connection) {
          return user.followerId == connection.id;
        }).toList();

    if (customConnections.containsKey(user.followingId)) {
      customConnections[user.followingId]!.addAll(mutualUser);
    } else {
      customConnections[user.followingId] = mutualUser;
    }
  }
  customConnections.forEach(
    (key, value) =>
        print("User: $key, Mutual Users: ${value.map((e) => e.id)}"),
  );
  return customConnections;
}
