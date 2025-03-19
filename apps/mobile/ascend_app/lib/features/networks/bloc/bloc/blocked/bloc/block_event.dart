part of 'block_bloc.dart';

@immutable
sealed class BlockEvent {}

final class BlockUser extends BlockEvent {
  final String Id;

  BlockUser(this.Id);
}

final class UnblockUser extends BlockEvent {
  final String Id;

  UnblockUser(this.Id);
}
