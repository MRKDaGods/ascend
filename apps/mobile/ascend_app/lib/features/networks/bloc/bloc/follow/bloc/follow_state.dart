part of 'follow_bloc.dart';

@immutable
sealed class FollowState {}

final class FollowInitial extends FollowState {}

final class FollowLoading extends FollowState {}

final class FollowSuccess extends FollowState {
  final List<FollowedUser> following;
  final List<UserSuggestedtoFollow> suggestedUsers;

  FollowSuccess({required this.following, required this.suggestedUsers});
}

final class FollowFailure extends FollowState {
  final String message;

  FollowFailure({required this.message});
}
