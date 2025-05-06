import 'dart:convert';

import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'user_profile_event.dart';
import 'user_profile_state.dart';

class UserProfileBloc extends Bloc<UserProfileEvent, UserProfileState> {
  Profile? profile;

  UserProfileBloc() : super(UserProfileInitial()) {
    on<LoadUserProfile>(_onLoadUserProfile);
    on<UpdateUserProfile>(_onUpdateUserProfile);
  }

  void _onLoadUserProfile(
    LoadUserProfile event,
    Emitter<UserProfileState> emit,
  ) async {
    emit(UserProfileLoading());
    try {
      debugPrint("XMRK Loading user profile...");
      final res = await sl.apiClient.get("/user/profile");
      final profile = Profile.fromJson(jsonDecode(res.body));
      debugPrint("XMRK User profile loaded: ${profile.toJson()}");

      emit(UserProfileLoaded(profile));
    } catch (e) {
      profile = null;
      emit(UserProfileError('Failed to load user profile: ${e.toString()}'));
    }
  }

  void _onUpdateUserProfile(
    UpdateUserProfile event,
    Emitter<UserProfileState> emit,
  ) async {
    try {
      emit(UserProfileLoading());

      // Filter null values from the profile object
      final profileAsJson = event.profile.toJson();

      // Initial pass
      profileAsJson.removeWhere(
        (key, value) => value == null || key.endsWith("_url"),
      );

      processJsonVal(dynamic value) {
        if (value is Map) {
          value.removeWhere((k, v) => v == null);
          value.forEach((k, v) => processJsonVal(v));
        } else if (value is List) {
          value.removeWhere((v) => v == null);
          for (var v in value) {
            processJsonVal(v);
          }
        }
      }

      // remove nulls recursively
      profileAsJson.forEach((key, val) => processJsonVal(val));

      debugPrint("XMRK Updating user profile: $profileAsJson");

      final res = await sl.apiClient.put("/user/profile", data: profileAsJson);
      final updatedProfile = Profile.fromJson(jsonDecode(res.body));
      debugPrint("XMRK User profile updated: ${updatedProfile.toJson()}");

      profile = updatedProfile;
      emit(UserProfileLoaded(updatedProfile));
    } catch (e) {
      emit(UserProfileError('Failed to update user profile: ${e.toString()}'));
    }
  }
}
