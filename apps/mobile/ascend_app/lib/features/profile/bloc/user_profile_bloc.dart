import 'package:flutter_bloc/flutter_bloc.dart';
import '../data/mock_user_profile.dart';
import 'user_profile_event.dart';
import 'user_profile_state.dart';

class UserProfileBloc extends Bloc<UserProfileEvent, UserProfileState> {
  UserProfileBloc() : super(UserProfileInitial()) {
    on<LoadUserProfile>(_onLoadUserProfile);
    on<UpdateUserProfile>(_onUpdateUserProfile);
  }

  void _onLoadUserProfile(LoadUserProfile event, Emitter<UserProfileState> emit) async {
    emit(UserProfileLoading());
    try {
      // In a real app, you would fetch from API or local storage
      // For now, we'll use the mock data
      final profile = MockUserProfile.getMockProfile();
      emit(UserProfileLoaded(profile));
    } catch (e) {
      emit(UserProfileError('Failed to load user profile: ${e.toString()}'));
    }
  }

  void _onUpdateUserProfile(UpdateUserProfile event, Emitter<UserProfileState> emit) {
    try {
      emit(UserProfileLoaded(event.profile));
    } catch (e) {
      emit(UserProfileError('Failed to update user profile: ${e.toString()}'));
    }
  }
}