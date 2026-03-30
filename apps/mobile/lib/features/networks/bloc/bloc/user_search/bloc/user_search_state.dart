part of 'user_search_bloc.dart';

abstract class UserSearchState extends Equatable {
  const UserSearchState();

  @override
  List<Object?> get props => [];
}

class UserSearchInitial extends UserSearchState {}

class UserSearchLoading extends UserSearchState {}

class UserSearchLoaded extends UserSearchState {
  final List<LoadedUserProfile> users;
  final bool canLoadMore;

  const UserSearchLoaded({required this.users, this.canLoadMore = true});

  @override
  List<Object?> get props => [users, canLoadMore];
}

class UserSearchError extends UserSearchState {
  final String message;

  const UserSearchError(this.message);

  @override
  List<Object?> get props => [message];
}
