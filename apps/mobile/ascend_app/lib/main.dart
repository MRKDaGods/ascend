import 'package:ascend_app/shared/widgets/bloc/search_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:async';

import 'core/app/app_initializer.dart';
import 'core/di/dependency_injection.dart';
import 'core/routes/app_routes.dart';
import 'features/profile/bloc/user_profile_bloc.dart';
import 'features/profile/bloc/user_profile_event.dart';
import 'features/home/bloc/post_bloc/post_bloc.dart';
import 'features/home/repositories/post_repository.dart';
import 'features/notifications/presentation/bloc/notification_bloc.dart';
import 'features/notifications/presentation/bloc/notification_event.dart';
import 'theme.dart';

void main() {
  // Set up error handling
  AppInitializer.setupErrorHandling((error, stack) {
    debugPrint('Global error: $error');
    // In production, you'd want to log this to a service
  });

  // Run app in an error zone to catch all errors
  runZonedGuarded(() async {
    // Initialize all services and dependencies
    await AppInitializer.initialize();
    
    // Set up BLoC observer for debugging
    AppInitializer.setupBlocObserver();

    // Run the app
    runApp(const MainApp());
  }, (error, stackTrace) {
    debugPrint('Error in runZonedGuarded: $error');
    // In production, you'd want to log this to a service
  });
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  bool _isInitialized = false;
  
  @override
  void initState() {
    super.initState();
    _setupPushNotifications();
    setState(() {
      _isInitialized = true;
    });
  }
  
  // Method to set up push notification handlers
  Future<void> _setupPushNotifications() async {
    try {
      // Listen for notification taps
      sl.pushNotificationService.onNotificationTap.listen((message) {
        final notificationId = message.data['notificationId'];
        if (notificationId != null) {
          sl.notificationBloc.add(FetchNotificationById(notificationId));
          sl.navigatorKey.currentState?.pushNamed(RouteNames.notifications);
        }
      });
    } catch (e) {
      debugPrint('Error setting up push notifications: $e');
    }
  }
  
  @override
  void dispose() {
    sl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return MaterialApp(
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        home: Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        ),
      );
    }
    
    return MultiBlocProvider(
      providers: [
        // Your existing providers
        BlocProvider<UserProfileBloc>(
          create: (context) => UserProfileBloc()..add(LoadUserProfile()),
        ),
        BlocProvider<PostBloc>(
          create: (context) {
            try {
              final repo = PostRepository();
              final bloc = PostBloc(repo);
              return bloc;
            } catch (e) {
              return PostBloc(PostRepository());
            }
          },
        ),
        
        // Add the notification bloc
        BlocProvider<NotificationBloc>.value(value: sl.notificationBloc),
        
        // Add SearchBloc to the providers
        BlocProvider<SearchBloc>.value(value: sl.searchBloc),
      ],
      child: MaterialApp(
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        debugShowCheckedModeBanner: false,
        navigatorKey: sl.navigatorKey,
        
        // Use the routes from AppRoutes
        initialRoute: AppRoutes.initialRoute,
        routes: AppRoutes.getRoutes(),
        onGenerateRoute: AppRoutes.onGenerateRoute,
        
        builder: (context, child) {
          return ScrollConfiguration(
            behavior: ScrollBehavior().copyWith(
              physics: const BouncingScrollPhysics(),
              overscroll: false,
            ),
            child: child!,
          );
        },
        home: AppRoutes.getInitialPage(),
      ),
    );
  }
}