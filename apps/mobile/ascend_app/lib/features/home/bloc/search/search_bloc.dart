import 'package:ascend_app/features/home/repositories/search_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import 'package:meta/meta.dart';
import 'package:bloc_concurrency/bloc_concurrency.dart'; // Import for transformer

part 'search_event.dart';
part 'search_state.dart';

const _throttleDuration = Duration(milliseconds: 300);

class SearchBloc extends Bloc<SearchEvent, SearchState> {
  final SearchRepository searchRepository;

  SearchBloc({required this.searchRepository}) : super(SearchInitial()) {
    on<PerformSearch>(
      _onPerformSearch,
      transformer: droppable(), // Use droppable to prevent concurrent searches
    );
    on<ClearSearch>(_onClearSearch);
  }

  // Extract a unique identifier from a search result item
  String _getItemId(dynamic item) {
    if (item is Map<String, dynamic>) {
      // For user type results
      if (item['type'] == 'user' && item['data'] != null) {
        return 'user_${item['data']['id']}';
      }
      // For post type results
      else if (item['type'] == 'post' && item['data'] != null) {
        return 'post_${item['data']['id']}';
      }
      // For job type results (if added in future)
      else if (item['type'] == 'job' && item['data'] != null) {
        return 'job_${item['data']['id']}';
      }
    }
    // Fallback to using the hashCode when no clear ID is available
    return item.hashCode.toString();
  }

  Future<void> _onPerformSearch(
    PerformSearch event,
    Emitter<SearchState> emit,
  ) async {
    // If query is empty, clear results or show initial state
    if (event.query.isEmpty) {
      emit(SearchInitial());
      return;
    }

    final currentState = state;
    // If it's a new search (offset 0), show loading indicator
    if (event.offset == 0) {
      emit(SearchLoading());
    }
    // If loading more, keep existing results while fetching
    else if (currentState is SearchLoaded) {
      // Optionally emit a state indicating more results are loading
      // emit(currentState.copyWith(isLoadingMore: true)); // Need to add isLoadingMore to state
    }

    try {
      final newResults = await searchRepository.searchUltimate(
        query: event.query,
        limit: event.limit,
        offset: event.offset,
      );

      if (currentState is SearchLoaded && event.offset > 0) {
        // Create a set of existing IDs to track duplicates
        final existingIds = currentState.results.map(_getItemId).toSet();
        
        // Filter out duplicates from new results
        final uniqueNewResults = newResults.where(
          (item) => !existingIds.contains(_getItemId(item))
        ).toList();
        
        // Append only unique new results
        emit(
          currentState.copyWith(
            results: currentState.results + uniqueNewResults,
            hasReachedMax: newResults.isEmpty, // Assume end if API returns empty
            currentQuery: event.query,
            currentOffset: event.offset,
          ),
        );
      } else {
        // For new searches, just use the results as is
        emit(
          SearchLoaded(
            results: newResults,
            hasReachedMax: newResults.length < event.limit, // Check if less than limit
            currentQuery: event.query,
            currentOffset: event.offset,
          ),
        );
      }
    } catch (e) {
      emit(SearchError(e.toString()));
    }
  }

  void _onClearSearch(ClearSearch event, Emitter<SearchState> emit) {
    emit(SearchInitial());
  }
}
