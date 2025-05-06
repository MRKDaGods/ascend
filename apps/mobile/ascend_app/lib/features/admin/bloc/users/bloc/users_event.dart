part of 'users_bloc.dart';

sealed class UsersEvent {}

/// Event to fetch reported users
final class FetchReportedUsers extends UsersEvent {}

/// Event to fetch banned users
final class FetchBannedUsers extends UsersEvent {}

/// Event to refresh the list of reported users
final class RefreshReportedUsers extends UsersEvent {}

/// Event to ban a specific user
class BanUserEvent extends UsersEvent {
  final int userId;
  final String? expiresAt; // Optional expiration date for temporary bans
  final String? reason; // Optional reason for the ban

  BanUserEvent({required this.userId, this.expiresAt, this.reason});
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