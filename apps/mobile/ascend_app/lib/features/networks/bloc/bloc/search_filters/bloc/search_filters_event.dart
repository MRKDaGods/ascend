part of 'search_filters_bloc.dart';

@immutable
sealed class SearchFiltersEvent extends Equatable {
  const SearchFiltersEvent();

  @override
  List<Object?> get props => [];
}

final class SearchFiltersUpdate extends SearchFiltersEvent {
  final String key;
  final dynamic value;

  const SearchFiltersUpdate({required this.key, required this.value});

  @override
  List<Object?> get props => [key, value];
}

final class SearchFiltersReset extends SearchFiltersEvent {
  const SearchFiltersReset();

  @override
  List<Object?> get props => [];
}

final class SearchFiltersRemove extends SearchFiltersEvent {
  final String key;
  final dynamic value;

  const SearchFiltersRemove({required this.key, required this.value});

  @override
  List<Object?> get props => [key, value];
}

final class SearchFiltersClear extends SearchFiltersEvent {
  final String key;
  const SearchFiltersClear({required this.key});

  @override
  List<Object?> get props => [key];
}

final class SearchFiltersIntialize extends SearchFiltersEvent {
  const SearchFiltersIntialize();

  @override
  List<Object?> get props => [];
}
