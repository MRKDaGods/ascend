import 'package:ascend_app/features/profile/bloc/user_profile_event.dart';
import 'package:ascend_app/theme.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/welcome.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:async';
import 'features/profile/bloc/user_profile_bloc.dart';
import 'features/home/bloc/post_bloc/post_bloc.dart';
import 'features/home/repositories/post_repository.dart';

// Custom BlocObserver to trace all bloc events and state changes
class AppBlocObserver extends BlocObserver {
  @override
  void onCreate(BlocBase bloc) {
    super.onCreate(bloc);

  }

  @override
  void onEvent(Bloc bloc, Object? event) {
    super.onEvent(bloc, event);

  }

  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);

  }

  @override
  void onError(BlocBase bloc, Object error, StackTrace stackTrace) {

    super.onError(bloc, error, stackTrace);
  }

  @override
  void onClose(BlocBase bloc) {
    super.onClose(bloc);

  }
}

void main() {
  // Set up error handling
  FlutterError.onError = (FlutterErrorDetails details) {

    FlutterError.dumpErrorToConsole(details);
  };

  // Set up global error handling
  runZonedGuarded(() {
    // Initialize Flutter binding
    WidgetsFlutterBinding.ensureInitialized();
    
    // Set up bloc observer
    Bloc.observer = AppBlocObserver();
    
    // Optimize image caching
    PaintingBinding.instance.imageCache.maximumSizeBytes = 100 * 1024 * 1024; // 100 MB
    

    runApp(const MainApp());
  }, (error, stackTrace) {

  });
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {

    return MultiBlocProvider(
      providers: [
        // Initialize UserProfileBloc and load profile data at startup
        BlocProvider<UserProfileBloc>(
          create: (context) => UserProfileBloc()..add(LoadUserProfile()),
        ),
        
        // Initialize PostBloc lazily - only create it, don't load data yet
        BlocProvider<PostBloc>(
          create: (context) {

            try {
              final repo = PostRepository();

              final bloc = PostBloc(repo);

              return bloc;
            } catch (e) {

              // Return a minimal implementation to avoid crashes
              return PostBloc(PostRepository());
            }
          },
          // We'll load posts when needed, not at startup
        ),
        // Add other BLoCs here as needed
      ],
      child: MaterialApp(
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        debugShowCheckedModeBanner: false,
        // Improve performance with optimized scroll behavior
        builder: (context, child) {
          return ScrollConfiguration(
            behavior: ScrollBehavior().copyWith(
              physics: const BouncingScrollPhysics(),
              overscroll: false,
            ),
            child: child!,
          );
        },
        home: const SplashScreen(),
      ),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    try {
      // Initialize critical services here
      await Future.delayed(const Duration(seconds: 2));
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const Welcome()),
        );
      }
    } catch (e) {
      // Handle initialization errors
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            CircularProgressIndicator(),
            SizedBox(height: 24),
            Text("Loading Ascend...", style: TextStyle(fontSize: 18)),
          ],
        ),
      ),
    );
  }
}