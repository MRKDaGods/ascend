import 'package:ascend_app/features/networks/bloc/bloc/blocked/bloc/block_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_preferences/bloc/connection_preferences_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/messaging_requests/bloc/messaging_requests_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/user_search/bloc/user_search_bloc.dart';
import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:ascend_app/features/networks/pages/connections.dart';
import 'package:ascend_app/features/networks/pages/followings.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/pages/messaging_requests.dart';

class ManageMyNetwork extends StatelessWidget {
  final List<ConnectedUser> connections;
  final List<FollowedUser> followed;

  const ManageMyNetwork({
    super.key,
    required this.connections,
    required this.followed,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Manage My Network',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      body: ListView.separated(
        itemCount: 7, // Number of ListTiles
        itemBuilder: (context, index) {
          Widget tileContent;
          if (index == 0) {
            tileContent = ListTile(
              leading: Icon(Icons.people, color: Colors.blue[700], size: 28),
              title: Text('Connections', style: TextStyle(fontSize: 18)),
              trailing: Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  "${connections.length}",
                  style: TextStyle(color: Colors.blue[700]),
                ),
              ),
              onTap: () {
                context.read<ConnectionRequestBloc>().add(
                  FetchConnectionRequests(),
                );

                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder:
                        (_) => Connections(
                          connections: connections,
                          onRemove: (requestId) {
                            context.read<ConnectionRequestBloc>().add(
                              RemoveConnection(connectionId: requestId),
                            );
                          },
                        ),
                  ),
                );
              },
            );
          } else if (index == 1) {
            tileContent = ListTile(
              leading: Icon(
                Icons.person_2_outlined,
                color: Colors.green[700],
                size: 28,
              ),
              title: Text('People I follow', style: TextStyle(fontSize: 18)),
              trailing: Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  "${followed.length}",
                  style: TextStyle(color: Colors.green[700]),
                ),
              ),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder:
                        (_) => BlocProvider.value(
                          value: BlocProvider.of<FollowBloc>(context),
                          child: Followings(
                            followingUsers: followed,
                            onFollow: (userId) {
                              context.read<FollowBloc>().add(
                                FollowUser(userId: userId),
                              );
                            },
                            onUnFollow: (userId) {
                              context.read<FollowBloc>().add(
                                UnfollowUser(userId: userId),
                              );
                            },
                          ),
                        ),
                  ),
                );
              },
            );
          } else if (index == 2) {
            tileContent = ListTile(
              leading: Icon(Icons.group, color: Colors.purple[700], size: 28),
              title: Text('Groups', style: TextStyle(fontSize: 18)),
              trailing: Icon(Icons.chevron_right, color: Colors.grey),
              onTap: () {},
            );
          } else if (index == 3) {
            tileContent = ListTile(
              leading: Icon(
                Icons.calendar_today_outlined,
                color: Colors.orange[700],
                size: 28,
              ),
              title: Text('Events', style: TextStyle(fontSize: 18)),
              trailing: Icon(Icons.chevron_right, color: Colors.grey),
              onTap: () {},
            );
          } else if (index == 4) {
            tileContent = ListTile(
              leading: Icon(Icons.settings, color: Colors.grey[700], size: 28),
              title: Text('Settings', style: TextStyle(fontSize: 18)),
              trailing: Icon(Icons.chevron_right, color: Colors.grey),
              onTap: () {},
            );
          } else if (index == 5) {
            tileContent = ListTile(
              leading: Icon(
                Icons.newspaper_outlined,
                color: Colors.teal[700],
                size: 28,
              ),
              title: Text('Newsletters', style: TextStyle(fontSize: 18)),
              trailing: Icon(Icons.chevron_right, color: Colors.grey),
              onTap: () {},
            );
          } else if (index == 6) {
            tileContent = ListTile(
              leading: Icon(Icons.message, color: Colors.red[700], size: 28),
              title: Text('Messaging Requests', style: TextStyle(fontSize: 18)),
              trailing: Icon(Icons.chevron_right, color: Colors.grey),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder:
                        (_) => BlocProvider.value(
                          value: BlocProvider.of<MessagingRequestsBloc>(
                            context,
                          ),
                          child: MessagingRequestsPage(),
                        ),
                  ),
                );
              },
            );
          } else {
            return SizedBox.shrink(); // Return an empty widget for other indices
          }

          return Container(color: Colors.white, child: tileContent);
        },
        separatorBuilder:
            (context, index) =>
                Divider(height: 1, thickness: 1, color: Colors.grey[200]),
      ),
    );
  }
}
