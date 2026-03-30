import 'package:flutter/material.dart';
import '../models/user_profile_model.dart';

class UserProfileProvider with ChangeNotifier {
  UserProfileModel _userProfile = UserProfileModel.empty();
  
  UserProfileModel get userProfile => _userProfile;
  
  void updateUserProfile(UserProfileModel newProfile) {
    _userProfile = newProfile;
    notifyListeners();
  }
}