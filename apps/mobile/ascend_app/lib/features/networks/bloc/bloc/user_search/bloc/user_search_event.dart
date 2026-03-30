part of 'user_search_bloc.dart';

abstract class UserSearchEvent extends Equatable {
  const UserSearchEvent();

  @override
  List<Object?> get props => [];
}

class InitializeSearchEvent extends UserSearchEvent {}

class SearchUsersEvent extends UserSearchEvent {
  final String query;
  final int page;
  final int limit;

  const SearchUsersEvent({required this.query, this.page = 1, this.limit = 10});

  @override
  List<Object?> get props => [query, page, limit];
}

class LoadMoreSearchResultsEvent extends UserSearchEvent {
  final String query;
  final int page;
  final int limit;

  const LoadMoreSearchResultsEvent({
    required this.query,
    this.page = 1,
    this.limit = 10,
  });

  @override
  List<Object?> get props => [query, page, limit];
}

class ClearSearchEvent extends UserSearchEvent {}
