// search_filters_event.dart
part of 'search_filters_bloc.dart';

abstract class SearchFiltersEvent extends Equatable {
  const SearchFiltersEvent();

  @override
  List<Object?> get props => [];
}

// Event to update a filter
class SearchFiltersUpdate extends SearchFiltersEvent {
  final String key;
  final dynamic value;

  const SearchFiltersUpdate({required this.key, required this.value});

  @override
  List<Object?> get props => [key, value];
}

// Event to remove a specific filter value
class SearchFiltersRemove extends SearchFiltersEvent {
  final String key;
  final dynamic value;

  const SearchFiltersRemove({required this.key, required this.value});

  @override
  List<Object?> get props => [key, value];
}

// Event to clear an entire filter category
class SearchFiltersClear extends SearchFiltersEvent {
  final String key;

  const SearchFiltersClear({required this.key});

  @override
  List<Object?> get props => [key];
}

// Event to reset all filters
class SearchFiltersReset extends SearchFiltersEvent {}

// Event to fetch current filters
class SearchFiltersFetch extends SearchFiltersEvent {}
