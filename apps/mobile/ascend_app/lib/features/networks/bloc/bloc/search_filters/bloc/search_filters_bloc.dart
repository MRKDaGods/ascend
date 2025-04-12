import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/repositories/search_filter_repository.dart';

part 'search_filters_event.dart';
part 'search_filters_state.dart';

class SearchFiltersBloc extends Bloc<SearchFiltersEvent, SearchFiltersState> {
  final SearchFilterRepository _repository;

  SearchFiltersBloc({SearchFilterRepository? repository})
    : _repository =
          repository ?? SearchFilterRepositoryProvider.getRepository(),
      super(SearchFiltersInitial()) {
    on<SearchFiltersUpdate>(_onUpdate);
    on<SearchFiltersRemove>(_onRemove);
    on<SearchFiltersClear>(_onClear);
    on<SearchFiltersReset>(_onReset);
    on<SearchFiltersFetch>(_onFetch);
  }

  // Handle updating a filter - without debounce timer
  Future<void> _onUpdate(
    SearchFiltersUpdate event,
    Emitter<SearchFiltersState> emit,
  ) async {
    try {
      emit(SearchFiltersLoading());

      final updatedFilters = await _repository.updateFilter(
        key: event.key,
        value: event.value,
      );

      if (!emit.isDone) {
        emit(SearchFiltersLoaded(filters: updatedFilters));
      }
    } catch (e) {
      if (!emit.isDone) {
        emit(SearchFiltersError(error: e.toString()));
      }
    }
  }

  // Handle removing a filter
  Future<void> _onRemove(
    SearchFiltersRemove event,
    Emitter<SearchFiltersState> emit,
  ) async {
    try {
      emit(SearchFiltersLoading());

      final updatedFilters = await _repository.removeFilter(
        key: event.key,
        value: event.value,
      );

      if (!emit.isDone) {
        emit(SearchFiltersLoaded(filters: updatedFilters));
      }
    } catch (e) {
      if (!emit.isDone) {
        emit(SearchFiltersError(error: e.toString()));
      }
    }
  }

  // Handle clearing a specific filter
  Future<void> _onClear(
    SearchFiltersClear event,
    Emitter<SearchFiltersState> emit,
  ) async {
    try {
      emit(SearchFiltersLoading());

      final updatedFilters = await _repository.clearFilter(event.key);

      if (!emit.isDone) {
        emit(SearchFiltersLoaded(filters: updatedFilters));
      }
    } catch (e) {
      if (!emit.isDone) {
        emit(SearchFiltersError(error: e.toString()));
      }
    }
  }

  // Handle resetting all filters
  Future<void> _onReset(
    SearchFiltersReset event,
    Emitter<SearchFiltersState> emit,
  ) async {
    try {
      emit(SearchFiltersLoading());

      final emptyFilters = await _repository.resetFilters();

      if (!emit.isDone) {
        emit(SearchFiltersLoaded(filters: emptyFilters));
      }
    } catch (e) {
      if (!emit.isDone) {
        emit(SearchFiltersError(error: e.toString()));
      }
    }
  }

  // Handle fetching current filters
  void _onFetch(SearchFiltersFetch event, Emitter<SearchFiltersState> emit) {
    try {
      final currentFilters = _repository.getFilters();

      if (!emit.isDone) {
        emit(SearchFiltersLoaded(filters: currentFilters));
      }
    } catch (e) {
      if (!emit.isDone) {
        emit(SearchFiltersError(error: e.toString()));
      }
    }
  }
}
