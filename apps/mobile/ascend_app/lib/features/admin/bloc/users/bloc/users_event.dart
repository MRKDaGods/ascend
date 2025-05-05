part of 'users_bloc.dart';

sealed class UsersEvent {}

/// Event to fetch reported users
final class FetchReportedUsers extends UsersEvent {}

/// Event to refresh the list of reported users
final class RefreshReportedUsers extends UsersEvent {}

/// Event to ban a specific user
final class BanUser extends UsersEvent {
  final String userId;

  BanUser(this.userId);
}

/// Event to unban a specific user
final class UnbanUser extends UsersEvent {
  final String userId;

  UnbanUser(this.userId);
}

/// Event to delete a specific user
final class DeleteUserEvent extends UsersEvent {
  final int userId;

  DeleteUserEvent({required this.userId});
}