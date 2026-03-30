import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/notification_model.dart';
import '../../../../core/errors/exceptions.dart';

/// Interface for accessing locally stored notifications
abstract class NotificationLocalDataSource {
  /// Gets all cached notifications
  Future<List<NotificationModel>> getCachedNotifications();
  
  /// Caches the given notifications
  Future<void> cacheNotifications(List<NotificationModel> notifications);
  
  /// Gets the last time notifications were cached
  Future<DateTime?> getLastCacheTime();
  
  /// Updates a notification in the cache
  Future<void> updateNotification(NotificationModel notification);
  
  /// Clears all cached notifications
  Future<void> clearCache();
}

/// Implementation of [NotificationLocalDataSource] using SharedPreferences
class NotificationLocalDataSourceImpl implements NotificationLocalDataSource {
  final SharedPreferences sharedPreferences;
  
  // Keys for shared preferences
  static const String _cachedNotificationsKey = 'CACHED_NOTIFICATIONS';
  static const String _lastCacheTimeKey = 'LAST_NOTIFICATION_CACHE_TIME';
  
  NotificationLocalDataSourceImpl({required this.sharedPreferences});
  
  @override
  Future<List<NotificationModel>> getCachedNotifications() async {
    try {
      final jsonString = sharedPreferences.getString(_cachedNotificationsKey);
      if (jsonString == null) {
        return [];
      }
      
      final List<dynamic> jsonList = json.decode(jsonString);
      return jsonList
          .map((jsonItem) => NotificationModel.fromJson(jsonItem))
          .toList();
    } catch (e) {
      throw CacheException(message: 'Failed to get cached notifications: ${e.toString()}');
    }
  }
  
  @override
  Future<void> cacheNotifications(List<NotificationModel> notifications) async {
    try {
      final List<Map<String, dynamic>> jsonList = 
          notifications.map((notification) => notification.toJson()).toList();
      
      await sharedPreferences.setString(
        _cachedNotificationsKey,
        json.encode(jsonList),
      );
      
      // Update cache time
      await sharedPreferences.setString(
        _lastCacheTimeKey,
        DateTime.now().toIso8601String(),
      );
    } catch (e) {
      throw CacheException(message: 'Failed to cache notifications: ${e.toString()}');
    }
  }
  
  @override
  Future<DateTime?> getLastCacheTime() async {
    try {
      final cacheTimeString = sharedPreferences.getString(_lastCacheTimeKey);
      if (cacheTimeString == null) {
        return null;
      }
      
      return DateTime.parse(cacheTimeString);
    } catch (e) {
      return null;
    }
  }
  
  @override
  Future<void> updateNotification(NotificationModel notification) async {
    try {
      final notifications = await getCachedNotifications();
      
      final index = notifications.indexWhere((n) => n.id == notification.id);
      if (index >= 0) {
        notifications[index] = notification;
        await cacheNotifications(notifications);
      }
    } catch (e) {
      throw CacheException(message: 'Failed to update notification: ${e.toString()}');
    }
  }
  
  @override
  Future<void> clearCache() async {
    try {
      await sharedPreferences.remove(_cachedNotificationsKey);
      await sharedPreferences.remove(_lastCacheTimeKey);
    } catch (e) {
      throw CacheException(message: 'Failed to clear notification cache: ${e.toString()}');
    }
  }
}