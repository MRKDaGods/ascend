import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/pages/Networks_search_page.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';

class Connections extends StatelessWidget {
  final List<UserModel> connections;
  final Function(String) onRemove;

  const Connections({
    super.key,
    required this.connections,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        if (state is ConnectionRequestLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is ConnectionRequestSuccess) {
          return Scaffold(
            appBar: AppBar(
              title: Text('Connections'),
              centerTitle: true,
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(0),
                child: Container(color: Colors.grey[300], height: 1),
              ),
            ),
            body: Column(
              children: [
                ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  title: Text(
                    '${state.acceptedConnections.length} Connections',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.search),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder:
                                  (_) => BlocProvider.value(
                                    value: BlocProvider.of<SearchFiltersBloc>(
                                      context,
                                    ),
                                    child: NetworksSearchPage(),
                                  ),
                            ),
                          );
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.filter_list),
                        onPressed: () {
                          // Add filter functionality here
                        },
                      ),
                    ],
                  ),
                ),
                const Divider(color: Colors.grey, thickness: 1),
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
                                companyId: '',
                                bio: '',
                                firstFollow: false,
                                firstConnect: false,
                              ),
                        );

                        return ListTile(
                          leading: CircleAvatar(
                            backgroundImage: AssetImage(connection.profilePic),
                          ),
                          title: Text(
                            connection.name,
                            style: TextStyle(
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
                                style: TextStyle(fontSize: 12),
                              ),
                              Text(
                                'connected on ${state.acceptedConnections[index].timestamp}',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.grey,
                                    width: 2,
                                  ), // Grey circular border
                                ),
                                child: IconButton(
                                  padding: EdgeInsets.zero,
                                  icon: const Icon(
                                    Icons.send,
                                    color: Colors.grey,
                                  ),
                                  onPressed: () {},
                                  tooltip: 'Message',
                                ),
                              ),
                              IconButton(
                                icon: Icon(Icons.more_vert),
                                onPressed:
                                    () => _showOptionsModal(
                                      context,
                                      state
                                          .acceptedConnections[index]
                                          .requestId,
                                    ), // Three-dot icon
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

  void _showOptionsModal(BuildContext context, String requestId) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: ListTile(
            leading: const Icon(Icons.delete),
            title: const Text(
              'Remove Connection',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            onTap: () {
              Navigator.pop(context); // Close the modal
              onRemove(requestId); // Call the remove function
            },
          ),
        );
      },
    );
  }
}
