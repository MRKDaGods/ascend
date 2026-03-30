part of 'connection_preferences_bloc.dart';

abstract class ConnectionPreferencesEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

final class ConnectionPreferencesLoadEvent extends ConnectionPreferencesEvent {
  ConnectionPreferencesLoadEvent();
  @override
  List<Object?> get props => [];
}

final class ConnectionPreferencesUpdateEvent
    extends ConnectionPreferencesEvent {
  final ConnectionPreferences connectionPreferences;

  ConnectionPreferencesUpdateEvent(this.connectionPreferences);
}
