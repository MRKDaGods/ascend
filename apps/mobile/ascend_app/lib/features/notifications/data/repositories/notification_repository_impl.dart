
import 'dart:async';

import '../../domain/entities/notification.dart';
import '../../domain/repositories/notification_repository.dart';
import '../datasources/notification_remote_datasource.dart';
import '../datasources/notification_local_datasource.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/network/network_info.dart';

/// Implementation of [NotificationRepository]
class NotificationRepositoryImpl implements NotificationRepository {
  final NotificationRemoteDataSource remoteDataSource;
  final NotificationLocalDataSource localDataSource;
  final NetworkInfo networkInfo;
  
  // Stream controller for notifications
  final _notificationsStreamController = 
      StreamController<List<Notification>>.broadcast();
  
  // Cache duration in hours
  static const int _cacheDurationHours = 1;
  
  NotificationRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });
  
  @override
  Future<List<Notification>> getNotifications() async {
    if (await networkInfo.isConnected) {
      try {
        // Try to get from network
        final remoteNotifications = await remoteDataSource.getNotifications();
        
        // Cache the latest notifications
        await localDataSource.cacheNotifications(remoteNotifications);
        
        // Update stream with new notifications
        _notificationsStreamController.add(remoteNotifications);
        
        return remoteNotifications;
      } on ServerException catch (e) {
        // If server fails, try to get from cache
        try {
          final cachedNotifications = await localDataSource.getCachedNotifications();
          
          // If cache is not empty, return it
          if (cachedNotifications.isNotEmpty) {
            _notificationsStreamController.add(cachedNotifications);
            return cachedNotifications;
          }
          
          // Otherwise throw the original server error
          throw ServerFailure(message: e.message);
        } on CacheException {
          throw ServerFailure(message: e.message);
        }
      }
    } else {
      // No internet, try to get from cache
      try {
        final cachedNotifications = await localDataSource.getCachedNotifications();
        
        if (cachedNotifications.isEmpty) {
          throw NetworkFailure(message: 'No internet connection and no cached data available');
        }
        
        // Check if cache is not too old
        final lastCacheTime = await localDataSource.getLastCacheTime();
        if (lastCacheTime != null) {
          final cacheDuration = DateTime.now().difference(lastCacheTime);
          if (cacheDuration.inHours > _cacheDurationHours) {
            throw NetworkFailure(message: 'Cached data is too old. Please connect to the internet to refresh.');
          }
        }
        
        _notificationsStreamController.add(cachedNotifications);
        return cachedNotifications;
      } on CacheException {
        throw NetworkFailure(message: 'No internet connection and cache access failed');
      }
    }
  }
  
  @override
  Future<Notification?> getNotificationById(String id) async {
    // Try cache first for faster response
    try {
      final cachedNotifications = await localDataSource.getCachedNotifications();
      try {
        final cachedNotification = cachedNotifications.firstWhere(
          (notification) => notification.id == id,
        );
        return cachedNotification;
      } on StateError {
        // No matching notification found in cache
      }
    } catch (_) {
      // Ignore cache errors and try remote
    }
    
    // If not in cache or cache failed, try remote
    if (await networkInfo.isConnected) {
      try {
        final notification = await remoteDataSource.getNotificationById(id);
        
        // If found, update the cache
        if (notification != null) {
          try {
            await localDataSource.updateNotification(notification);
          } catch (_) {
            // Ignore cache errors
          }
        }
        
        return notification;
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  @override
  Future<void> markAsRead(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.markAsRead(id);
        
        // Update local cache
        try {
          final cachedNotifications = await localDataSource.getCachedNotifications();
          final index = cachedNotifications.indexWhere((n) => n.id == id);
          
          if (index != -1) {
            final updatedNotification = cachedNotifications[index].copyWith(isRead: true);
            await localDataSource.updateNotification(updatedNotification);
          }
        } catch (_) {
          // Ignore cache errors
        }
        
        // Refresh notifications after marking as read
        await _refreshNotifications();
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  @override
  Future<void> markAllAsRead() async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.markAllAsRead();
        
        // Refresh notifications after marking all as read
        await _refreshNotifications();
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  @override
  Future<void> deleteNotification(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.deleteNotification(id);
        
        // Refresh notifications after deletion
        await _refreshNotifications();
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  @override
  Stream<List<Notification>> watchNotifications() {
    // Start by fetching the latest notifications
    getNotifications().catchError((_) {
      // Silently handle error - the stream will just not emit a new value
    });
    
    return _notificationsStreamController.stream;
  }
  
  @override
  Future<void> registerDeviceToken(String token) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.registerDeviceToken(token);
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  @override
  Future<void> unregisterDeviceToken(String token) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.unregisterDeviceToken(token);
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  @override
  Future<void> sendTestNotification() async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.sendTestNotification();
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  @override
  Future<int> getUnreadCount() async {
    if (await networkInfo.isConnected) {
      try {
        return await remoteDataSource.getUnreadCount();
      } on ServerException catch (e) {
        throw ServerFailure(message: e.message);
      }
    } else {
      throw NetworkFailure(message: 'No internet connection');
    }
  }
  
  /// Helper method to refresh notifications in the stream
  Future<void> _refreshNotifications() async {
    try {
      final notifications = await remoteDataSource.getNotifications();
      _notificationsStreamController.add(notifications);
    } catch (_) {
      // Silently handle error - we don't want to fail just because refresh failed
    }
  }
  
  /// Clean up resources
  void dispose() {
    _notificationsStreamController.close();
  }
}