import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/loaded_user_Profile.dart';

class UserCard extends StatelessWidget {
  final LoadedUserProfile user;
  final VoidCallback onTap;
  final VoidCallback onSendConnectionRequest;
  final String connectionStatus;
  final bool isFollowed;
  final bool allowConnectionRequest;
  final bool allowMessagingRequest;
  final VoidCallback? onRemoveConnection;
  final VoidCallback? onViewProfile;
  final VoidCallback? onBlockUser;
  final VoidCallback? onFollowUser;
  final VoidCallback? onUnfollowUser;
  final VoidCallback? onsSendingMessagingRequest;

  const UserCard({
    super.key,
    required this.user,
    required this.onTap,
    required this.onSendConnectionRequest,
    required this.connectionStatus,
    required this.isFollowed,
    required this.allowConnectionRequest,
    required this.allowMessagingRequest,
    this.onRemoveConnection,
    this.onViewProfile,
    this.onBlockUser,
    this.onFollowUser,
    this.onUnfollowUser,
    this.onsSendingMessagingRequest,
  });

  bool get isConnected => connectionStatus == 'connected';
  bool get isPending => connectionStatus == 'pending';

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile Image
              CircleAvatar(
                radius: 28,
                backgroundImage:
                    user.profile_image_id != null
                        ? NetworkImage(user.profile_image_id!)
                        : const AssetImage('assets/EmptyUser.png')
                            as ImageProvider,
              ),

              const SizedBox(width: 12),

              // User Information - Just name and bio
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name
                    Text(
                      '${user.first_name} ${user.last_name}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),

                    // Bio
                    if (user.bio != null && user.bio!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        user.bio!,
                        style: TextStyle(color: Colors.grey[700], fontSize: 13),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ],
                ),
              ),

              // More options button
              _buildMoreButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMoreButton() {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.more_vert),
      onSelected: _handleMenuSelection,
      itemBuilder: _buildMenuItems,
    );
  }

  void _handleMenuSelection(String value) {
    switch (value) {
      case 'connect':
        onSendConnectionRequest();
        break;
      case 'profile':
        onViewProfile?.call();
        break;
      case 'remove':
        onRemoveConnection?.call();
        break;
      case 'message':
        onsSendingMessagingRequest?.call();
        break;
      case 'follow':
        onFollowUser?.call();
        break;
      case 'unfollow':
        onUnfollowUser?.call();
        break;
      case 'block':
        onBlockUser?.call();
        break;
    }
  }

  List<PopupMenuEntry<String>> _buildMenuItems(BuildContext context) {
    final List<PopupMenuEntry<String>> items = [];

    // View profile option - always present
    items.add(
      const PopupMenuItem<String>(
        value: 'profile',
        child: ListTile(
          leading: Icon(Icons.person),
          title: Text('View Profile'),
          dense: true,
          contentPadding: EdgeInsets.zero,
        ),
      ),
    );

    // Connection options based on status
    if (isConnected) {
      // Remove connection option
      items.add(
        const PopupMenuItem<String>(
          value: 'remove',
          child: ListTile(
            leading: Icon(Icons.person_remove),
            title: Text('Remove Connection'),
            dense: true,
            contentPadding: EdgeInsets.zero,
          ),
        ),
      );

      // Message option if allowed
      if (allowMessagingRequest) {
        items.add(
          const PopupMenuItem<String>(
            value: 'message',
            child: ListTile(
              leading: Icon(Icons.message),
              title: Text('Message'),
              dense: true,
              contentPadding: EdgeInsets.zero,
            ),
          ),
        );
      }
    }
    // Send connection request if allowed and not already pending
    else if (allowConnectionRequest && !isPending) {
      items.add(
        const PopupMenuItem<String>(
          value: 'connect',
          child: ListTile(
            leading: Icon(Icons.person_add),
            title: Text('Connect'),
            dense: true,
            contentPadding: EdgeInsets.zero,
          ),
        ),
      );
    }

    // Follow/unfollow options
    if (isFollowed) {
      items.add(
        const PopupMenuItem<String>(
          value: 'unfollow',
          child: ListTile(
            leading: Icon(Icons.person_remove_outlined),
            title: Text('Unfollow'),
            dense: true,
            contentPadding: EdgeInsets.zero,
          ),
        ),
      );
    } else {
      items.add(
        const PopupMenuItem<String>(
          value: 'follow',
          child: ListTile(
            leading: Icon(Icons.person_add_outlined),
            title: Text('Follow'),
            dense: true,
            contentPadding: EdgeInsets.zero,
          ),
        ),
      );
    }

    // Block option - always available
    items.add(
      const PopupMenuItem<String>(
        value: 'block',
        child: ListTile(
          leading: Icon(Icons.block),
          title: Text('Block User'),
          dense: true,
          contentPadding: EdgeInsets.zero,
        ),
      ),
    );

    return items;
  }
}
