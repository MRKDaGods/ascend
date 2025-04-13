import '../../domain/entities/notification.dart';
import '../../domain/repositories/notification_repository.dart';

/// Use case for retrieving all notifications
class GetNotifications {
  final NotificationRepository repository;

  GetNotifications(this.repository);

  /// Execute the use case
  Future<List<Notification>> call() {
    return repository.getNotifications();
  }
}