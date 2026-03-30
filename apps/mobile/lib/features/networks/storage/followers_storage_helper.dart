import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:hive/hive.dart';
import 'package:logger/logger.dart';

class FollowersStorageHelper {
  static const String _boxName = 'followersBox';

  // Keys for storing data
  static const String _followersKey = 'followers';

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

  // Save a following User
  static Future<void> saveFollowingUser(FollowedUser user) async {
    try {
      final box = await _getBox();
      List<FollowedUser> followers = box.get(
        _followersKey,
        defaultValue: <String>[],
      );
      if (!followers.contains(user)) {
        followers.add(user);
        await box.put(_followersKey, followers);
        _logger.i('User $user saved successfully to followers');
      } else {
        _logger.i('User $user already exists in followers');
      }
    } catch (e) {
      _logger.e('Error saving user $user to followers: $e');
      rethrow;
    }
  }

  // remove a following User
  static Future<void> removeFollowingUser(FollowedUser user) async {
    try {
      final box = await _getBox();
      List<FollowedUser> followers = box.get(
        _followersKey,
        defaultValue: <String>[],
      );
      if (followers.contains(user)) {
        followers.remove(user);
        await box.put(_followersKey, followers);
        _logger.i('User $user removed successfully from followers');
      } else {
        _logger.i('User $user does not exist in followers');
      }
    } catch (e) {
      _logger.e('Error removing user $user from followers: $e');
      rethrow;
    }
  }

  // retreive all following Users
  static Future<List<FollowedUser>> getFollowingUsers() async {
    try {
      final box = await _getBox();
      List<FollowedUser> followers = box.get(
        _followersKey,
        defaultValue: <String>[],
      );
      _logger.i('Followers retrieved: $followers');
      return followers;
    } catch (e) {
      _logger.e('Error retrieving followers: $e');
      rethrow;
    }
  }
}
