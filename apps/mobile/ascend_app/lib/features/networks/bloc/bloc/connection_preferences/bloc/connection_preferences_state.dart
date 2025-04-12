part of 'connection_preferences_bloc.dart';

@immutable
sealed class ConnectionPreferencesState {}

final class ConnectionPreferencesInitial extends ConnectionPreferencesState {}

final class ConnectionPreferencesLoading extends ConnectionPreferencesState {}

final class ConnectionPreferencesLoaded extends ConnectionPreferencesState {
  ConnectionPreferences connectionPreferences;

  ConnectionPreferencesLoaded(this.connectionPreferences);
}

final class ConnectionPreferencesError extends ConnectionPreferencesState {
  final String error;

  ConnectionPreferencesError(this.error);
}
