part of 'connection_preferences_bloc.dart';

abstract class ConnectionPreferencesState extends Equatable {
  @override
  List<Object?> get props => [];
}

final class ConnectionPreferencesInitial extends ConnectionPreferencesState {}

final class ConnectionPreferencesLoading extends ConnectionPreferencesState {}

final class ConnectionPreferencesLoaded extends ConnectionPreferencesState {
  final ConnectionPreferences connectionPreferences;

  ConnectionPreferencesLoaded(this.connectionPreferences);
}

final class ConnectionPreferencesError extends ConnectionPreferencesState {
  final String error;

  ConnectionPreferencesError(this.error);
}
