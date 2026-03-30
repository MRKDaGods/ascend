part of 'follow_bloc.dart';

abstract class FollowEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class FetchFollowing extends FollowEvent {}

class FollowUser extends FollowEvent {
  final String userId;
  FollowUser({required this.userId});

  @override
  List<Object?> get props => [userId];
}

class UnfollowUser extends FollowEvent {
  final String userId;
  UnfollowUser({required this.userId});

  @override
  List<Object?> get props => [userId];
}
