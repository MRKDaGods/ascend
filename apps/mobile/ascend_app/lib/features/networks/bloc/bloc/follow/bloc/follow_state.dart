part of 'follow_bloc.dart';

@immutable
sealed class FollowState {}

final class FollowInitial extends FollowState {}

final class FollowLoading extends FollowState {}

final class FollowSuccess extends FollowState {
  final List<FollowModel> following;

  FollowSuccess({required this.following});
}

final class FollowFailure extends FollowState {
  final String message;

  FollowFailure({required this.message});
}
