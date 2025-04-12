import 'package:equatable/equatable.dart';
import '../models/user_profile_model.dart';

abstract class UserProfileEvent extends Equatable {
  const UserProfileEvent();
  
  @override
  List<Object?> get props => [];
}

class LoadUserProfile extends UserProfileEvent {
  const LoadUserProfile();
}

class UpdateUserProfile extends UserProfileEvent {
  final UserProfileModel profile;
  
  const UpdateUserProfile(this.profile);
  
  @override
  List<Object?> get props => [profile];
}