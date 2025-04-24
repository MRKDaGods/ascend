import 'package:equatable/equatable.dart';

<<<<<<< HEAD
import '../../domain/entities/notification.dart';
=======
import 'package:ascend_app/shared/models/notification.dart';
>>>>>>> Cross

/// Base class for all notification-related states
abstract class NotificationState extends Equatable {
  const NotificationState();
<<<<<<< HEAD
  
=======

>>>>>>> Cross
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
<<<<<<< HEAD
  
=======

>>>>>>> Cross
  const NotificationLoaded({
    required this.notifications,
    required this.unreadCount,
  });
<<<<<<< HEAD
  
=======

>>>>>>> Cross
  @override
  List<Object?> get props => [notifications, unreadCount];
}

/// State when a single notification has been loaded
class SingleNotificationLoaded extends NotificationState {
  final Notification notification;
<<<<<<< HEAD
  
  const SingleNotificationLoaded({
    required this.notification,
  });
  
=======

  const SingleNotificationLoaded({required this.notification});

>>>>>>> Cross
  @override
  List<Object?> get props => [notification];
}

/// State when an operation has been completed successfully
class NotificationActionSuccess extends NotificationState {
  final String message;
<<<<<<< HEAD
  
  const NotificationActionSuccess({
    required this.message,
  });
  
=======

  const NotificationActionSuccess({required this.message});

>>>>>>> Cross
  @override
  List<Object?> get props => [message];
}

/// State when there's an error with notifications
class NotificationError extends NotificationState {
  final String message;
<<<<<<< HEAD
  
  const NotificationError({
    required this.message,
  });
  
  @override
  List<Object?> get props => [message];
}
=======

  const NotificationError({required this.message});

  @override
  List<Object?> get props => [message];
}
>>>>>>> Cross
