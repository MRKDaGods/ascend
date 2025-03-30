import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:ascend_app/features/networks/pages/connections.dart';
import 'package:ascend_app/features/networks/pages/followings.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';

class ManageMyNetwork extends StatelessWidget {
  final List<UserModel> connections;
  final List<UserModel> followed;

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
          if (index == 0) {
            return ListTile(
              leading: Icon(Icons.people),
              title: Text(
                'Connections',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              trailing: Text("${connections.length}"),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder:
                        (_) => MultiBlocProvider(
                          providers: [
                            BlocProvider.value(
                              value: BlocProvider.of<ConnectionRequestBloc>(
                                context,
                              ),
                            ),
                            BlocProvider.value(
                              value: BlocProvider.of<SearchFiltersBloc>(
                                context,
                              ),
                            ),
                          ],
                          child: Connections(
                            connections: connections,
                            onRemove: (requestId) {
                              context.read<ConnectionRequestBloc>().add(
                                RemoveConnection(connectionId: requestId),
                              );
                            },
                          ),
                        ),
                  ),
                );
              },
            );
          } else if (index == 1) {
            return ListTile(
              leading: Icon(Icons.person_2_outlined),
              title: Text(
                'People I follow',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              trailing: Text("${followed.length}"),
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
            return ListTile(
              leading: Icon(Icons.group),
              title: Text(
                'Groups',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              onTap: () {},
            );
          } else if (index == 3) {
            return ListTile(
              leading: Icon(Icons.calendar_today_outlined),
              title: Text(
                'Events',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              onTap: () {},
            );
          } else if (index == 4) {
            return ListTile(
              leading: Icon(Icons.pages),
              title: Text(
                'Settings',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              onTap: () {},
            );
          } else if (index == 5) {
            return ListTile(
              leading: Icon(Icons.newspaper_outlined),
              title: Text(
                'Newsletters',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              onTap: () {},
            );
          } else {
            return SizedBox.shrink();
          }
        },
        separatorBuilder:
            (context, index) => Divider(
              color: Colors.grey,
              thickness: 1,
              indent: 16,
              endIndent: 16,
            ),
      ),
    );
  }
}
