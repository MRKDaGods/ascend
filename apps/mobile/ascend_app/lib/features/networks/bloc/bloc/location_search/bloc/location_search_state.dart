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
  final bool hasReachedMax;
  final int currentPage;
  final bool isLoadingMore;
  final String? error;

  const LocationSearchLoaded({
    required this.locations,
    this.selectedLocation,
    required this.searchQuery,
    this.isSearching = false,
    this.hasReachedMax = false,
    this.currentPage = 1,
    this.isLoadingMore = false,
    this.error,
  });

  LocationSearchLoaded copyWith({
    List<LocationModel>? locations,
    LocationModel? selectedLocation,
    String? searchQuery,
    bool? isSearching,
    bool? hasReachedMax,
    int? currentPage,
    bool? isLoadingMore,
    String? error,
  }) {
    return LocationSearchLoaded(
      locations: locations ?? this.locations,
      selectedLocation: selectedLocation ?? this.selectedLocation,
      searchQuery: searchQuery ?? this.searchQuery,
      isSearching: isSearching ?? this.isSearching,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
      currentPage: currentPage ?? this.currentPage,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error ?? this.error,
    );
  }

  @override
  List<Object?> get props => [
    locations,
    selectedLocation,
    searchQuery,
    isSearching,
    hasReachedMax,
    currentPage,
    isLoadingMore,
    error,
  ];
}

class LocationSearchError extends LocationSearchState {
  final String message;

  const LocationSearchError({required this.message});

  @override
  List<Object?> get props => [message];
}
