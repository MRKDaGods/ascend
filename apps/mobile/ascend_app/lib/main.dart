import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/notifications/presentation/bloc/notification_event.dart';
import 'package:ascend_app/shared/widgets/bloc/search_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import 'core/app/app_initializer.dart';
import 'core/di/dependency_injection.dart';
import 'core/routes/app_routes.dart';
import 'features/profile/bloc/user_profile_bloc.dart';
import 'features/profile/bloc/user_profile_event.dart';
import 'features/home/bloc/post_bloc/post_bloc.dart';
import 'features/home/repositories/post_repository.dart';
import 'features/notifications/presentation/bloc/notification_bloc.dart';
import 'theme.dart';
import 'features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';

void main() async {
  // Ensure Flutter binding is initialized FIRST
  WidgetsFlutterBinding.ensureInitialized();

  // Set up error handling early
  AppInitializer.setupErrorHandling((error, stack) {
    debugPrint('Global error: $error');
    // In production, log to a service
  });

  // Run app initialization and the app itself in an error zone
  runZonedGuarded(
    () async {
      // Set up BLoC observer
      AppInitializer.setupBlocObserver();

      // Initialize all services, dependencies, Hive, Firebase etc.
      await AppInitializer.initialize();

      // Run the app
      runApp(const MainApp());
    },
    (error, stackTrace) {
      debugPrint('Error in runZonedGuarded: $error');
      // In production, log to a service
    },
  );
}

// // Function to clear local storage
// Future<void> _clearLocalStorage() async { ... }

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  bool _profileLoaded =
      false; // Flag only for profile loading triggered from main

  @override
  void initState() {
    super.initState();
    _setupPushNotifications();
    _setupAuthListener();
  }

  // Add this method to initialize MessagingBloc on successful authentication
  void _setupAuthListener() {
    sl.authBloc.stream.listen((state) {
      if (state is AuthSuccess) {
        // Find the MessagingBloc and initialize it
        final messagingBloc = BlocProvider.of<MessagingBloc>(
          sl.navigatorKey.currentContext!,
        );
        // Check if the MessagingBloc is already initialized
        if (!messagingBloc.isIntialized) {
          // Initialize the MessagingBloc
          messagingBloc.add(IntializeMessaging(forceReconnect: true));
        }
      }
    });
  }

  // Method to set up push notification handlers
  Future<void> _setupPushNotifications() async {
    try {
      sl.pushNotificationService.onNotificationTap.listen((message) {
        final notificationId = message.data['notificationId'];
        if (notificationId != null) {
          try {
            // Assuming NotificationBloc is ready or handles missing data
            sl.notificationBloc.add(FetchNotificationById(notificationId));
            sl.navigatorKey.currentState?.pushNamed(RouteNames.notifications);
          } catch (e) {
            debugPrint('Error handling notification tap: $e');
          }
        }
      });
    } catch (e) {
      debugPrint('Error setting up push notification listener: $e');
    }
  }

  @override
  void dispose() {
    // Consider if sl.dispose() is correct here.
    // sl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Remove the check for _isInitialized and the loading indicator

    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>.value(value: sl.authBloc),
        BlocProvider<UserProfileBloc>(
          // Ensure no initial fetch HERE
          create: (context) => UserProfileBloc(),
        ),
        BlocProvider<PostBloc>(
          // Restore original creation logic (likely fetches immediately or handled in Home page)
          create:
              (context) => PostBloc(
                PostRepository(),
              ), // Assuming it might add LoadPosts itself or Home page does
        ),
        BlocProvider<NotificationBloc>(
          // Restore original creation logic (likely fetches immediately or handled elsewhere)
          create:
              (context) =>
                  sl.notificationBloc, // Assuming it might add FetchNotifications itself or handled elsewhere
        ),
        BlocProvider<SearchBloc>.value(value: sl.searchBloc),

        // Add the MessagingBloc to the providers
        Provider<MessagingBloc>.value(value: sl.messagingBloc),
      ],
      child: BlocListener<AuthBloc, AuthState>(
        listener: (context, authState) {
          // Load profile data only on successful login and if not already loaded
          if (authState is AuthSuccess && !authState.signUpMode) {
            // Check !authState.signUpMode
            debugPrint(
              "[MainApp] AuthSuccess (Login) detected, checking profile load...",
            );
            if (!_profileLoaded) {
              debugPrint("[MainApp] Loading user profile.");
              context.read<UserProfileBloc>().add(LoadUserProfile());
              // Update flag immediately to prevent re-dispatch
              _profileLoaded = true;
              // No need for setState if flag is only for dispatch control
            }
          } else if (authState is AuthInitial || authState is AuthLoading) {
            // Reset only profile flag if user logs out or session starts/reloads
            debugPrint(
              "[MainApp] Auth state is Initial/Loading, resetting profile loaded flag.",
            );
            // Update flag immediately
            _profileLoaded = false;
            // No need for setState if flag is only for dispatch control
          }
        },
        child: GetMaterialApp(
          theme: AppTheme.light,
          darkTheme: AppTheme.dark,
          debugShowCheckedModeBanner: false,
          navigatorKey: sl.navigatorKey,
          initialRoute:
              AppRoutes
                  .initialRoute, // Ensure this points to a valid route (e.g., '/welcome')
          routes: AppRoutes.getRoutes(),
          onGenerateRoute: AppRoutes.onGenerateRoute,
          // Remove the home property if using initialRoute
          builder: (context, child) {
            return ScrollConfiguration(
              behavior: ScrollBehavior().copyWith(
                physics: const BouncingScrollPhysics(),
                overscroll: false,
              ),
              child: child!,
            );
          },
        ),
      ),
    );
  }
}
