import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:equatable/equatable.dart';

part 'search_filters_event.dart';
part 'search_filters_state.dart';

class SearchFiltersBloc extends Bloc<SearchFiltersEvent, SearchFiltersState> {
  SearchFiltersBloc() : super(SearchFiltersInitial()) {
    on<SearchFiltersUpdate>(_onSearchFiltersUpdate);
    on<SearchFiltersReset>(_onSearchFiltersReset);
    on<SearchFiltersRemove>(_onSearchFiltersRemove);
    on<SearchFiltersClear>(_onSearchFiltersClear);
    on<SearchFiltersIntialize>(_onSearchFiltersInitialize);
  }

  void _onSearchFiltersUpdate(
    SearchFiltersUpdate event,
    Emitter<SearchFiltersState> emit,
  ) {
    try {
      if (state is SearchFiltersStateLoaded) {
        final SearchModel currFilters =
            (state as SearchFiltersStateLoaded).filters;
        emit(SearchFiltersStateLoading());
        currFilters.updateFilters(event.key, event.value);
        emit(SearchFiltersStateLoaded(filters: currFilters));
      }
    } catch (e) {
      emit(SearchFiltersStateFailed(error: e.toString()));
    }
  }

  void _onSearchFiltersClear(
    SearchFiltersClear event,
    Emitter<SearchFiltersState> emit,
  ) {
    emit(SearchFiltersStateLoading());
    try {
      final SearchModel currFilters =
          (state as SearchFiltersStateLoaded).filters;
      currFilters.clearFilters(event.key);
      emit(SearchFiltersStateLoaded(filters: currFilters));
    } catch (e) {
      emit(SearchFiltersStateFailed(error: e.toString()));
    }
  }

  void _onSearchFiltersReset(
    SearchFiltersReset event,
    Emitter<SearchFiltersState> emit,
  ) {
    try {
      if (state is SearchFiltersStateLoaded) {
        final SearchModel currFilters =
            (state as SearchFiltersStateLoaded).filters;
        emit(SearchFiltersStateLoading());
        currFilters.resetFilters();
        emit(SearchFiltersStateLoaded(filters: currFilters));
      }
    } catch (e) {
      emit(SearchFiltersStateFailed(error: e.toString()));
    }
  }

  void _onSearchFiltersRemove(
    SearchFiltersRemove event,
    Emitter<SearchFiltersState> emit,
  ) {
    emit(SearchFiltersStateLoading());
    try {
      if (state is SearchFiltersStateLoaded) {
        final SearchModel currFilters =
            (state as SearchFiltersStateLoaded).filters;
        emit(SearchFiltersStateLoading());
        currFilters.removeFilter(event.key, event.value);
        emit(SearchFiltersStateLoaded(filters: currFilters));
      }
    } catch (e) {
      emit(SearchFiltersStateFailed(error: e.toString()));
    }
  }

  void _onSearchFiltersInitialize(
    SearchFiltersIntialize event,
    Emitter<SearchFiltersState> emit,
  ) {
    emit(SearchFiltersStateLoading());
    try {
      emit(SearchFiltersStateLoading());
      final SearchModel initialFilters = SearchModel.defaultModel();
      emit(SearchFiltersStateLoaded(filters: initialFilters));
    } catch (e) {
      emit(SearchFiltersStateFailed(error: e.toString()));
    }
  }
}
