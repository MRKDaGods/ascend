import 'package:equatable/equatable.dart';
import '../models/user_profile_model.dart';

abstract class UserProfileState extends Equatable {
  const UserProfileState();
  
  @override
  List<Object?> get props => [];
}

class UserProfileInitial extends UserProfileState {}

class UserProfileLoading extends UserProfileState {}

class UserProfileLoaded extends UserProfileState {
  final UserProfileModel profile;
  
  const UserProfileLoaded(this.profile);
  
  @override
  List<Object?> get props => [profile];
}

class UserProfileError extends UserProfileState {
  final String message;
  
  const UserProfileError(this.message);
  
  @override
  List<Object?> get props => [message];
}