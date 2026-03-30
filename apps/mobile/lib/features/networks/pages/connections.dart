import 'package:ascend_app/features/home/bloc/search/search_bloc.dart';
import 'package:ascend_app/features/home/presentation/pages/ultimate_search_page.dart';
import 'package:ascend_app/features/home/repositories/search_repository.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';

enum SortOption { recentlyAdded, firstName, lastName }

class Connections extends StatefulWidget {
  final List<ConnectedUser> connections;
  final Function(String) onRemove;

  const Connections({
    super.key,
    required this.connections,
    required this.onRemove,
  });

  @override
  State<Connections> createState() => _ConnectionsState();
}

class _ConnectionsState extends State<Connections> {
  SortOption _selectedSortOption = SortOption.recentlyAdded;

  void _showSortOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: const Text(
                      'Sort by',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    children: [
                      _buildSortChip(
                        'Recently Added',
                        SortOption.recentlyAdded,
                        setState,
                      ),
                      _buildSortChip(
                        'First Name',
                        SortOption.firstName,
                        setState,
                      ),
                      _buildSortChip(
                        'Last Name',
                        SortOption.lastName,
                        setState,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      setState(() {
                        // Apply the sorting in the parent widget state
                        this.setState(() {});
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      backgroundColor: const Color(
                        0xFF0077B5,
                      ), // LinkedIn blue color
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Show Results'),
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildSortChip(
    String label,
    SortOption option,
    Function(void Function()) setModalState,
  ) {
    final isSelected = _selectedSortOption == option;

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setModalState(() {
            setState(() {
              _selectedSortOption = option;
            });
          });
        }
      },
      backgroundColor: Colors.grey[200],
      selectedColor: const Color(
        0xFF006400,
      ).withOpacity(0.2), // Dark green color
      labelStyle: TextStyle(
        color:
            isSelected
                ? const Color(0xFF006400)
                : Colors.black, // Dark green text for selected chip
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  List<ConnectedUser> _getSortedConnections(List<ConnectedUser> connections) {
    final sortedConnections = List<ConnectedUser>.from(connections);

    switch (_selectedSortOption) {
      case SortOption.recentlyAdded:
        // Assuming connected_at is a date string that can be parsed
        sortedConnections.sort(
          (a, b) => b.connected_at!.compareTo(a.connected_at!),
        );
        break;
      case SortOption.firstName:
        sortedConnections.sort(
          (a, b) => a.first_name!.toLowerCase().compareTo(
            b.first_name!.toLowerCase(),
          ),
        );
        break;
      case SortOption.lastName:
        sortedConnections.sort(
          (a, b) =>
              a.last_name!.toLowerCase().compareTo(b.last_name!.toLowerCase()),
        );
        break;
    }

    return sortedConnections;
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        if (state is ConnectionRequestLoading) {
          return Scaffold(
            appBar: AppBar(title: Text('Connections'), centerTitle: true),
            body: const Center(child: CircularProgressIndicator()),
          );
        } else if (state is ConnectionRequestSuccess) {
          final connections = _getSortedConnections(state.acceptedConnections);

          return Scaffold(
            appBar: AppBar(
              title: Text('Connections'),
              centerTitle: true,
              backgroundColor: Colors.white,
              elevation: 0,
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(0),
                child: Container(color: Colors.grey[300], height: 1),
              ),
            ),
            body: Column(
              children: [
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${state.acceptedConnections.length} Connections',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.search),
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) {
                                    return BlocProvider(
                                      create:
                                          (context) => SearchBloc(
                                            searchRepository:
                                                SearchRepository(),
                                          ),
                                      child: const UltimateSearchPage(),
                                    );
                                  },
                                ),
                              );
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.filter_list),
                            onPressed: () => _showSortOptions(context),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const Divider(color: Colors.grey, thickness: 1, height: 1),
                if (connections.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text('No connections'),
                  )
                else
                  Expanded(
                    child: ListView.separated(
                      itemCount: connections.length,
                      itemBuilder: (context, index) {
                        final connection = connections[index];

                        return InkWell(
                          onTap: () {
                            // Optional: Navigate to user profile when clicked
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 16,
                            ),
                            color: Colors.white,
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Profile image
                                connection.profile_image_url != null
                                    ? CircleAvatar(
                                      radius: 24,
                                      backgroundImage: NetworkImage(
                                        connection.profile_image_url!,
                                      ),
                                    )
                                    : CircleAvatar(
                                      radius: 24,
                                      backgroundImage: const AssetImage(
                                        'assets/EmptyUser.png',
                                      ),
                                    ),
                                const SizedBox(width: 12),

                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  '${connection.first_name} ${connection.last_name}',
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 16,
                                                  ),
                                                ),
                                                if (connection.headline !=
                                                    null) ...[
                                                  Text(
                                                    connection.headline!,
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                      color: Colors.grey[600],
                                                    ),
                                                    maxLines: 2,
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                  ),
                                                ],
                                                // Connection date
                                                Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                        top: 4,
                                                      ),
                                                  child: Text(
                                                    'Connected on ${connection.connected_at}',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey[500],
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Row(
                                            children: [
                                              _buildActionButton(
                                                onPressed:
                                                    () => _showOptionsModal(
                                                      context,
                                                      connection.user_id!,
                                                    ),
                                                icon: Icons.more_vert,
                                                backgroundColor:
                                                    Colors.transparent,
                                                iconColor: Colors.grey[800]!,
                                                hasBorder: false,
                                              ),
                                              const SizedBox(width: 8),
                                              _buildActionButton(
                                                onPressed: () {},
                                                icon: Icons.send,
                                                backgroundColor:
                                                    Colors.transparent,
                                                iconColor: Colors.grey[800]!,
                                                hasBorder: false,
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                      separatorBuilder:
                          (context, index) => const Divider(
                            height: 1,
                            thickness: 1,
                            indent: 0,
                            endIndent: 0,
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
              Future.delayed(Duration.zero, () {
                // ignore: use_build_context_synchronously
                Navigator.of(context).pop();
              });
              widget.onRemove(requestId); // Call the remove function
            },
          ),
        );
      },
    );
  }

  Widget _buildActionButton({
    required VoidCallback onPressed,
    required IconData icon,
    required Color backgroundColor,
    required Color iconColor,
    bool hasBorder = true,
    Color borderColor = Colors.grey,
  }) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: backgroundColor,
          border: hasBorder ? Border.all(color: borderColor, width: 1.5) : null,
        ),
        child: Center(child: Icon(icon, color: iconColor, size: 22)),
      ),
    );
  }
}
