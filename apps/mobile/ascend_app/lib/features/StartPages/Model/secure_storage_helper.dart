import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageHelper {
  static const _storage = FlutterSecureStorage();

  // Keys for storing data
  static const String _emailKey = 'email';
  static const String _authTokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const _firstTimeKey = 'isFirstTimeUser';

  // Save email
  static Future<void> saveEmail(String email) async {
    await _storage.write(key: _emailKey, value: email);
  }

  // Save auth token
  static Future<void> saveAuthToken(String token) async {
    await _storage.write(key: _authTokenKey, value: token);
  }

  // Save user ID or name
  static Future<void> saveUserId(String userId) async {
    await _storage.write(key: _userIdKey, value: userId);
  }

  // Retrieve email
  static Future<String?> getEmail() async {
    return await _storage.read(key: _emailKey);
  }

  // Retrieve auth token
  static Future<String?> getAuthToken() async {
    return await _storage.read(key: _authTokenKey);
  }

  // Retrieve user ID or name
  static Future<String?> getUserId() async {
    return await _storage.read(key: _userIdKey);
  }

  // Check if user is first time
  static Future<bool> isFirstTimeUser() async {
    final isFirstTime = await _storage.read(key: _firstTimeKey);
    return isFirstTime == null || isFirstTime == 'true';
  }

  // Set first time user flag
  static Future<void> setFirstTimeUser(bool value) async {
    await _storage.write(key: _firstTimeKey, value: value.toString());
  }

  // Clear all stored data
  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
