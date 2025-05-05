part of 'search_bloc.dart';

@immutable
sealed class SearchEvent extends Equatable {
  const SearchEvent();

  @override
  List<Object?> get props => [];
}

class PerformSearch extends SearchEvent {
  final String query;
  final int limit;
  final int offset;

  const PerformSearch({
    required this.query,
    this.limit = 10,
    this.offset = 0,
  });

  @override
  List<Object?> get props => [query, limit, offset];
}

class ClearSearch extends SearchEvent {}
