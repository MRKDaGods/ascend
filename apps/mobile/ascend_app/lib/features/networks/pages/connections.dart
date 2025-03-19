import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';

class Connections extends StatelessWidget {
  final List<UserModel> connections;
  final Function(String) onRemove;

  Connections({Key? key, required this.connections, required this.onRemove})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        if (state is ConnectionRequestLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is ConnectionRequestSuccess) {
          return Scaffold(
            appBar: AppBar(title: Text('Connections')),
            body: Column(
              children: [
                Card(
                  elevation: 2, // Slight shadow effect
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${state.acceptedConnections.length} Connections',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: Icon(Icons.search),
                              onPressed: () {},
                            ),
                            IconButton(
                              icon: Icon(Icons.filter_list),
                              onPressed: () {},
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                if (connections.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text('No connections'),
                  )
                else
                  Expanded(
                    child: ListView.separated(
                      itemCount: state.acceptedConnections.length,
                      itemBuilder: (context, index) {
                        final connection = connections.firstWhere(
                          (user) =>
                              user.id ==
                                  state.acceptedConnections[index].receiverId ||
                              user.id ==
                                  state.acceptedConnections[index].senderId,
                          orElse:
                              () => UserModel(
                                id: '',
                                name: '',
                                profilePic: '',
                                coverpic: '',
                                industry: '',
                                company: '',
                                bio: '',
                              ),
                        );

                        return ListTile(
                          leading: CircleAvatar(
                            backgroundImage: AssetImage(connection.profilePic),
                          ),
                          title: Text(
                            connection.name,
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                connection.bio,
                                maxLines: 2,
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 12,
                                ),
                              ),
                              Text(
                                state.acceptedConnections[index].timestamp,
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: Icon(Icons.message),
                                onPressed: () {},
                              ),
                              PopupMenuButton<String>(
                                onSelected: (value) {
                                  if (value == 'remove') {
                                    onRemove(
                                      state
                                          .acceptedConnections[index]
                                          .requestId,
                                    );
                                  }
                                },
                                itemBuilder:
                                    (BuildContext context) => [
                                      PopupMenuItem(
                                        value: 'remove',
                                        child: ListTile(
                                          leading: Icon(Icons.delete),
                                          title: Text('Remove Connection'),
                                        ),
                                      ),
                                    ],
                                icon: Icon(Icons.more_vert), // Three-dot icon
                              ),
                            ],
                          ),
                        );
                      },
                      separatorBuilder:
                          (context, index) => Divider(
                            color: Colors.grey,
                            thickness: 1,
                            indent: 16,
                            endIndent: 16,
                          ),
                    ),
                  ),
              ],
            ),
          );
        } else {
          return Center(child: Text('Error loading connections'));
        }
      },
    );
  }
}
