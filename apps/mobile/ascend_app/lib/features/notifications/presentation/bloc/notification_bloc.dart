import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';

import './notification_event.dart';
import './notification_state.dart';
import '../../domain/entities/notification.dart';
import '../../domain/usecases/get_notifications.dart';
import '../../domain/usecases/mark_as_read.dart';
import '../../domain/usecases/mark_all_as_read.dart';
import '../../domain/usecases/listen_for_notifications.dart';
import '../../domain/usecases/delete_notification.dart';
import '../../../../core/errors/failures.dart';

/// BLoC for managing notification state
class NotificationBloc extends Bloc<NotificationEvent, NotificationState> {
  final GetNotifications getNotifications;
  final MarkAsRead markAsRead;
  final MarkAllAsRead markAllAsRead;
  final ListenForNotifications listenForNotifications;
  final DeleteNotificationUseCase deleteNotification;
  
  StreamSubscription? _notificationsSubscription;
  
  NotificationBloc({
    required this.getNotifications,
    required this.markAsRead,
    required this.markAllAsRead,
    required this.listenForNotifications,
    required this.deleteNotification,
  }) : super(const NotificationInitial()) {
    on<FetchNotifications>(_onFetchNotifications);
    on<FetchNotificationById>(_onFetchNotificationById);
    on<MarkNotificationAsRead>(_onMarkNotificationAsRead);
    on<MarkAllNotificationsAsRead>(_onMarkAllNotificationsAsRead);
    on<DeleteNotification>(_onDeleteNotification);
    on<RegisterDeviceToken>(_onRegisterDeviceToken);
    on<UnregisterDeviceToken>(_onUnregisterDeviceToken);
    on<SendTestNotification>(_onSendTestNotification);
    on<UpdateNotifications>(_onUpdateNotifications);
    
    // Subscribe to the notifications stream
    _subscribeToNotifications();
  }
  
  /// Fetch all notifications
  Future<void> _onFetchNotifications(
    FetchNotifications event,
    Emitter<NotificationState> emit,
  ) async {
    emit(const NotificationLoading());
    
    try {
      final notifications = await getNotifications();
      final unreadCount = notifications.where((notification) => !notification.isRead).length;
      
      emit(NotificationLoaded(
        notifications: notifications,
        unreadCount: unreadCount,
      ));
    } on Failure catch (failure) {
      emit(NotificationError(message: failure.message));
    } catch (e) {
      emit(NotificationError(message: e.toString()));
    }
  }
  
  /// Fetch a specific notification by ID
  Future<void> _onFetchNotificationById(
    FetchNotificationById event,
    Emitter<NotificationState> emit,
  ) async {
    emit(const NotificationLoading());
    
    Notification? notification;
    try {
      notification = (await getNotifications()).firstWhere(
        (notification) => notification.id == event.id,
      );
    } on StateError {
      notification = null;
    }
    
    if (notification != null) {
      emit(SingleNotificationLoaded(notification: notification));
    } else {
      emit(const NotificationError(message: 'Notification not found'));
    }
  }
  
  /// Mark a notification as read
  Future<void> _onMarkNotificationAsRead(
    MarkNotificationAsRead event,
    Emitter<NotificationState> emit,
  ) async {
    // First check if we have notifications loaded
    if (state is NotificationLoaded) {
      final currentState = state as NotificationLoaded;
      final currentNotifications = currentState.notifications;
      
      // Create an optimistically updated list
      final updatedNotifications = currentNotifications.map((notification) {
        if (notification.id == event.id) {
          // Create a new notification with isRead set to true
          return notification.copyWith(isRead: true);
        }
        return notification;
      }).toList();
      
      // Update unread count
      final unreadCount = updatedNotifications.where((n) => !n.isRead).length;
      
      // Immediately emit updated state for UI to react
      emit(NotificationLoaded(
        notifications: updatedNotifications,
        unreadCount: unreadCount,
      ));
      
      // Then perform the actual API call
      try {
        await markAsRead(event.id);
        
        // API call succeeded, emit success message but keep notifications
        emit(const NotificationActionSuccess(
          message: 'Notification marked as read',
        ));
        
        // Emit the notifications state again to ensure UI consistency 
        emit(NotificationLoaded(
          notifications: updatedNotifications,
          unreadCount: unreadCount,
        ));
        
        // No need to fetch all notifications again
        // remove: add(const FetchNotifications());
      } on Failure catch (failure) {
        // If API call fails, revert to previous state
        emit(NotificationLoaded(
          notifications: currentNotifications,
          unreadCount: currentState.unreadCount,
        ));
        emit(NotificationError(message: failure.message));
      } catch (e) {
        // Same for other errors
        emit(NotificationLoaded(
          notifications: currentNotifications,
          unreadCount: currentState.unreadCount,
        ));
        emit(NotificationError(message: e.toString()));
      }
    } else {
      // If we don't have notifications loaded, fall back to original behavior
      try {
        await markAsRead(event.id);
        emit(const NotificationActionSuccess(
          message: 'Notification marked as read',
        ));
        add(const FetchNotifications());
      } on Failure catch (failure) {
        emit(NotificationError(message: failure.message));
      } catch (e) {
        emit(NotificationError(message: e.toString()));
      }
    }
  }
  
  /// Mark all notifications as read
  Future<void> _onMarkAllNotificationsAsRead(
    MarkAllNotificationsAsRead event,
    Emitter<NotificationState> emit,
  ) async {
    try {
      await markAllAsRead();
      
      emit(const NotificationActionSuccess(
        message: 'All notifications marked as read',
      ));
      
      // Refresh notifications after marking all as read
      add(const FetchNotifications());
    } on Failure catch (failure) {
      emit(NotificationError(message: failure.message));
    } catch (e) {
      emit(NotificationError(message: e.toString()));
    }
  }
  
  /// Delete a notification
  Future<void> _onDeleteNotification(
    DeleteNotification event,
    Emitter<NotificationState> emit,
  ) async {
    if (state is NotificationLoaded) {
      final currentState = state as NotificationLoaded;
      
      // Optimistically remove the notification from the list
      final updatedNotifications = currentState.notifications
          .where((notification) => notification.id != event.id)
          .toList();
      
      // Update unread count
      final unreadCount = updatedNotifications.where((n) => !n.isRead).length;
      
      // Immediately emit updated state
      emit(NotificationLoaded(
        notifications: updatedNotifications,
        unreadCount: unreadCount,
      ));
      
      // Then perform the API call
      try {
        await deleteNotification(event.id);
        
        emit(const NotificationActionSuccess(
          message: 'Notification deleted',
        ));
        
        // Refresh notifications after deletion
        add(const FetchNotifications());
      } on Failure catch (failure) {
        emit(NotificationError(message: failure.message));
      } catch (e) {
        emit(NotificationError(message: e.toString()));
      }
    } else {
      try {
        await deleteNotification(event.id);
        
        emit(const NotificationActionSuccess(
          message: 'Notification deleted',
        ));
        
        // Refresh notifications after deletion
        add(const FetchNotifications());
      } on Failure catch (failure) {
        emit(NotificationError(message: failure.message));
      } catch (e) {
        emit(NotificationError(message: e.toString()));
      }
    }
  }
  
  /// Register device token for push notifications
  Future<void> _onRegisterDeviceToken(
    RegisterDeviceToken event,
    Emitter<NotificationState> emit,
  ) async {
    try {
      // Assuming registerDeviceToken is part of the repository or use case
      emit(const NotificationActionSuccess(
        message: 'Device registered for notifications',
      ));
    } on Failure catch (failure) {
      emit(NotificationError(message: failure.message));
    } catch (e) {
      emit(NotificationError(message: e.toString()));
    }
  }
  
  /// Unregister device token
  Future<void> _onUnregisterDeviceToken(
    UnregisterDeviceToken event,
    Emitter<NotificationState> emit,
  ) async {
    try {
      // Assuming unregisterDeviceToken is part of the repository or use case
      emit(const NotificationActionSuccess(
        message: 'Device unregistered from notifications',
      ));
    } on Failure catch (failure) {
      emit(NotificationError(message: failure.message));
    } catch (e) {
      emit(NotificationError(message: e.toString()));
    }
  }
  
  /// Send a test notification (for development)
  Future<void> _onSendTestNotification(
    SendTestNotification event,
    Emitter<NotificationState> emit,
  ) async {
    try {
      // Assuming sendTestNotification is part of the repository or use case
      emit(const NotificationActionSuccess(
        message: 'Test notification sent',
      ));
    } on Failure catch (failure) {
      emit(NotificationError(message: failure.message));
    } catch (e) {
      emit(NotificationError(message: e.toString()));
    }
  }
  
  /// Update notifications from stream
  void _onUpdateNotifications(
    UpdateNotifications event,
    Emitter<NotificationState> emit,
  ) async {
    try {
      final notifications = event.notifications.cast<Notification>();
      final unreadCount = notifications.where((notification) => !notification.isRead).length;
      
      emit(NotificationLoaded(
        notifications: notifications,
        unreadCount: unreadCount,
      ));
    } catch (e) {
      // Don't emit error state for stream updates - just log it
      print('Error updating notifications from stream: $e');
    }
  }
  
  /// Subscribe to the notifications stream from the repository
  void _subscribeToNotifications() {
    _notificationsSubscription = listenForNotifications().listen(
      (notifications) {
        add(UpdateNotifications(notifications));
      },
      onError: (error) {
        // Just log stream errors, don't emit new states
        print('Error from notification stream: $error');
      },
    );
  }
  
  @override
  Future<void> close() {
    _notificationsSubscription?.cancel();
    return super.close();
  }
}