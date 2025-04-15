import '../../domain/repositories/notification_repository.dart';

/// Use case for deleting a notification
class DeleteNotificationUseCase {
  final NotificationRepository repository;

  DeleteNotificationUseCase(this.repository);

  /// Execute the use case
  Future<void> call(String id) {
    return repository.deleteNotification(id);
  }
}