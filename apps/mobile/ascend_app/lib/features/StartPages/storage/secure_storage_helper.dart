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

  // Get Hive box with error handling
  static Future<Box> _getBox() async {
    try {
      if (Hive.isBoxOpen(_boxName)) {
        return Hive.box(_boxName);
      }
      return await Hive.openBox(_boxName);
    } catch (e) {
      _logger.e('Error opening Hive box: $e');
      rethrow;
    }
  }

  // Save email
  static Future<void> saveEmail(String email) async {
    try {
      final box = await _getBox();
      await box.put(_emailKey, email);
      _logger.i('Email saved successfully');
    } catch (e) {
      _logger.e('Error saving email: $e');
      rethrow;
    }
  }

  // Retrieve email
  static Future<String?> getEmail() async {
    try {
      final box = await _getBox();
      final email = box.get(_emailKey);
      _logger.i('Email retrieved: $email');
      return email;
    } catch (e) {
      _logger.e('Error retrieving email: $e');
      rethrow;
    }
  }

  // Save auth token
  static Future<void> setAuthToken(String token) async {
    try {
      final box = await _getBox();
      await box.put(_authTokenKey, token);
      _logger.i('Auth token saved: $token');
    } catch (e) {
      _logger.e('Error saving auth token: $e');
      rethrow;
    }
  }

  // Retrieve auth token
  static Future<String?> getAuthToken() async {
    try {
      final box = await _getBox();
      final token = box.get(_authTokenKey);
      _logger.i('Auth token retrieved: $token');
      return token;
    } catch (e) {
      _logger.e('Error retrieving auth token: $e');
      rethrow;
    }
  }

  // Save user ID
  static Future<void> setUserId(String userId) async {
    try {
      final box = await _getBox();
      await box.put(_userIdKey, userId);
      _logger.i('User ID saved: $userId');
    } catch (e) {
      _logger.e('Error saving user ID: $e');
      rethrow;
    }
  }

  // Retrieve user ID
  static Future<String?> getUserId() async {
    try {
      final box = await _getBox();
      final userId = box.get(_userIdKey);
      _logger.i('User ID retrieved: $userId');
      return userId;
    } catch (e) {
      _logger.e('Error retrieving user ID: $e');
      rethrow;
    }
  }

  // Check if user is first time
  static Future<bool> isFirstTimeUser() async {
    try {
      final box = await _getBox();
      final isFirstTime = box.get(_firstTimeKey);
      _logger.i('First time user status: $isFirstTime');
      return isFirstTime == null || isFirstTime == true;
    } catch (e) {
      _logger.e('Error checking first time user status: $e');
      rethrow;
    }
  }

  // Set first time user flag
  static Future<void> setFirstTimeUser(bool value) async {
    try {
      final box = await _getBox();
      await box.put(_firstTimeKey, value);
      _logger.i('First time user status updated: $value');
    } catch (e) {
      _logger.e('Error setting first time user status: $e');
      rethrow;
    }
  }

  // Save "Remember Me" flag
  static Future<void> setRememberMe(bool value) async {
    try {
      final box = await _getBox();
      await box.put(_rememberMeKey, value);
      _logger.i('Remember Me status updated: $value');
    } catch (e) {
      _logger.e('Error setting Remember Me status: $e');
      rethrow;
    }
  }

  // Retrieve "Remember Me" flag
  static Future<bool> getRememberMe() async {
    try {
      final box = await _getBox();
      final rememberMe = box.get(_rememberMeKey) ?? false; // Default to false
      _logger.i('Remember Me status retrieved: $rememberMe');
      return rememberMe;
    } catch (e) {
      _logger.e('Error retrieving Remember Me status: $e');
      rethrow;
    }
  }

  // Clear all stored data
  static Future<void> clearAll() async {
    try {
      final box = await _getBox();
      await box.clear();
      _logger.i('All stored data cleared');
    } catch (e) {
      _logger.e('Error clearing all stored data: $e');
      rethrow;
    }
  }

  // Print all stored data (for debugging)
  static Future<void> printAllData() async {
    try {
      final box = await _getBox();
      _logger.i('Stored Data in Hive:');
      box.toMap().forEach((key, value) {
        _logger.i('$key: $value');
      });
    } catch (e) {
      _logger.e('Error printing all stored data: $e');
      rethrow;
    }
  }
}