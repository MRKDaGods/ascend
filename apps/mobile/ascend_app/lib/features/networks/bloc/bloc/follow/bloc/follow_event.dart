part of 'follow_bloc.dart';

@immutable
sealed class FollowEvent {}

class FetchFollowing extends FollowEvent {}

class FollowUser extends FollowEvent {
  final String userId;
  FollowUser({required this.userId});
}

class UnfollowUser extends FollowEvent {
  final String userId;
  UnfollowUser({required this.userId});
}

class HideUser extends FollowEvent {
  final String userId;
  HideUser({required this.userId});
}
