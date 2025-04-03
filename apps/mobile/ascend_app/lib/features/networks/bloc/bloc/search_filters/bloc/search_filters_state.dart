part of 'search_filters_bloc.dart';

abstract class SearchFiltersState extends Equatable {
  const SearchFiltersState();

  @override
  List<Object?> get props => [];
}

class SearchFiltersInitial extends SearchFiltersState {}

class SearchFiltersLoading extends SearchFiltersState {}

class SearchFiltersLoaded extends SearchFiltersState {
  final SearchModel filters;

  const SearchFiltersLoaded({required this.filters});

  @override
  List<Object?> get props => [filters];
}

class SearchFiltersError extends SearchFiltersState {
  final String error;

  const SearchFiltersError({required this.error});

  @override
  List<Object?> get props => [error];
}
