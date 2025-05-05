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
      final results = await searchRepository.searchUltimate(
        query: event.query,
        limit: event.limit,
        offset: event.offset,
      );

      if (currentState is SearchLoaded && event.offset > 0) {
        // Append results if loading more
        emit(
          currentState.copyWith(
            results: currentState.results + results,
            hasReachedMax: results.isEmpty, // Assume end if API returns empty
            currentQuery: event.query,
            currentOffset: event.offset,
            // isLoadingMore: false, // Reset loading more indicator
          ),
        );
      } else {
        // Replace results for a new search
        emit(
          SearchLoaded(
            results: results,
            hasReachedMax: results.length < event.limit, // Check if less than limit
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
