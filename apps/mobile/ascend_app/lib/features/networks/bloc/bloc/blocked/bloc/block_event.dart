part of 'block_bloc.dart';

abstract class BlockEvent extends Equatable {
  const BlockEvent();

  @override
  List<Object?> get props => [];
}

class BlockUserEvent extends BlockEvent {
  final String blockedId;

  const BlockUserEvent(this.blockedId);

  @override
  List<Object?> get props => [blockedId];
}

class UnblockUserEvent extends BlockEvent {
  final String blockedId;

  const UnblockUserEvent(this.blockedId);

  @override
  List<Object?> get props => [blockedId];
}

class FetchBlockedUsersEvent extends BlockEvent {}
