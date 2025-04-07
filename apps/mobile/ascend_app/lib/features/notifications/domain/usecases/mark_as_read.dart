import '../../domain/repositories/notification_repository.dart';

/// Use case for marking a notification as read
class MarkAsRead {
  final NotificationRepository repository;

  MarkAsRead(this.repository);

  /// Execute the use case
  Future<void> call(String id) {
    return repository.markAsRead(id);
  }
}