import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/user_search/bloc/user_search_bloc.dart';
import 'package:ascend_app/features/networks/model/loaded_user_Profile.dart';
import 'package:ascend_app/features/networks/widgets/user_profile_card.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/blocked/bloc/block_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';

class SearchUsersPage extends StatefulWidget {
  const SearchUsersPage({super.key});

  @override
  State<SearchUsersPage> createState() => _SearchUsersPageState();
}

class _SearchUsersPageState extends State<SearchUsersPage> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  // Page parameters
  int _currentPage = 1;
  final int _resultsPerPage = 10;
  bool _isLoading = false;
  bool _hasMoreData = true;

  List<LoadedUserProfile> _searchResults = [];

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadInitialData();
  }

  void _loadInitialData() {
    context.read<UserSearchBloc>().add(
      SearchUsersEvent(query: '', page: _currentPage, limit: _resultsPerPage),
    );
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoading &&
        _hasMoreData) {
      _loadMoreResults();
    }
  }

  void _loadMoreResults() {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
      _currentPage++;
    });

    if (_searchController.text.isEmpty) {
      context.read<UserSearchBloc>().add(
        SearchUsersEvent(query: '', page: _currentPage, limit: _resultsPerPage),
      );
    } else {
      context.read<UserSearchBloc>().add(
        SearchUsersEvent(
          query: _searchController.text,
          page: _currentPage,
          limit: _resultsPerPage,
        ),
      );
    }
  }

  void _performSearch() {
    setState(() {
      _isLoading = true;
      _currentPage = 1;
      _searchResults = [];
    });

    context.read<UserSearchBloc>().add(
      SearchUsersEvent(
        query: _searchController.text,
        page: 1,
        limit: _resultsPerPage,
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Search Users"),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: "Search by name...",
                prefixIcon: const Icon(Icons.search),
                suffixIcon:
                    _searchController.text.isNotEmpty
                        ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            _searchController.clear();
                            setState(() {
                              _currentPage = 1;
                              _searchResults = [];
                            });
                            _loadInitialData();
                          },
                        )
                        : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.grey[200],
              ),
              onSubmitted: (_) {
                if (_searchController.text.isNotEmpty) {
                  _performSearch();
                }
              },
            ),
          ),
        ),
      ),
      body: MultiBlocListener(
        listeners: [
          BlocListener<UserSearchBloc, UserSearchState>(
            listener: (context, state) {
              if (state is UserSearchLoaded) {
                setState(() {
                  if (_currentPage == 1) {
                    // Fix the casting issue - convert to List<LoadedUserProfile> properly
                    _searchResults = List<LoadedUserProfile>.from(state.users);
                  } else {
                    // Fix the casting issue for appending results
                    _searchResults = [
                      ..._searchResults,
                      ...List<LoadedUserProfile>.from(state.users),
                    ];
                  }
                  _isLoading = false;
                  _hasMoreData = state.canLoadMore;
                });
              } else if (state is UserSearchError) {
                setState(() {
                  _isLoading = false;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error: ${state.message}')),
                );
              }
            },
          ),
          BlocListener<ConnectionRequestBloc, ConnectionRequestState>(
            listener: (context, state) {
              if (state is ConnectionRequestSuccess) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Connection request sent successfully'),
                  ),
                );
                // Refresh search results to update statuses
                context.read<UserSearchBloc>().add(
                  SearchUsersEvent(
                    query: _searchController.text,
                    page: 1,
                    limit: _resultsPerPage * _currentPage,
                  ),
                );
              } else if (state is ConnectionRequestError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error: ${state.error}')),
                );
              }
            },
          ),
        ],
        child: _buildBody(),
      ),
      floatingActionButton:
          _searchController.text.isNotEmpty
              ? FloatingActionButton(
                onPressed: _performSearch,
                tooltip: 'Search',
                child: const Icon(Icons.search),
              )
              : null,
    );
  }

  Widget _buildBody() {
    // Show loading indicator for initial load
    if (_isLoading && _searchResults.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    // Show error state when no results
    if (_searchResults.isEmpty && !_isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 60, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              _searchController.text.isEmpty
                  ? 'No recommended users found'
                  : 'No users found matching "${_searchController.text}"',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            ),
            if (_searchController.text.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: ElevatedButton(
                  onPressed: _loadInitialData,
                  child: const Text('View Recommendations'),
                ),
              ),
          ],
        ),
      );
    }

    // Show results list
    return Stack(
      children: [
        ListView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.all(12),
          itemCount: _searchResults.length + (_isLoading ? 1 : 0),
          itemBuilder: (context, index) {
            if (index == _searchResults.length) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(8.0),
                  child: CircularProgressIndicator(),
                ),
              );
            }

            final user = _searchResults[index];
            return UserCard(
              user: user,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder:
                        (context) =>
                            UserProfilePage(profileId: int.parse(user.user_id)),
                  ),
                );
              },
              onSendConnectionRequest: () {
                context.read<ConnectionRequestBloc>().add(
                  SendConnectionRequest(connctionId: user.user_id),
                );
              },
              onRemoveConnection: () {
                context.read<ConnectionRequestBloc>().add(
                  RemoveConnection(connectionId: user.user_id),
                );
              },
              onViewProfile: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder:
                        (context) =>
                            UserProfilePage(profileId: int.parse(user.user_id)),
                  ),
                );
              },
              onFollowUser: () {
                context.read<FollowBloc>().add(
                  FollowUser(userId: user.user_id),
                );
              },
              onUnfollowUser: () {
                context.read<FollowBloc>().add(
                  UnfollowUser(userId: user.user_id),
                );
              },
              onBlockUser: () {
                _showBlockUserConfirmation(context, user);
              },
              onsSendingMessagingRequest: () {
                Navigator.pushNamed(
                  context,
                  '/messaging/chat',
                  arguments: {
                    'userId': user.user_id,
                    'name': '${user.first_name} ${user.last_name}',
                  },
                );
              },
              connectionStatus: user.is_connected ?? 'none',
              isFollowed: user.is_followed ?? false,
              allowConnectionRequest: user.canConnect ?? false,
              allowMessagingRequest: user.canReceiveMessageRequests ?? false,
            );
          },
        ),

        if (_isLoading && _searchResults.isNotEmpty)
          const Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: LinearProgressIndicator(),
          ),
      ],
    );
  }

  void _showBlockUserConfirmation(
    BuildContext context,
    LoadedUserProfile user,
  ) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Block User'),
            content: Text(
              'Are you sure you want to block ${user.first_name} ${user.last_name}? They won\'t be able to see your profile or contact you.',
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  context.read<BlockBloc>().add(BlockUserEvent(user.user_id));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('${user.first_name} has been blocked'),
                    ),
                  );
                },
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Block'),
              ),
            ],
          ),
    );
  }
}
