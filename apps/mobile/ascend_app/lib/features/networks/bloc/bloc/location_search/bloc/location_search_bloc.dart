import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:ascend_app/features/networks/model/location_model.dart';
import 'package:ascend_app/features/networks/repositories/location_repository.dart';

part 'location_search_event.dart';
part 'location_search_state.dart';

class LocationSearchBloc
    extends Bloc<LocationSearchEvent, LocationSearchState> {
  final LocationRepository _locationRepository;

  LocationSearchBloc({LocationRepository? locationRepository})
    : _locationRepository =
          locationRepository ?? LocationRepositoryProvider.getRepository(),
      super(LocationSearchInitial()) {
    on<LocationSearchStarted>(_onSearchStarted);
    on<LocationSearchQueryChanged>(_onQueryChanged);
    on<LocationSelected>(_onLocationSelected);
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
        ),
      );
    }

    try {
      final locations = await _locationRepository.searchLocations(event.query);

      if (!emit.isDone) {
        emit(
          LocationSearchLoaded(
            locations: locations,
            selectedLocation: null,
            searchQuery: event.query,
            isSearching: false,
          ),
        );
      }
    } catch (e) {
      if (!emit.isDone) {
        emit(LocationSearchError(message: e.toString()));
      }
    }
  }

  void _onLocationSelected(
    LocationSelected event,
    Emitter<LocationSearchState> emit,
  ) {
    final currentState = state;
    if (currentState is LocationSearchLoaded) {
      emit(
        LocationSearchLoaded(
          locations: currentState.locations,
          selectedLocation: event.location,
          searchQuery: currentState.searchQuery,
        ),
      );
    }
  }
}
