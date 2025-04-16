// ignore_for_file: constant_identifier_names

import 'dart:io';

import 'package:dummy_cross/src/rust/bindings/ffi.dart';
import 'package:dummy_cross/src/rust/models/notification.dart';
import 'package:dummy_cross/src/rust/models/profile.dart';
import 'package:dummy_cross/src/rust/services/auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

const API_URL_DEV = "http://10.0.2.2:8080";
const API_URL_PROD = "http://api.ascendx.tech";

final _api = FfiApiClient(baseUrl: API_URL_DEV);
late final SharedPreferences _prefs;

class ApiClient {
  static final AuthService _auth = AuthService();
  static AuthService get auth => _auth;

  static final UserService _user = UserService();
  static UserService get user => _user;

  static final NotificationService _notification = NotificationService();
  static NotificationService get notification => _notification;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();

    // Set auth token if available
    final token = _prefs.getString("auth_token");
    if (token != null) {
      _api.setAuthToken(token: token);
    }
  }
}

class AuthService {
  Future<LoginResponse> login(String email, String password) async {
    final response = await _api.login(email: email, password: password);

    // Set token
    _prefs.setString("auth_token", response.token);
    _api.setAuthToken(token: response.token);
    return response;
  }

  Future<RegisterResponse> register(
    String firstName,
    String lastName,
    String email,
    String password,
  ) async {
    return _api.register(
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    );
  }

  Future<void> resendConfirmationEmail(String email) async {
    return _api.resendConfirmEmail(email: email);
  }

  Future<void> updatePassword(String oldPassword, String newPassword) async {
    return _api.updatePassword(
      oldPassword: oldPassword,
      newPassword: newPassword,
    );
  }

  Future<void> updateEmail(String newEmail) async {
    return _api.updateEmail(newEmail: newEmail);
  }

  Future<void> forgetPassword(String email) async {
    return _api.forgetPassword(email: email);
  }

  Future<void> resetPassword(String token, String newPassword) async {
    return _api.resetPassword(token: token, newPassword: newPassword);
  }

  Future<void> deleteAccount() async {
    return _api.deleteAccount();
  }

  Future<void> logout() async {
    _prefs.remove("auth_token");
    return _api.logout();
  }
}

class UserService {
  Future<Profile> getLocalUserProfile() async {
    return _api.getLocalUserProfile();
  }

  Future<Profile> updateLocalUserProfile(Profile profile) async {
    return _api.updateLocalUserProfile(profile: profile);
  }

  Future<Profile> uploadProfilePicture(File file) async {
    final name = file.path.split('/').last;
    final mime = _getMimeType(name);
    final buffer = await file.readAsBytes();

    return _api.uploadProfilePicture(name: name, mime: mime, buffer: buffer);
  }

  Future<Profile> deleteProfilePicture() async {
    return _api.deleteProfilePicture();
  }

  Future<Profile> uploadCoverPhoto(File file) async {
    final name = file.path.split('/').last;
    final mime = _getMimeType(name);
    final buffer = await file.readAsBytes();

    return _api.uploadCoverPhoto(name: name, mime: mime, buffer: buffer);
  }

  Future<Profile> deleteCoverPhoto() async {
    return _api.deleteCoverPhoto();
  }

  Future<Profile> uploadResume(File file) async {
    final name = file.path.split('/').last;
    final mime = _getMimeType(name);
    final buffer = await file.readAsBytes();

    return _api.uploadResume(name: name, mime: mime, buffer: buffer);
  }

  Future<Profile> deleteResume() async {
    return _api.deleteResume();
  }
}

class NotificationService {
  Future<List<Notification>> getNotifications(int? page) async {
    return _api.getNotifications(page: page);
  }

  Future<void> markNotificationAsRead(int notificationId) async {
    return _api.markNotificationAsRead(notificationId: notificationId);
  }

  Future<void> deleteNotification(int notificationId) async {
    return _api.deleteNotification(notificationId: notificationId);
  }
}

String _getMimeType(String fileName) {
  final extension = fileName.split('.').last.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}
