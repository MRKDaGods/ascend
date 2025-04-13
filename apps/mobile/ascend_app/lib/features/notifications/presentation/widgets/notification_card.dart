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
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
      elevation: 0,
      color: notification.isRead 
          ? null 
          : Theme.of(context).colorScheme.primary.withOpacity(0.05),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                    
                    const SizedBox(height: 8),
                    
                    // Timestamp
                    Text(
                      DateFormatter.formatRelativeTime(notification.createdAt),
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).colorScheme.onSurfaceVariant.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),
              
              // Right: Actions
              if (!notification.isRead || onDelete != null)
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (!notification.isRead && onMarkAsRead != null)
                      IconButton(
                        icon: const Icon(Icons.check_circle_outline),
                        tooltip: 'Mark as read',
                        visualDensity: VisualDensity.compact,
                        iconSize: 20,
                        onPressed: onMarkAsRead,
                      ),
                    if (onDelete != null)
                      IconButton(
                        icon: const Icon(Icons.delete_outline),
                        tooltip: 'Delete',
                        visualDensity: VisualDensity.compact,
                        iconSize: 20,
                        onPressed: onDelete,
                      ),
                  ],
                ),
            ],
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
}