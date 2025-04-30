import 'package:ascend_app/features/Messaging/data/datasources/remote_datasource.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/services/web_socket_service.dart';
import 'package:ascend_app/shared/widgets/bloc/search_bloc.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Add these imports
import '../../features/home/repositories/post_repository.dart';
import '../../features/home/bloc/post_bloc/post_bloc.dart';
import '../../features/home/bloc/saved_posts_bloc/saved_posts_bloc.dart';

import '../../features/notifications/data/datasources/notification_remote_datasource.dart';
import '../../features/notifications/presentation/bloc/notification_bloc.dart';
import '../../services/push_notification_service.dart';
import '../../core/network/network_info.dart';
import '../../features/StartPages/Bloc/bloc/auth_bloc.dart';
import '../../features/StartPages/repository/auth_repository.dart';
import '../../features/StartPages/repository/ApiClient.dart';

/// Service locator for dependency injection
class ServiceLocator {
  // Singleton instance
  static final ServiceLocator _instance = ServiceLocator._internal();

  // Factory constructor
  factory ServiceLocator() => _instance;

  // Internal constructor
  ServiceLocator._internal();

  // Flag to track initialization status
  bool _isInitialized = false; // Add this flag

  // Navigator key for navigation from background
  final navigatorKey = GlobalKey<NavigatorState>();
  // Add Auth related properties
  late final AuthRepository authRepository;
  late final ApiClient apiClient;
  late final AuthBloc authBloc;

  // Add Post related properties
  late final PostRepository postRepository;
  late final PostBloc postBloc;
  late final SavedPostsBloc savedPostsBloc;

  // Services
  late final PushNotificationService pushNotificationService;
  late final NetworkInfo networkInfo;
  late final WebSocketService webSocketService;

  // BLOCs
  late final NotificationBloc notificationBloc;
  late final SearchBloc searchBloc;
  late final MessagingBloc messagingBloc;

  /// Initialize all dependencies
  Future<void> init() async {
    // Add guard check
    if (_isInitialized) {
      debugPrint('ServiceLocator already initialized. Skipping.');
      return;
    }

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

    // Initialize PostRepository
    postRepository = PostRepository(client: client); // Pass the http client

    // Initialize PostBloc
    postBloc = PostBloc(postRepository); // Pass the repository

    // Initialize SavedPostsBloc
    savedPostsBloc = SavedPostsBloc(
      postRepository: postRepository,
      postBloc: postBloc, // Pass the PostBloc
    );

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

    // Intialize webSocket Service
    webSocketService = WebSocketService();

    // BLOCs
    notificationBloc = NotificationBloc(apiClient: apiClient);
    searchBloc = SearchBloc();

    // Initialize the MessagingBloc
    final messagingRepo = MessagingRepoistoryImpl(
      webSocketService: webSocketService,
      apiClient: apiClient,
    );

    // Create it here instead of in the BlocProvider
    messagingBloc = MessagingBloc(repository: messagingRepo);
  }

  void dispatchMessagingEvent(MessagingBlocEvent event) {
    try {
      messagingBloc.add(event);
    } catch (e) {
      debugPrint('Error dispatching event: $e');
    }
  }

  void dispatchSetActiveConversation(String conversationId) {
    try {
      messagingBloc.add(SetActiveConversation(conversationId));
    } catch (e) {
      debugPrint('Error dispatching SetActiveConversation: $e');
    }

    // Set flag to true after successful initialization
    _isInitialized = true;
    debugPrint('ServiceLocator initialized successfully.');
  }

  /// Dispose of resources when app is closed
  void dispose() {
    // Only close if initialized to avoid errors
    if (_isInitialized) {
      notificationBloc.close();
      authBloc.close();
      searchBloc.close(); // Also close SearchBloc if needed
      postBloc.close(); // Close PostBloc
      savedPostsBloc.close(); // Close SavedPostsBloc
      // Reset flag if you intend for it to be re-initializable (less common)
      // _isInitialized = false;
      debugPrint('ServiceLocator resources disposed.');
    }
  }
}

// Create a global instance for easy access
final sl = ServiceLocator();
