import 'package:ascend_app/features/networks/model/connection_preferences.dart';
import 'package:ascend_app/features/networks/Repositories/connection_preferences_repoistory.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'connection_preferences_event.dart';
part 'connection_preferences_state.dart';

class ConnectionPreferencesBloc
    extends Bloc<ConnectionPreferencesEvent, ConnectionPreferencesState> {
  final ConnectionPreferencesRepository _connectionPreferencesRepository;

  ConnectionPreferencesBloc({
    required ConnectionPreferencesRepository connectionPreferencesRepository,
  }) : _connectionPreferencesRepository = connectionPreferencesRepository,
       super(ConnectionPreferencesInitial()) {
    on<ConnectionPreferencesLoadEvent>(_connectionPreferencesLoadEvent);
    on<ConnectionPreferencesUpdateEvent>(_connectionPreferencesUpdateEvent);
  }

  Future<void> _connectionPreferencesLoadEvent(
    ConnectionPreferencesLoadEvent event,
    Emitter<ConnectionPreferencesState> emit,
  ) async {
    emit(ConnectionPreferencesLoading());
    try {
      final loadedConnectionPreferences =
          await _connectionPreferencesRepository.fetchConnectionPreferences();
      emit(ConnectionPreferencesLoaded(loadedConnectionPreferences));
    } catch (e) {
      emit(ConnectionPreferencesError(e.toString()));
    }
  }

  Future<void> _connectionPreferencesUpdateEvent(
    ConnectionPreferencesUpdateEvent event,
    Emitter<ConnectionPreferencesState> emit,
  ) async {
    emit(ConnectionPreferencesLoading());
    try {
      await _connectionPreferencesRepository.setConnectionPreferences(
        event.connectionPreferences,
      );
      add(ConnectionPreferencesLoadEvent());
    } catch (e) {
      emit(ConnectionPreferencesError(e.toString()));
    }
  }
}
