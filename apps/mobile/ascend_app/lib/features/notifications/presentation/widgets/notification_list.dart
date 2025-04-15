import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:ascend_app/shared/models/notification.dart' as entity;
import '../bloc/notification_bloc.dart';
import '../bloc/notification_event.dart';
import '../bloc/notification_state.dart'; // Make sure to import state file
import 'notification_card.dart';

/// A reusable widget for displaying a list of notifications with BLoC integration
class NotificationList extends StatelessWidget {
  /// Whether this is the main notifications page (vs. a preview)
  final bool isMainPage;

  /// Called when the user reaches the end of the list
  final VoidCallback? onLoadMore;

  /// Maximum notifications to show (for preview mode)
  final int? maxNotifications;

  /// The scroll controller to use
  final ScrollController? scrollController;

  /// Optional filter to only show certain notification types
  final entity.NotificationType? filterType;

  const NotificationList({
    super.key,
    this.isMainPage = true,
    this.onLoadMore,
    this.maxNotifications,
    this.scrollController,
    this.filterType,
  });

  @override
  Widget build(BuildContext context) {
    // Using BlocBuilder to react to notification state changes
    return BlocBuilder<NotificationBloc, NotificationState>(
      builder: (context, state) {
        // Initialize lists and flags
        List<entity.Notification> notifications = [];
        bool isLoading = false;

        // Update from state
        if (state is NotificationLoading) {
          isLoading = true;
        } else if (state is NotificationLoaded) {
          // If a filter type is provided, filter the notifications
          if (filterType != null) {
            notifications =
                state.notifications
                    .where(
                      (notification) => notification.type.value == filterType,
                    )
                    .toList();
          } else {
            // Otherwise show all notifications
            notifications = state.notifications;
          }
        }

        if (notifications.isEmpty) {
          if (isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return _buildEmptyState(context);
        }

        // Limit the number of notifications if maxNotifications is specified
        final displayedNotifications =
            maxNotifications != null && maxNotifications! < notifications.length
                ? notifications.sublist(0, maxNotifications)
                : notifications;

        return Column(
          children: [
            // Header with actions (for main page only)
            if (isMainPage && notifications.isNotEmpty)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "${notifications.length} ${notifications.length == 1 ? 'Notification' : 'Notifications'}",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    if (notifications.any((n) => !n.isRead))
                      TextButton.icon(
                        onPressed: () => _markAllAsRead(context),
                        icon: const Icon(Icons.check_circle_outline),
                        label: const Text('Mark all as read'),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 8.0),
                          minimumSize: Size.zero,
                        ),
                      ),
                  ],
                ),
              ),

            // Notifications list
            Expanded(
              child: ListView.builder(
                // Only use the controller if we're not inside another scrollable:
                controller: isMainPage ? scrollController : null,
                itemCount:
                    displayedNotifications.length +
                    (isLoading ? 1 : 0) +
                    (maxNotifications != null &&
                            notifications.length > maxNotifications!
                        ? 1
                        : 0),
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                itemBuilder: (context, index) {
                  // Show loading indicator at the end
                  if (index == displayedNotifications.length && isLoading) {
                    return const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Center(child: CircularProgressIndicator()),
                    );
                  }

                  // Show "View all" button for preview mode
                  if (index == displayedNotifications.length &&
                      maxNotifications != null &&
                      notifications.length > maxNotifications!) {
                    return Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Center(
                        child: TextButton(
                          onPressed: () {
                            Navigator.of(context).pushNamed('/notifications');
                          },
                          child: const Text('View all notifications'),
                        ),
                      ),
                    );
                  }

                  // Show notification card
                  final notification = displayedNotifications[index];
                  return NotificationCard(
                    notification: notification,
                    onTap: () => _handleNotificationTap(context, notification),
                    onMarkAsRead:
                        !notification.isRead
                            ? () => _markAsRead(context, notification.id)
                            : null,
                    onDelete:
                        isMainPage
                            ? () =>
                                _deleteNotification(context, notification.id)
                            : null,
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_off, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No notifications yet',
            style: TextStyle(fontSize: 18, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  void _handleNotificationTap(
    BuildContext context,
    entity.Notification notification,
  ) {
    // Mark as read when tapped
    if (!notification.isRead) {
      context.read<NotificationBloc>().add(
        MarkNotificationAsRead(notification.id),
      );
    }

    // Navigate based on notification type
    switch (notification.type) {
      case entity.NotificationType.comment:
        // if (notification.relatedItemId != null) {
        //   // Navigate to post with comment
        //   // Navigator.of(context).pushNamed('/posts/${notification.relatedItemId}');
        // }
        break;
      case entity.NotificationType.like:
        // if (notification.relatedItemId != null) {
        //   // Navigate to liked post
        //   // Navigator.of(context).pushNamed('/posts/${notification.relatedItemId}');
        // }
        break;
      case entity.NotificationType.follow:
        if (notification.senderName != null) {
          // Navigate to user profile
          // Navigator.of(context).pushNamed('/profile/${notification.senderName}');
        }
        break;
      // You might need to add this case if it exists in your enum
      // case entity.NotificationType.mention:
      //   if (notification.relatedItemId != null) {
      //     // Navigate to post with mention
      //     // Navigator.of(context).pushNamed('/posts/${notification.relatedItemId}');
      //   }
      //   break;
      default:
        // For system notifications or unknown types
        break;
    }
  }

  void _markAsRead(BuildContext context, int id) {
    context.read<NotificationBloc>().add(MarkNotificationAsRead(id));
  }

  void _deleteNotification(BuildContext context, int id) {
    context.read<NotificationBloc>().add(DeleteNotification(id));
  }

  void _markAllAsRead(BuildContext context) {
    context.read<NotificationBloc>().add(const MarkAllNotificationsAsRead());
  }
}
