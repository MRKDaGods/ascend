import 'package:hive/hive.dart';
import 'package:logger/logger.dart';

class SecureStorageHelper {
  static const String _boxName = 'secureStorageBox';

  // Keys for storing data
  static const String _emailKey = 'email';
  static const String _authTokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _firstTimeKey = 'isFirstTimeUser';
  static const String _rememberMeKey = 'remember_me';

  static final Logger _logger = Logger(
    printer: PrettyPrinter(), // Ensures logs are formatted and visible
  );

  // Initialize Hive box
  static Future<Box> _getBox() async {
    return await Hive.openBox(_boxName);
  }

  // Save email
  static Future<void> saveEmail(String email) async {
    final box = await _getBox();
    await box.put(_emailKey, email);
    _logger.i('Email saved: $email');
  }

  // Retrieve email
  static Future<String?> getEmail() async {
    final box = await _getBox();
    final email = box.get(_emailKey);
    _logger.i('Email retrieved: $email');
    return email;
  }

  // Save auth token
  static Future<void> setAuthToken(String token) async {
    final box = await _getBox();
    await box.put(_authTokenKey, token);
    _logger.i('Auth token saved: $token');
  }

  // Retrieve auth token
  static Future<String?> getAuthToken() async {
    final box = await _getBox();
    final token = box.get(_authTokenKey);
    _logger.i('Auth token retrieved: $token');
    return token;
  }

  // Save user ID
  static Future<void> setUserId(String userId) async {
    final box = await _getBox();
    await box.put(_userIdKey, userId);
    _logger.i('User ID saved: $userId');
  }

  // Retrieve user ID
  static Future<String?> getUserId() async {
    final box = await _getBox();
    final userId = box.get(_userIdKey);
    _logger.i('User ID retrieved: $userId');
    return userId;
  }

  // Check if user is first time
  static Future<bool> isFirstTimeUser() async {
    final box = await _getBox();
    final isFirstTime = box.get(_firstTimeKey);
    _logger.i('First time user status: $isFirstTime');
    return isFirstTime == null || isFirstTime == true;
  }

  // Set first time user flag
  static Future<void> setFirstTimeUser(bool value) async {
    final box = await _getBox();
    await box.put(_firstTimeKey, value);
    _logger.i('First time user status updated: $value');
  }

  // Save "Remember Me" flag
  static Future<void> setRememberMe(bool value) async {
    final box = await _getBox();
    await box.put(_rememberMeKey, value);
    _logger.i('Remember Me status updated: $value');
  }

  // Retrieve "Remember Me" flag
  static Future<bool> getRememberMe() async {
    final box = await _getBox();
    final rememberMe = box.get(_rememberMeKey) ?? false; // Default to false
    _logger.i('Remember Me status retrieved: $rememberMe');
    return rememberMe;
  }

  // Clear all stored data
  static Future<void> clearAll() async {
    final box = await _getBox();
    await box.clear();
    _logger.i('All stored data cleared');
  }

  // Print all stored data (for debugging)
  static Future<void> printAllData() async {
    final box = await _getBox();
    _logger.i('Stored Data in Hive:');
    box.toMap().forEach((key, value) {
      _logger.i('$key: $value');
    });
  }
}
