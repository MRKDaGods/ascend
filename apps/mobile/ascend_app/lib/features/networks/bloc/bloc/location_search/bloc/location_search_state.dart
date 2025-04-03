// location_search_state.dart
part of 'location_search_bloc.dart';

abstract class LocationSearchState extends Equatable {
  const LocationSearchState();

  @override
  List<Object?> get props => [];
}

class LocationSearchInitial extends LocationSearchState {}

class LocationSearchLoading extends LocationSearchState {}

class LocationSearchLoaded extends LocationSearchState {
  final List<LocationModel> locations;
  final LocationModel? selectedLocation;
  final String searchQuery;
  final bool isSearching;

  const LocationSearchLoaded({
    required this.locations,
    this.selectedLocation,
    required this.searchQuery,
    this.isSearching = false,
  });

  @override
  List<Object?> get props => [
    locations,
    selectedLocation,
    searchQuery,
    isSearching,
  ];
}

class LocationSearchError extends LocationSearchState {
  final String message;

  const LocationSearchError({required this.message});

  @override
  List<Object?> get props => [message];
}
