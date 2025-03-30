part of 'search_filters_bloc.dart';

@immutable
sealed class SearchFiltersState extends Equatable {
  const SearchFiltersState();

  @override
  List<Object?> get props => [];
}

final class SearchFiltersStateLoaded extends SearchFiltersState {
  final SearchModel filters;

  const SearchFiltersStateLoaded({required this.filters});

  // Copy the state while updating filters
  SearchFiltersStateLoaded copyWith({SearchModel? filters}) {
    return SearchFiltersStateLoaded(filters: filters ?? this.filters);
  }

  @override
  List<Object?> get props => [filters];
}

final class SearchFiltersStateFailed extends SearchFiltersState {
  final String error;
  const SearchFiltersStateFailed({required this.error});
}

final class SearchFiltersStateLoading extends SearchFiltersState {
  const SearchFiltersStateLoading();
}

final class SearchFiltersInitial extends SearchFiltersState {}
