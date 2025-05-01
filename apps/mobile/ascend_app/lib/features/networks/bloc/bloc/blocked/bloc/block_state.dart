part of 'block_bloc.dart';

abstract class BlockState extends Equatable {
  @override
  List<Object?> get props => [];
}

final class BlockInitial extends BlockState {}

final class BlockLoading extends BlockState {}

final class BlockedUsersLoaded extends BlockState {
  final List<BlockedUser> blockedUsers;

  BlockedUsersLoaded(this.blockedUsers);

  @override
  List<Object?> get props => [blockedUsers];
}

final class BlockedUserError extends BlockState {
  final String errorMessage;

  BlockedUserError(this.errorMessage);

  @override
  List<Object?> get props => [errorMessage];
}
