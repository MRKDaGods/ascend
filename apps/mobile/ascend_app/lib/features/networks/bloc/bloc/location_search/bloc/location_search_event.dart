// location_search_event.dart
part of 'location_search_bloc.dart';

abstract class LocationSearchEvent extends Equatable {
  const LocationSearchEvent();

  @override
  List<Object?> get props => [];
}

class LocationSearchStarted extends LocationSearchEvent {}

class LocationSearchQueryChanged extends LocationSearchEvent {
  final String query;

  const LocationSearchQueryChanged(this.query);

  @override
  List<Object?> get props => [query];
}

class LocationSelected extends LocationSearchEvent {
  final LocationModel location;

  const LocationSelected(this.location);

  @override
  List<Object?> get props => [location];
}
