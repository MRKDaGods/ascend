part of 'block_bloc.dart';

@immutable
sealed class BlockState {}

final class BlockInitial extends BlockState {}

final class BlockLoading extends BlockState {}

final class BlockSuccess extends BlockState {
  final List<UserModel> blockedUsers;

  BlockSuccess(this.blockedUsers);
}

final class BlockFailure extends BlockState {
  final String error;

  BlockFailure(this.error);
}
