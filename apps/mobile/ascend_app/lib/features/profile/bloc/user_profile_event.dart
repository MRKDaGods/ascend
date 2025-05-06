import 'package:ascend_app/shared/models/profile.dart';
import 'package:equatable/equatable.dart';

abstract class UserProfileEvent extends Equatable {
  const UserProfileEvent();

  @override
  List<Object?> get props => [];
}

class LoadUserProfile extends UserProfileEvent {
  const LoadUserProfile();
}

class UpdateUserProfile extends UserProfileEvent {
  final Profile profile;

  const UpdateUserProfile(this.profile);

  @override
  List<Object?> get props => [profile];
}
