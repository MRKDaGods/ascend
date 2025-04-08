import 'package:hive/hive.dart';
import 'package:logger/logger.dart';

class SecureStorageHelper {
  static const String _boxName = 'secureStorageBox';

  // Keys for storing data
  static const String _emailKey = 'email';
  static const String _authTokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _firstTimeKey = 'isFirstTimeUser';

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
  }

  // Save auth token
  static Future<void> saveAuthToken(String token) async {
    final box = await _getBox();
    await box.put(_authTokenKey, token);
  }

  // Save user ID or name
  static Future<void> saveUserId(String userId) async {
    final box = await _getBox();
    await box.put(_userIdKey, userId);
  }

  // Retrieve email
  static Future<String?> getEmail() async {
    final box = await _getBox();
    return box.get(_emailKey);
  }

  // Retrieve auth token
  static Future<String?> getAuthToken() async {
    final box = await _getBox();
    return box.get(_authTokenKey);
  }

  // Retrieve user ID or name
  static Future<String?> getUserId() async {
    final box = await _getBox();
    return box.get(_userIdKey);
  }

  // Check if user is first time
  static Future<bool> isFirstTimeUser() async {
    final box = await _getBox();
    final isFirstTime = box.get(_firstTimeKey);
    return isFirstTime == null || isFirstTime == true;
  }

  // Set first time user flag
  static Future<void> setFirstTimeUser(bool value) async {
    final box = await _getBox();
    await box.put(_firstTimeKey, value);
  }

  // Clear all stored data
  static Future<void> clearAll() async {
    final box = await _getBox();
    await box.clear();
  }

  // Print all stored data
  static Future<void> printAllData() async {
    final box = await _getBox();
    _logger.i('Stored Data in Hive:');
    box.toMap().forEach((key, value) {
      _logger.i('$key: $value');
    });
  }
}
