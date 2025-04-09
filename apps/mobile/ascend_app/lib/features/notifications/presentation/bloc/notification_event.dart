import 'package:equatable/equatable.dart';

/// Base class for all notification-related events
abstract class NotificationEvent extends Equatable {
  const NotificationEvent();
  
  @override
  List<Object?> get props => [];
}

/// Event to fetch all notifications
class FetchNotifications extends NotificationEvent {
  const FetchNotifications();
}

/// Event to fetch a specific notification by ID
class FetchNotificationById extends NotificationEvent {
  final String id;
  
  const FetchNotificationById(this.id);
  
  @override
  List<Object?> get props => [id];
}

/// Event to mark a notification as read
class MarkNotificationAsRead extends NotificationEvent {
  final String id;
  
  const MarkNotificationAsRead(this.id);
  
  @override
  List<Object?> get props => [id];
}

/// Event to mark all notifications as read
class MarkAllNotificationsAsRead extends NotificationEvent {
  const MarkAllNotificationsAsRead();
}

/// Event to delete a notification
class DeleteNotification extends NotificationEvent {
  final String id;
  
  const DeleteNotification(this.id);
  
  @override
  List<Object?> get props => [id];
}

/// Event to register a device token for push notifications
class RegisterDeviceToken extends NotificationEvent {
  final String token;
  
  const RegisterDeviceToken(this.token);
  
  @override
  List<Object?> get props => [token];
}

/// Event to unregister a device token
class UnregisterDeviceToken extends NotificationEvent {
  final String token;
  
  const UnregisterDeviceToken(this.token);
  
  @override
  List<Object?> get props => [token];
}

/// Event to send a test notification (for development)
class SendTestNotification extends NotificationEvent {
  const SendTestNotification();
}

/// Event to update notification state from a stream
class UpdateNotifications extends NotificationEvent {
  final List<dynamic> notifications;
  
  const UpdateNotifications(this.notifications);
  
  @override
  List<Object?> get props => [notifications];
}