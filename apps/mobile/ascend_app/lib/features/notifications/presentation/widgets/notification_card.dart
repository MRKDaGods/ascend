import 'package:flutter/material.dart';
import '../../domain/entities/notification.dart' as entity;
import '../../../../shared/widgets/user_avatar.dart';
import '../../../../shared/utils/date_formatter.dart';

class NotificationCard extends StatelessWidget {
  final entity.Notification notification;
  final VoidCallback onTap;
  final VoidCallback? onMarkAsRead;
  final VoidCallback? onDelete;

  const NotificationCard({
    Key? key,
    required this.notification,
    required this.onTap,
    this.onMarkAsRead,
    this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(notification.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20.0),
        color: Colors.red,
        child: const Icon(
          Icons.delete,
          color: Colors.white,
        ),
      ),
      confirmDismiss: (direction) async {
        return await showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text("Confirm"),
              content: const Text("Are you sure you want to delete this notification?"),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  child: const Text("CANCEL"),
                ),
                TextButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  child: const Text("DELETE"),
                ),
              ],
            );
          },
        );
      },
      onDismissed: (direction) {
        if (onDelete != null) {
          onDelete!();
        }
      },
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
        elevation: 0,
        // Blue hue background when not read
        color: notification.isRead 
            ? null 
            : Colors.blue.withOpacity(0.08), // Changed to blue hue
        child: InkWell(
          onTap: () {
            if (!notification.isRead && onMarkAsRead != null) {
              onMarkAsRead!();
            }
            onTap();
          },
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Blue dot indicator for unread notifications
                if (!notification.isRead)
                  Container(
                    width: 8,
                    height: 8,
                    margin: const EdgeInsets.only(right: 4, top: 6),
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  ),
                
                // Left: Avatar or Icon
                _buildLeadingWidget(),
                
                const SizedBox(width: 12),
                
                // Center: Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title with optional sender name
                      if (notification.senderName != null)
                        Text.rich(
                          TextSpan(
                            children: [
                              TextSpan(
                                text: notification.senderName,
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              TextSpan(text: ' ${notification.title}'),
                            ],
                          ),
                          style: TextStyle(
                            fontSize: 14,
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                        )
                      else
                        Text(
                          notification.title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                        ),
                      
                      const SizedBox(height: 4),
                      
                      // Message body
                      Text(
                        notification.message,
                        style: TextStyle(
                          fontSize: 14,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Right: Timestamp and more actions
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Timestamp
                    Text(
                      DateFormatter.formatRelativeTime(notification.createdAt),
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).colorScheme.onSurfaceVariant.withOpacity(0.7),
                      ),
                    ),
                    const SizedBox(height: 4),
                    // More options button
                    IconButton(
                      icon: Icon(
                        Icons.more_horiz,
                        size: 20,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      visualDensity: VisualDensity.compact,
                      onPressed: () {
                        _showOptionsMenu(context);
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLeadingWidget() {
    // If notification has a sender avatar, show it
    if (notification.senderAvatarUrl != null) {
      return UserAvatar(
        imageUrl: notification.senderAvatarUrl,
        radius: 20,
      );
    }
    
    // Otherwise show an icon based on notification type
    IconData iconData;
    Color iconColor;
    
    switch (notification.type) {
      case 'comment':
        iconData = Icons.comment;
        iconColor = Colors.blue;
        break;
      case 'like':
        iconData = Icons.favorite;
        iconColor = Colors.red;
        break;
      case 'follow':
        iconData = Icons.person_add;
        iconColor = Colors.green;
        break;
      case 'mention':
        iconData = Icons.alternate_email;
        iconColor = Colors.orange;
        break;
      case 'system':
        iconData = Icons.notifications;
        iconColor = Colors.purple;
        break;
      default:
        iconData = Icons.notifications;
        iconColor = Colors.grey;
    }
    
    return CircleAvatar(
      radius: 20,
      backgroundColor: iconColor.withOpacity(0.1),
      child: Icon(
        iconData,
        color: iconColor,
        size: 20,
      ),
    );
  }

  void _showOptionsMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Wrap(
          children: <Widget>[
            if (!notification.isRead)
              ListTile(
                leading: const Icon(Icons.check_circle_outline),
                title: const Text('Mark as read'),
                onTap: () {
                  Navigator.of(context).pop();
                  if (onMarkAsRead != null) onMarkAsRead!();
                },
              ),
            ListTile(
              leading: const Icon(Icons.delete_outline),
              title: const Text('Delete'),
              onTap: () {
                Navigator.of(context).pop();
                if (onDelete != null) onDelete!();
              },
            ),
          ],
        );
      },
    );
  }
}