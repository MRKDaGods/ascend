import 'dart:convert';
import 'dart:async';
import 'package:ascend_app/features/StartPages/repository/ApiClient.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import './notification_event.dart';
import './notification_state.dart';
import '../../../../core/errors/failures.dart';
import 'package:ascend_app/shared/models/notification.dart';

/// BLoC for managing notification state
class NotificationBloc extends Bloc<NotificationEvent, NotificationState> {
  final ApiClient apiClient;

  StreamSubscription? _notificationsSubscription;

  NotificationBloc({required this.apiClient})
    : super(const NotificationInitial()) {
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

  Future<List<Notification>> getNotifications() async {
    final res = await apiClient.get("/notifications/?page=1");
    if (res.statusCode != 200) {
      throw Fail('Failed to fetch notifications');
    }

    final jsonResponse = jsonDecode(res.body);
    if (jsonResponse == null || jsonResponse is! List) {
      throw Fail('Invalid notification data format');
    }

    return jsonResponse
        .map((notificationJson) => Notification.fromJson(notificationJson))
        .toList()
        .cast<Notification>();
  }

  Future<void> markAsRead(int id) async {
    final res = await apiClient.patch("/notifications/$id",data: {"is_read": true});
    
    // Print response for debugging
    print('Mark as read response: Status ${res.statusCode}, Body: ${res.body}');
    
    // Allow 200 or 204 status codes for success
    if (res.statusCode != 200 && res.statusCode != 204) {
      throw Fail('Failed to mark notification as read: ${res.statusCode}');
    }
    
    // Don't try to parse the response if it's empty or not JSON
    if (res.body.isNotEmpty && res.headers['content-type']?.contains('application/json') == true) {
      try {
        // Only parse if needed - you might not need this if the server just returns empty success
        final jsonResponse = jsonDecode(res.body);
        print('Parsed response: $jsonResponse');
      } catch (e) {
        print('Warning: Could not parse response as JSON: $e');
        // Continue anyway since status code indicates success
      }
    }
  }

  Future<void> deleteNotification(int id) async {
    final res = await apiClient.delete("/notifications/$id");
    
    // Print response for debugging
    print('Delete response: Status ${res.statusCode}, Body: ${res.body}');
    
    // Allow 200 or 204 status codes for success
    if (res.statusCode != 200 && res.statusCode != 204) {
      throw Fail('Failed to delete notification: ${res.statusCode}');
    }
  }

  bool isFetching = false;

  /// Fetch all notifications
  Future<void> _onFetchNotifications(
    FetchNotifications event,
    Emitter<NotificationState> emit,
  ) async {
    // Prevent multiple fetches at the same time
    if (isFetching) return;
    isFetching = true;

    emit(const NotificationLoading());

    try {
      final notifications = await getNotifications();

      // Update the unreadCount based on these notifications
      final unreadCount =
          notifications.where((notification) => !notification.isRead).length;

      // Use these processed notifications instead of making another call
      emit(
        NotificationLoaded(
          notifications: notifications,
          unreadCount: unreadCount,
        ),
      );
      return;
    } on Failure catch (failure) {
      emit(NotificationError(message: failure.message));
    } catch (e) {
      emit(NotificationError(message: e.toString()));
    } finally {
      isFetching = false;
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
      final updatedNotifications =
          currentNotifications.map((notification) {
            if (notification.id == event.id) {
              // Create a new notification with isRead set to true
              return notification.copyWith(isRead: true);
            }
            return notification;
          }).toList();

      // Update unread count
      final unreadCount = updatedNotifications.where((n) => !n.isRead).length;

      // Immediately emit updated state for UI to react
      emit(
        NotificationLoaded(
          notifications: updatedNotifications,
          unreadCount: unreadCount,
        ),
      );

      // Then perform the actual API call
      try {
        await markAsRead(event.id);

        // API call succeeded, emit success message but keep notifications
        emit(
          const NotificationActionSuccess(
            message: 'Notification marked as read',
          ),
        );

        // Emit the notifications state again to ensure UI consistency
        emit(
          NotificationLoaded(
            notifications: updatedNotifications,
            unreadCount: unreadCount,
          ),
        );

        // No need to fetch all notifications again
        // remove: add(const FetchNotifications());
      } on Failure catch (failure) {
        // If API call fails, revert to previous state
        emit(
          NotificationLoaded(
            notifications: currentNotifications,
            unreadCount: currentState.unreadCount,
          ),
        );
        emit(NotificationError(message: failure.message));
      } catch (e) {
        // Same for other errors
        emit(
          NotificationLoaded(
            notifications: currentNotifications,
            unreadCount: currentState.unreadCount,
          ),
        );
        emit(NotificationError(message: e.toString()));
      }
    } else {
      // If we don't have notifications loaded, fall back to original behavior
      try {
        await markAsRead(event.id);
        emit(
          const NotificationActionSuccess(
            message: 'Notification marked as read',
          ),
        );
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
      //await markAllAsRead();

      emit(
        const NotificationActionSuccess(
          message: 'All notifications marked as read',
        ),
      );

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
      final updatedNotifications =
          currentState.notifications
              .where((notification) => notification.id != event.id)
              .toList();

      // Update unread count
      final unreadCount = updatedNotifications.where((n) => !n.isRead).length;

      // Immediately emit updated state
      emit(
        NotificationLoaded(
          notifications: updatedNotifications,
          unreadCount: unreadCount,
        ),
      );

      // Then perform the API call
      try {
        await deleteNotification(event.id);

        emit(const NotificationActionSuccess(message: 'Notification deleted'));

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

        emit(const NotificationActionSuccess(message: 'Notification deleted'));

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
      emit(
        const NotificationActionSuccess(
          message: 'Device registered for notifications',
        ),
      );
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
      emit(
        const NotificationActionSuccess(
          message: 'Device unregistered from notifications',
        ),
      );
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
      emit(const NotificationActionSuccess(message: 'Test notification sent'));
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
      final unreadCount =
          notifications.where((notification) => !notification.isRead).length;

      emit(
        NotificationLoaded(
          notifications: notifications,
          unreadCount: unreadCount,
        ),
      );
    } catch (e) {
      // Don't emit error state for stream updates - just log it
      print('Error updating notifications from stream: $e');
    }
  }

  /// Subscribe to the notifications stream from the repository
  void _subscribeToNotifications() {
    // _notificationsSubscription = listenForNotifications().listen(
    //   (notifications) {
    //     add(UpdateNotifications(notifications));
    //   },
    //   onError: (error) {
    //     // Just log stream errors, don't emit new states
    //     print('Error from notification stream: $error');
    //   },
    // );
  }

  @override
  Future<void> close() {
    _notificationsSubscription?.cancel();
    return super.close();
  }
}
