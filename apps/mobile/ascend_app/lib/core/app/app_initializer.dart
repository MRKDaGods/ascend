import 'dart:async';
import 'dart:ui';
import 'package:ascend_app/features/StartPages/repository/ApiClient.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:ascend_app/features/StartPages/repository/auth_repository.dart';
import 'package:ascend_app/firebase_options.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../di/dependency_injection.dart';

/// Class responsible for initializing the app
class AppInitializer {
  // Private constructor
  AppInitializer._();

  /// Initialize all required services and dependencies before the app starts
  static Future<void> initialize() async {
    // Ensure Flutter is initialized
    WidgetsFlutterBinding.ensureInitialized();

    // Initialize Hive for local storage
    await _initializeHive();

    // Initialize Firebase
    await _initializeFirebase();

    // Initialize service locator with all dependencies
    await sl.init();

    // Optimize image caching
    PaintingBinding.instance.imageCache.maximumSizeBytes = 100 * 1024 * 1024;

    // Re-fetch the authentication token
    await _refreshAuthToken();
  }

  /// Initialize Hive
  static Future<void> _initializeHive() async {
    try {
      await Hive.initFlutter();
      debugPrint('Hive initialized successfully');
    } catch (e) {
      debugPrint('Hive initialization error: $e');
    }
  }

  /// Initialize Firebase
  static Future<void> _initializeFirebase() async {
    try {
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );
      debugPrint('Firebase initialized successfully');
    } catch (e) {
      debugPrint('Firebase initialization error: $e');
    }
  }

  /// Re-fetch the authentication token
  static Future<void> _refreshAuthToken() async {
    try {
      final email = await SecureStorageHelper.getEmail();
      final password =
          await SecureStorageHelper.getPassword(); // Add this method in SecureStorageHelper
      if (email != null && password != null) {
        // Retrieve dependencies from the service locator
        final authRepository = sl.authRepository;

        // Call the login API to refresh the token
        final response = await authRepository.login(email, password);
        await SecureStorageHelper.setAuthToken(response['token']);
        debugPrint('Auth token refreshed successfully');
      } else {
        debugPrint('No stored credentials found. Skipping token refresh.');
      }
    } catch (e) {
      debugPrint('Error refreshing auth token: $e');
    }
  }

  /// Set up error handling for the entire app
  static void setupErrorHandling(Function(Object, StackTrace) onError) {
    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.dumpErrorToConsole(details);
      onError(details.exception, details.stack ?? StackTrace.current);
    };

    PlatformDispatcher.instance.onError = (error, stack) {
      onError(error, stack);
      return true;
    };
  }

  /// Configure the BLoC observer for logging and monitoring
  static void setupBlocObserver() {
    Bloc.observer = AppBlocObserver();
  }
}

/// Custom BlocObserver to trace all bloc events and state changes
class AppBlocObserver extends BlocObserver {
  @override
  void onCreate(BlocBase bloc) {
    super.onCreate(bloc);
    debugPrint('onCreate -- ${bloc.runtimeType}');
  }

  @override
  void onEvent(Bloc bloc, Object? event) {
    super.onEvent(bloc, event);
    debugPrint('onEvent -- ${bloc.runtimeType}, $event');
  }

  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);
    debugPrint('onChange -- ${bloc.runtimeType}, $change');
  }

  @override
  void onError(BlocBase bloc, Object error, StackTrace stackTrace) {
    debugPrint('onError -- ${bloc.runtimeType}, $error');
    super.onError(bloc, error, stackTrace);
  }

  @override
  void onClose(BlocBase bloc) {
    super.onClose(bloc);
    debugPrint('onClose -- ${bloc.runtimeType}');
  }
}
