import 'dart:async';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Service responsible for handling push notifications in the app.
/// 
/// This service initializes Firebase Cloud Messaging, requests permissions,
/// handles incoming notifications, and provides methods for registering
/// notification handlers.
class PushNotificationService {
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications = 
      FlutterLocalNotificationsPlugin();
  
  // Stream controller for notification taps when app is in background
  final StreamController<RemoteMessage> _onNotificationTap = 
      StreamController<RemoteMessage>.broadcast();
  
  // Getter for the notification tap stream
  Stream<RemoteMessage> get onNotificationTap => _onNotificationTap.stream;
  
  /// Initialize the push notification service
  Future<void> initialize() async {
    // Request permission
    await _requestPermission();
    
    // Initialize local notifications for foreground messages
    await _initializeLocalNotifications();
    
    // Get token for sending to backend
    await _getFcmToken();
    
    // Configure notification handlers
    _configureForegroundNotifications();
    _configureBackgroundNotifications();
  }
  
  /// Request notification permissions from the user
  Future<void> _requestPermission() async {
    NotificationSettings settings = await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );
    
    if (kDebugMode) {
      print('User notification permission status: ${settings.authorizationStatus}');
    }
  }
  
  /// Initialize local notification plugin for foreground notifications
  Future<void> _initializeLocalNotifications() async {
    const AndroidInitializationSettings androidSettings = 
        AndroidInitializationSettings('@mipmap/ic_launcher');
        
    final DarwinInitializationSettings iosSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    
    final InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );
    
    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        // This handles notification taps on iOS 10+ and Android
        if (kDebugMode) {
          print('Notification tapped: ${response.payload}');
        }
        
        // If you have a payload, parse it and add to the stream for handling
        if (response.payload != null && response.payload!.isNotEmpty) {
          try {
            final Map<String, dynamic> data = {
              'notificationId': response.payload,
            };
            
            // Create a RemoteMessage more safely
            _onNotificationTap.add(RemoteMessage(
              data: data,
              notification: RemoteNotification(
                title: "Notification",
                body: response.payload,
              ),
            ));
          } catch (e) {
            if (kDebugMode) {
              print('Error parsing notification payload: $e');
            }
          }
        }
      },
    );
  }
  
  /// Retrieve FCM token for device registration with backend
  Future<String?> _getFcmToken() async {
    final String? token = await _firebaseMessaging.getToken();
    if (kDebugMode) {
      print('FCM Token: $token');
    }
    
    // Subscribe to token refresh events
    _firebaseMessaging.onTokenRefresh.listen((newToken) {
      if (kDebugMode) {
        print('FCM Token refreshed: $newToken');
      }
      // TODO: Send the new token to your server
    });
    
    return token;
  }
  
  /// Handle notifications when app is in foreground
  void _configureForegroundNotifications() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      if (kDebugMode) {
        print('Foreground message received: ${message.notification?.title}');
      }
      
      _showLocalNotification(message);
    });
  }
  
  /// Handle notification interactions when app is in background
  void _configureBackgroundNotifications() {
    // When app is opened from a notification tap while in background
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      if (kDebugMode) {
        print('Background notification tapped: ${message.notification?.title}');
      }
      
      _onNotificationTap.add(message);
    });
    
    // Check if app was opened from a terminated state by notification
    _firebaseMessaging.getInitialMessage().then((RemoteMessage? message) {
      if (message != null) {
        if (kDebugMode) {
          print('App opened from terminated state by notification');
        }
        
        _onNotificationTap.add(message);
      }
    });
  }
  
  /// Display a local notification for foreground messages
  Future<void> _showLocalNotification(RemoteMessage message) async {
    if (message.notification == null) return;
    
    final AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'ascend_notification_channel',
      'Ascend Notifications',
      channelDescription: 'Notifications from Ascend app',
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'Ascend',
    );
    
    final DarwinNotificationDetails iosDetails = DarwinNotificationDetails();
    
    final NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );
    
    await _localNotifications.show(
      message.hashCode,
      message.notification!.title,
      message.notification!.body,
      details,
      payload: message.data.toString(),
    );
  }
  
  /// Register token with backend
  Future<void> registerTokenWithBackend(String token, String userId) async {
    // TODO: Implement API call to register token with your backend
  }
  
  /// Unregister device token when user logs out
  Future<void> unregisterToken() async {
    // TODO: Implement API call to unregister token with your backend
  }
  
  /// Dispose resources
  void dispose() {
    _onNotificationTap.close();
  }
}