import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/connection_preferences.dart';
import 'package:ascend_app/features/networks/Repositories/connection_preferences_repoistory.dart';

part 'connection_preferences_event.dart';
part 'connection_preferences_state.dart';

class ConnectionPreferencesBloc
    extends Bloc<ConnectionPreferencesEvent, ConnectionPreferencesState> {
  ConnectionPreferencesBloc() : super(ConnectionPreferencesInitial()) {
    on<ConnectionPreferencesLoadEvent>(_ConnectionPreferencesLoadEvent);
    on<ConnectionPreferencesUpdateEvent>(_ConnectionPreferencesUpdateEvent);
  }
  final ConnectionPreferencesRepository _connectionPreferencesRepository =
      ConnectionPreferencesRepository();

  Future<void> _ConnectionPreferencesLoadEvent(
    ConnectionPreferencesLoadEvent event,
    Emitter<ConnectionPreferencesState> emit,
  ) async {
    emit(ConnectionPreferencesLoading());
    try {
      final LoadedConnectionPreferences =
          await _connectionPreferencesRepository.fetchConnectionPreferences();
      emit(ConnectionPreferencesLoaded(LoadedConnectionPreferences));
    } catch (e) {
      emit(ConnectionPreferencesError(e.toString()));
    }
  }

  Future<void> _ConnectionPreferencesUpdateEvent(
    ConnectionPreferencesUpdateEvent event,
    Emitter<ConnectionPreferencesState> emit,
  ) async {
    emit(ConnectionPreferencesLoading());
    try {
      await _connectionPreferencesRepository.setConnectionPreferences(
        event.connectionPreferences,
      );
      emit(ConnectionPreferencesLoaded(event.connectionPreferences));
    } catch (e) {
      emit(ConnectionPreferencesError(e.toString()));
    }
  }
}
