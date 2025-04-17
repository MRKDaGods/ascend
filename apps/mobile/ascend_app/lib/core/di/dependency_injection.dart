import 'package:ascend_app/shared/widgets/bloc/search_bloc.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../features/notifications/data/datasources/notification_local_datasource.dart';
import '../../features/notifications/data/datasources/notification_remote_datasource.dart';
import '../../features/notifications/presentation/bloc/notification_bloc.dart';
import '../../services/push_notification_service.dart';
import '../../core/network/network_info.dart';
import '../../features/StartPages/Bloc/bloc/auth_bloc.dart';
import '../../features/StartPages/Repository/auth_repository.dart';
import '../../features/StartPages/repository/ApiClient.dart';

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
  // Add Auth related properties
  late final AuthRepository authRepository;
  late final ApiClient apiClient;
  late final AuthBloc authBloc;

  // Services
  late final PushNotificationService pushNotificationService;
  late final NetworkInfo networkInfo;

  // BLOCs
  late final NotificationBloc notificationBloc;
  late final SearchBloc searchBloc;

  /// Initialize all dependencies
  Future<void> init() async {
    // Core
    networkInfo = NetworkInfoImpl(InternetConnectionChecker.createInstance());

    // External
    final sharedPreferences = await SharedPreferences.getInstance();
    final client = http.Client();

    // Initialize ApiClient without parameters
    apiClient = ApiClient();

    // Initialize AuthRepository
    authRepository = AuthRepository(apiClient: apiClient);

    // Initialize AuthBloc
    authBloc = AuthBloc(authRepository: authRepository, apiClient: apiClient);

    // Data sources
    final notificationRemoteDataSource = NotificationRemoteDataSourceImpl(
      client: client,
      baseUrl: 'https://mock-api.example.com', // This can be any placeholder
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      useMockData:
          true, // Add a flag to use mock data instead of real API calls
    );

    // Initialize push notification service
    pushNotificationService = PushNotificationService();
    await pushNotificationService.initialize();

    // BLOCs
    notificationBloc = NotificationBloc(apiClient: apiClient);
    searchBloc = SearchBloc();
  }

  /// Dispose of resources when app is closed
  void dispose() {
    notificationBloc.close();
    authBloc.close();
  }
}

// Create a global instance for easy access
final sl = ServiceLocator();
