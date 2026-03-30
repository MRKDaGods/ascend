import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/notification_model.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/constants/api_endpoints.dart';

/// Interface for the remote data source
abstract class NotificationRemoteDataSource {
  /// Gets all notifications for the current user from the API
  Future<List<NotificationModel>> getNotifications();
  
  /// Gets a specific notification by ID
  Future<NotificationModel?> getNotificationById(String id);
  
  /// Marks a notification as read on the server
  Future<void> markAsRead(String id);
  
  /// Marks all notifications as read on the server
  Future<void> markAllAsRead();
  
  /// Deletes a notification from the server
  Future<void> deleteNotification(String id);
  
  /// Registers device token with the backend for push notifications
  Future<void> registerDeviceToken(String token);
  
  /// Unregisters device token when the user logs out
  Future<void> unregisterDeviceToken(String token);
  
  /// Sends a test notification (useful for development)
  Future<void> sendTestNotification();
  
  /// Gets count of unread notifications
  Future<int> getUnreadCount();
}

/// Implementation of [NotificationRemoteDataSource] that uses HTTP calls to the backend
class NotificationRemoteDataSourceImpl implements NotificationRemoteDataSource {
  final http.Client client;
  final String baseUrl;
  final Map<String, String> headers;
  final bool useMockData;

  NotificationRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
    required this.headers,
    this.useMockData = false,
  });

  @override
  Future<List<NotificationModel>> getNotifications() async {
    if (useMockData) {
      // Return mock data with all required fields
      return Future.delayed(const Duration(milliseconds: 800), () {
        return [
          NotificationModel(
            id: '1',
            title: 'New connection request',
            message: 'John Doe wants to connect with you',
            createdAt: DateTime.now().subtract(const Duration(hours: 2)),
            isRead: false,
            type: 'connection',
            relatedItemId: 'user123',
            senderName: 'John Doe',
            senderAvatarUrl: "assets/logo.jpg", // Remove the unreliable URL
          ),
          NotificationModel(
            id: '2',
            title: 'Post interaction',
            message: 'Sarah liked your recent post about Flutter development',
            createdAt: DateTime.now().subtract(const Duration(days: 1)),
            isRead: true,
            type: 'My posts',
            relatedItemId: 'post123',
            senderName: 'Sarah Johnson',
            senderAvatarUrl: "assets/logo.jpg",
          ),
          NotificationModel(
            id: '3',
            title: 'Job opportunity',
            message: 'New job matching your profile: Flutter Developer at Google',
            createdAt: DateTime.now().subtract(const Duration(hours: 5)),
            isRead: false,
            type: 'Jobs',
            relatedItemId: 'job456',
          ),
          // Add more mock notifications here
        ];
      });
    }

    try {
      final response = await client.get(
        Uri.parse('$baseUrl${ApiEndpoints.notifications}'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body) as Map<String, dynamic>;
        final data = jsonData['data'] as List<dynamic>;
        
        return data
            .map((item) => NotificationModel.fromJson(item as Map<String, dynamic>))
            .toList();
      } else {
        throw ServerException(
          message: 'Failed to load notifications',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error getting notifications: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<NotificationModel?> getNotificationById(String id) async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl${ApiEndpoints.notifications}/$id'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body) as Map<String, dynamic>;
        final data = jsonData['data'] as Map<String, dynamic>;
        
        return NotificationModel.fromJson(data);
      } else if (response.statusCode == 404) {
        return null; // Notification not found
      } else {
        throw ServerException(
          message: 'Failed to load notification',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error getting notification: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<void> markAsRead(String id) async {
    try {
      final response = await client.patch(
        Uri.parse('$baseUrl${ApiEndpoints.notifications}/$id/read'),
        headers: headers,
      );
      
      if (response.statusCode != 200) {
        throw ServerException(
          message: 'Failed to mark notification as read',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error marking notification as read: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<void> markAllAsRead() async {
    try {
      final response = await client.patch(
        Uri.parse('$baseUrl${ApiEndpoints.notifications}/read-all'),
        headers: headers,
      );
      
      if (response.statusCode != 200) {
        throw ServerException(
          message: 'Failed to mark all notifications as read',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error marking all notifications as read: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<void> deleteNotification(String id) async {
    try {
      final response = await client.delete(
        Uri.parse('$baseUrl${ApiEndpoints.notifications}/$id'),
        headers: headers,
      );
      
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw ServerException(
          message: 'Failed to delete notification',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error deleting notification: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<void> registerDeviceToken(String token) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl${ApiEndpoints.deviceTokens}'),
        headers: headers,
        body: json.encode({'token': token}),
      );
      
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw ServerException(
          message: 'Failed to register device token',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error registering device token: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<void> unregisterDeviceToken(String token) async {
    try {
      final response = await client.delete(
        Uri.parse('$baseUrl${ApiEndpoints.deviceTokens}/$token'),
        headers: headers,
      );
      
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw ServerException(
          message: 'Failed to unregister device token',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error unregistering device token: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<void> sendTestNotification() async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl${ApiEndpoints.notifications}/test'),
        headers: headers,
      );
      
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw ServerException(
          message: 'Failed to send test notification',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error sending test notification: ${e.toString()}',
      );
    }
  }
  
  @override
  Future<int> getUnreadCount() async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl${ApiEndpoints.notifications}/unread-count'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body) as Map<String, dynamic>;
        return jsonData['count'] as int? ?? 0;
      } else {
        throw ServerException(
          message: 'Failed to get unread count',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw ServerException(
        message: 'Error getting unread count: ${e.toString()}',
      );
    }
  }
}