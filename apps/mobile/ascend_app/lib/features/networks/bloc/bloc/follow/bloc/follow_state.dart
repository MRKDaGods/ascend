part of 'follow_bloc.dart';

abstract class FollowState extends Equatable {
  @override
  List<Object?> get props => [];
}

final class FollowInitial extends FollowState {}

final class FollowLoading extends FollowState {}

final class FollowSuccess extends FollowState {
  final List<FollowedUser> following;

  FollowSuccess({required this.following});
}

final class FollowFailure extends FollowState {
  final String message;

  FollowFailure({required this.message});
}
