import 'package:ascend_app/features/networks/bloc/bloc/blocked/bloc/block_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_preferences/bloc/connection_preferences_bloc.dart';
import 'package:ascend_app/features/networks/model/blocked_user_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BlockedPage extends StatefulWidget {
  const BlockedPage({super.key});

  @override
  State<BlockedPage> createState() => _BlockedPageState();
}

class _BlockedPageState extends State<BlockedPage> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  int _currentPage = 1;
  final int _pageSize = 10;

  @override
  void initState() {
    super.initState();
    _loadBlockedUsers();
    _setupScrollListener();
  }

  void _loadBlockedUsers() {
    context.read<BlockBloc>().add(FetchBlockedUsersEvent());
  }

  void _setupScrollListener() {
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
              _scrollController.position.maxScrollExtent - 200 &&
          !_isLoading) {
        setState(() {
          _isLoading = true;
          _currentPage++;
        });
        _loadMoreBlockedUsers();
      }
    });
  }

  void _loadMoreBlockedUsers() {
    context.read<BlockBloc>().add(FetchBlockedUsersEvent());
  }

  void _unblockUser(String userId) {
    context.read<BlockBloc>().add(UnblockUserEvent(userId));
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Text(
          'Blocked Users',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: BlocConsumer<BlockBloc, BlockState>(
        listener: (context, state) {
          // Handle state changes
          if (state is BlockLoading) {
            setState(() {
              _isLoading = false;
            });
          } else if (state is BlockedUserError) {
            // Show error message
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Error: ${state.errorMessage}'),
                backgroundColor: Colors.red,
              ),
            );
            setState(() {
              _isLoading = false;
            });
          }
        },
        builder: (context, state) {
          if (state is BlockLoading && _currentPage == 1) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is BlockedUsersLoaded) {
            final blockedUsers = state.blockedUsers;

            if (blockedUsers.isEmpty && _currentPage == 1) {
              return _buildEmptyState();
            }

            return _buildBlockedUsersList(blockedUsers);
          } else {
            return _buildEmptyState();
          }
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.block, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          Text(
            'No blocked users',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Users you block will appear here',
            style: TextStyle(fontSize: 16, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildBlockedUsersList(List<BlockedUser> blockedUsers) {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: blockedUsers.length + (_isLoading ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == blockedUsers.length) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: CircularProgressIndicator(),
            ),
          );
        }

        final user = blockedUsers[index];
        return _buildBlockedUserCard(user);
      },
    );
  }

  Widget _buildBlockedUserCard(BlockedUser user) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundImage:
                  user.profile_image_id!.isNotEmpty
                      ? NetworkImage(user.profile_image_id!)
                      : const AssetImage('assets/EmptyUser.png')
                          as ImageProvider<Object>,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${user.first_name} ${user.last_name}',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user.bio!.isNotEmpty ? user.bio! : 'No bio available',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Blocked ${_formatBlockDate(user.blockedAt!)}',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                    maxLines: 1,
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: () => _showUnblockDialog(user),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Unblock'),
            ),
          ],
        ),
      ),
    );
  }

  String _formatBlockDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 365) {
      return '${(difference.inDays / 365).floor()} ${(difference.inDays / 365).floor() == 1 ? 'year' : 'years'} ago';
    } else if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()} ${(difference.inDays / 30).floor() == 1 ? 'month' : 'months'} ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} ${difference.inDays == 1 ? 'day' : 'days'} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} ${difference.inHours == 1 ? 'hour' : 'hours'} ago';
    } else {
      return '${difference.inMinutes} ${difference.inMinutes == 1 ? 'minute' : 'minutes'} ago';
    }
  }

  Future<void> _showUnblockDialog(BlockedUser user) async {
    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Unblock ${user.first_name}?'),
          content: Text(
            'This person will be able to see your profile and send you connection requests.',
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel', style: TextStyle(color: Colors.grey)),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Unblock', style: TextStyle(color: Colors.blueGrey)),
              onPressed: () {
                _unblockUser(user.user_id!);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
