part of 'block_bloc.dart';

@immutable
sealed class BlockState {}

final class BlockInitial extends BlockState {}

final class BlockLoading extends BlockState {}

final class BlockedUsersLoaded extends BlockState {
  final List<BlockedUser> blockedUsers;

  BlockedUsersLoaded(this.blockedUsers);
}

final class BlockedUserError extends BlockState {
  final String errorMessage;

  BlockedUserError(this.errorMessage);
}
