import 'package:ascend_app/shared/widgets/bloc/search_bloc.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../features/notifications/data/datasources/notification_local_datasource.dart';
import '../../features/notifications/data/datasources/notification_remote_datasource.dart';
import '../../features/notifications/data/repositories/notification_repository_impl.dart';
import '../../features/notifications/domain/usecases/delete_notification.dart';
import '../../features/notifications/domain/usecases/get_notifications.dart';
import '../../features/notifications/domain/usecases/listen_for_notifications.dart';
import '../../features/notifications/domain/usecases/mark_all_as_read.dart';
import '../../features/notifications/domain/usecases/mark_as_read.dart';
import '../../features/notifications/presentation/bloc/notification_bloc.dart';
import '../../services/push_notification_service.dart';
import '../../core/network/network_info.dart';

/// Service locator for dependency injection
class ServiceLocator {
  // Singleton instance
  static final ServiceLocator _instance = ServiceLocator._internal();
  
  // Factory constructor
  factory ServiceLocator() => _instance;
  
  // Internal constructor
  ServiceLocator._internal();
  
  // Navigator key for navigation from background
  final navigatorKey = GlobalKey<NavigatorState>();
  
  // Services
  late final PushNotificationService pushNotificationService;
  late final NetworkInfo networkInfo;
  
  // Repositories
  late final NotificationRepositoryImpl notificationRepository;
  
  // Use cases
  late final GetNotifications getNotifications;
  late final MarkAsRead markAsRead;
  late final MarkAllAsRead markAllAsRead;
  late final ListenForNotifications listenForNotifications;
  late final DeleteNotificationUseCase deleteNotification;
  
  // BLOCs
  late final NotificationBloc notificationBloc;
  late final SearchBloc searchBloc;
  
  /// Initialize all dependencies
  Future<void> init() async {
    // Core
    networkInfo = NetworkInfoImpl(
      InternetConnectionChecker.createInstance(),
    );
    
    // External
    final sharedPreferences = await SharedPreferences.getInstance();
    final client = http.Client();
    
    // Data sources
    // final notificationRemoteDataSource = NotificationRemoteDataSourceImpl(
    //   client: client,
    //   baseUrl: 'https://api.ascend-46a60.com/api', // Your actual API URL
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     // Remove auth token if not needed or add actual token if available
    //   },
    // );
    final notificationRemoteDataSource = NotificationRemoteDataSourceImpl(
  client: client,
  baseUrl: 'https://mock-api.example.com', // This can be any placeholder
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  useMockData: true, // Add a flag to use mock data instead of real API calls
);
    
    final notificationLocalDataSource = NotificationLocalDataSourceImpl(
      sharedPreferences: sharedPreferences,
    );
    
    // Repositories
    notificationRepository = NotificationRepositoryImpl(
      remoteDataSource: notificationRemoteDataSource,
      localDataSource: notificationLocalDataSource,
      networkInfo: networkInfo,
    );
    
    // Use cases
    getNotifications = GetNotifications(notificationRepository);
    markAsRead = MarkAsRead(notificationRepository);
    markAllAsRead = MarkAllAsRead(notificationRepository);
    listenForNotifications = ListenForNotifications(notificationRepository);
    deleteNotification = DeleteNotificationUseCase(notificationRepository);
    
    // Initialize push notification service
    pushNotificationService = PushNotificationService();
    await pushNotificationService.initialize();
    
    // BLOCs
    notificationBloc = NotificationBloc(
      getNotifications: getNotifications,
      markAsRead: markAsRead,
      markAllAsRead: markAllAsRead,
      listenForNotifications: listenForNotifications,
      deleteNotification: deleteNotification,
    );
    searchBloc = SearchBloc();
  }
  
  /// Dispose of resources when app is closed
  void dispose() {
    notificationBloc.close();
  }
}

// Create a global instance for easy access
final sl = ServiceLocator();