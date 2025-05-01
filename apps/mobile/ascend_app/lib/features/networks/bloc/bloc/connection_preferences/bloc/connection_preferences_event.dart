part of 'connection_preferences_bloc.dart';

@immutable
sealed class ConnectionPreferencesEvent {}

final class ConnectionPreferencesLoadEvent extends ConnectionPreferencesEvent {
  ConnectionPreferencesLoadEvent();
}

final class ConnectionPreferencesUpdateEvent
    extends ConnectionPreferencesEvent {
  final ConnectionPreferences connectionPreferences;

  ConnectionPreferencesUpdateEvent(this.connectionPreferences);
}
