import '../entities/notification.dart';

/// Repository interface for notification-related operations.
///
/// This defines the contract for accessing notifications data,
/// independent of the actual data source implementation.
abstract class NotificationRepository {
  /// Fetches all notifications for the current user
  Future<List<Notification>> getNotifications();
  
  /// Fetches a single notification by ID
  Future<Notification?> getNotificationById(String id);
  
  /// Marks a specific notification as read
  Future<void> markAsRead(String id);
  
  /// Marks all notifications as read
  Future<void> markAllAsRead();
  
  /// Deletes a specific notification
  Future<void> deleteNotification(String id);
  
  /// Provides a continuous stream of notifications for real-time updates
  Stream<List<Notification>> watchNotifications();
  
  /// Registers the device token with the backend for push notifications
  Future<void> registerDeviceToken(String token);
  
  /// Unregisters the device token when the user logs out
  Future<void> unregisterDeviceToken(String token);
  
  /// Sends a test notification (useful for development and testing)
  Future<void> sendTestNotification();
  
  /// Gets the count of unread notifications
  Future<int> getUnreadCount();
}