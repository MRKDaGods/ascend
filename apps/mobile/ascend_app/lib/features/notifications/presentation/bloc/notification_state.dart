import 'package:equatable/equatable.dart';

import '../../domain/entities/notification.dart';

/// Base class for all notification-related states
abstract class NotificationState extends Equatable {
  const NotificationState();
  
  @override
  List<Object?> get props => [];
}

/// Initial state when the BLoC is created
class NotificationInitial extends NotificationState {
  const NotificationInitial();
}

/// State when notifications are being loaded
class NotificationLoading extends NotificationState {
  const NotificationLoading();
}

/// State when notifications have been successfully loaded
class NotificationLoaded extends NotificationState {
  final List<Notification> notifications;
  final int unreadCount;
  
  const NotificationLoaded({
    required this.notifications,
    required this.unreadCount,
  });
  
  @override
  List<Object?> get props => [notifications, unreadCount];
}

/// State when a single notification has been loaded
class SingleNotificationLoaded extends NotificationState {
  final Notification notification;
  
  const SingleNotificationLoaded({
    required this.notification,
  });
  
  @override
  List<Object?> get props => [notification];
}

/// State when an operation has been completed successfully
class NotificationActionSuccess extends NotificationState {
  final String message;
  
  const NotificationActionSuccess({
    required this.message,
  });
  
  @override
  List<Object?> get props => [message];
}

/// State when there's an error with notifications
class NotificationError extends NotificationState {
  final String message;
  
  const NotificationError({
    required this.message,
  });
  
  @override
  List<Object?> get props => [message];
}