part of 'block_bloc.dart';

@immutable
sealed class BlockEvent {
  const BlockEvent();
}

class BlockUserEvent extends BlockEvent {
  final String BlockedId;

  const BlockUserEvent(this.BlockedId);
}

class UnblockUserEvent extends BlockEvent {
  final String BlockedId;

  const UnblockUserEvent(this.BlockedId);
}

class FetchBlockedUsersEvent extends BlockEvent {}
