import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:ascend_app/features/networks/model/location_model.dart';
import 'package:ascend_app/features/networks/repositories/location_repository.dart';

part 'location_search_event.dart';
part 'location_search_state.dart';

class LocationSearchBloc
    extends Bloc<LocationSearchEvent, LocationSearchState> {
  final LocationRepository _locationRepository;
  static const int _pageSize = 10;

  LocationSearchBloc({LocationRepository? locationRepository})
    : _locationRepository =
          locationRepository ?? LocationRepoisitoryProvider.getRepository(),
      super(LocationSearchInitial()) {
    on<LocationSearchStarted>(_onSearchStarted);
    on<LocationSearchQueryChanged>(_onQueryChanged);
    on<LocationSelected>(_onLocationSelected);
    on<LocationLoadMoreRequested>(_onLoadMoreRequested);
  }

  Future<void> _onSearchStarted(
    LocationSearchStarted event,
    Emitter<LocationSearchState> emit,
  ) async {
    emit(LocationSearchLoading());
    try {
      final locations = await _locationRepository.searchLocations('');
      emit(
        LocationSearchLoaded(
          locations: locations,
          selectedLocation: null,
          searchQuery: '',
          hasReachedMax: locations.length < _pageSize,
          currentPage: 1,
        ),
      );
    } catch (e) {
      emit(LocationSearchError(message: e.toString()));
    }
  }

  Future<void> _onQueryChanged(
    LocationSearchQueryChanged event,
    Emitter<LocationSearchState> emit,
  ) async {
    final currentState = state;

    // Show loading state only for initial search
    if (currentState is! LocationSearchLoaded) {
      emit(LocationSearchLoading());
    } else {
      emit(
        LocationSearchLoaded(
          locations: currentState.locations,
          selectedLocation: currentState.selectedLocation,
          searchQuery: event.query,
          isSearching: true,
          hasReachedMax: false,
          currentPage: 1,
        ),
      );
    }

    try {
      // Reset to page 1 when query changes
      final locations = await _locationRepository.searchLocations(event.query);

      if (!emit.isDone) {
        emit(
          LocationSearchLoaded(
            locations: locations,
            selectedLocation: null,
            searchQuery: event.query,
            isSearching: false,
            hasReachedMax: locations.length < _pageSize,
            currentPage: 1,
          ),
        );
      }
    } catch (e) {
      if (!emit.isDone) {
        emit(LocationSearchError(message: e.toString()));
      }
    }
  }

  Future<void> _onLoadMoreRequested(
    LocationLoadMoreRequested event,
    Emitter<LocationSearchState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocationSearchLoaded &&
        !currentState.isSearching &&
        !currentState.hasReachedMax) {
      try {
        emit(currentState.copyWith(isLoadingMore: true));

        final nextPage = currentState.currentPage + 1;
        final moreLocations = await _locationRepository.searchLocations(
          currentState.searchQuery,
        );

        if (moreLocations.isEmpty) {
          emit(
            currentState.copyWith(hasReachedMax: true, isLoadingMore: false),
          );
        } else {
          emit(
            LocationSearchLoaded(
              locations: [...currentState.locations, ...moreLocations],
              selectedLocation: currentState.selectedLocation,
              searchQuery: currentState.searchQuery,
              isSearching: false,
              hasReachedMax: moreLocations.length < _pageSize,
              currentPage: nextPage,
              isLoadingMore: false,
            ),
          );
        }
      } catch (e) {
        emit(currentState.copyWith(isLoadingMore: false, error: e.toString()));
      }
    }
  }

  void _onLocationSelected(
    LocationSelected event,
    Emitter<LocationSearchState> emit,
  ) {
    final currentState = state;
    if (currentState is LocationSearchLoaded) {
      emit(currentState.copyWith(selectedLocation: event.location));
    }
  }
}
