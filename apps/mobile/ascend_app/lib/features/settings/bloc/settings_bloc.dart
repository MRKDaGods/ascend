import 'package:flutter_bloc/flutter_bloc.dart';
import 'settings_event.dart';
import 'settings_state.dart';

class SettingsBloc extends Bloc<SettingsEvent, SettingsState> {
  SettingsBloc() : super(SettingsInitial()) {
    on<LoadSettings>((event, emit) async {
      emit(SettingsLoading());
      try {
        // Simulate loading settings
        await Future.delayed(const Duration(seconds: 2));
        emit(SettingsLoaded());
      } catch (e) {
        emit(SettingsError('Failed to load settings'));
      }
    });
  }
}