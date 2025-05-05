part of 'users_bloc.dart';

sealed class UsersState {}

/// Initial state
final class UsersInitial extends UsersState {}

/// Loading state
final class UsersLoading extends UsersState {}

/// Loaded state with a list of reported users
final class UsersLoaded extends UsersState {
  final List<UserReport> reports;

  UsersLoaded(this.reports);
}

/// Error state with an error message
final class UsersError extends UsersState {
  final String message;

  UsersError(this.message);
}

/// State for when a user is banned
final class UserBanned extends UsersState {
  final String userId;

  UserBanned(this.userId);
}

/// State for when a user is unbanned
final class UserUnbanned extends UsersState {
  final String userId;

  UserUnbanned(this.userId);
}