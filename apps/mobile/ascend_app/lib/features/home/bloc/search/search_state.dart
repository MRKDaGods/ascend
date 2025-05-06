part of 'search_bloc.dart';

@immutable
sealed class SearchState extends Equatable {
  const SearchState();

  @override
  List<Object?> get props => [];
}

final class SearchInitial extends SearchState {}

final class SearchLoading extends SearchState {}

final class SearchLoaded extends SearchState {
  // Use List<dynamic> for now, replace with specific models later
  final List<dynamic> results;
  final bool hasReachedMax;
  final String currentQuery;
  final int currentOffset;

  const SearchLoaded({
    required this.results,
    this.hasReachedMax = false,
    required this.currentQuery,
    required this.currentOffset,
  });

  SearchLoaded copyWith({
    List<dynamic>? results,
    bool? hasReachedMax,
    String? currentQuery,
    int? currentOffset,
  }) {
    return SearchLoaded(
      results: results ?? this.results,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
      currentQuery: currentQuery ?? this.currentQuery,
      currentOffset: currentOffset ?? this.currentOffset,
    );
  }

  @override
  List<Object?> get props =>
      [results, hasReachedMax, currentQuery, currentOffset];
}

final class SearchError extends SearchState {
  final String message;

  const SearchError(this.message);

  @override
  List<Object?> get props => [message];
}
