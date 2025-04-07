import '../../domain/repositories/notification_repository.dart';

/// Use case for marking all notifications as read
class MarkAllAsRead {
  final NotificationRepository repository;

  MarkAllAsRead(this.repository);

  /// Execute the use case
  Future<void> call() {
    return repository.markAllAsRead();
  }
}