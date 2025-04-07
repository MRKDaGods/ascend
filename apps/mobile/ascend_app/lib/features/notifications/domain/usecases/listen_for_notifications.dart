import 'dart:async';

import '../../domain/entities/notification.dart';
import '../../domain/repositories/notification_repository.dart';

/// Use case for listening to a stream of notifications
class ListenForNotifications {
  final NotificationRepository repository;

  ListenForNotifications(this.repository);

  /// Execute the use case to get a stream of notifications
  Stream<List<Notification>> call() {
    return repository.watchNotifications();
  }
}