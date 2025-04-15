import 'package:ascend_app/features/StartPages/Presentation/Pages/welcome.dart';
import 'package:flutter/material.dart';

import '../../features/notifications/presentation/pages/notifications_page.dart';
// Import other page files as needed

/// Class containing all the route names as constants
class RouteNames {
  // Private constructor to prevent instantiation
  RouteNames._();
  
  // Route name constants
  static const String welcome = '/welcome';
  static const String notifications = '/notifications';
  static const String home = '/home';
  static const String profile = '/profile';
  static const String settings = '/settings';
  // Add more routes as needed
}

/// Class that defines all application routes
class AppRoutes {
  // Private constructor to prevent instantiation
  AppRoutes._();
  
  /// The initial route when the app starts
  static const String initialRoute = '/';
  
  /// Route definitions for MaterialApp
  static Map<String, WidgetBuilder> getRoutes() {
    return {
      RouteNames.notifications: (context) => const NotificationsPage(),
      RouteNames.welcome: (context) => const Welcome(),
      // Add more routes as needed
    };
  }
  
  /// Get the initial page widget for the app
  static Widget getInitialPage() {
    // You can add logic here to determine the initial page
    // based on authentication state or first-time user, etc.
    return const SplashScreen();
  }
  
  /// Handle dynamic routes or complex navigation logic
  static Route<dynamic>? onGenerateRoute(RouteSettings settings) {
    // Handle routes that aren't defined in the routes map
    // or routes with dynamic parameters
    
    final args = settings.arguments;
    
    switch (settings.name) {
      case '/post-details':
        // Example of a dynamic route with parameters
        if (args is Map<String, dynamic> && args.containsKey('postId')) {
          final postId = args['postId'];
          return MaterialPageRoute(
            builder: (context) => PostDetailsPage(postId: postId),
          );
        }
        return _errorRoute();
        
      default:
        return _errorRoute();
    }
  }
  
  /// Fallback for undefined routes
  static Route<dynamic> _errorRoute() {
    return MaterialPageRoute(
      builder: (_) => Scaffold(
        appBar: AppBar(
          title: const Text('Error'),
        ),
        body: const Center(
          child: Text('Route not found'),
        ),
      ),
    );
  }
}

/// Example of a dynamic route page class
class PostDetailsPage extends StatelessWidget {
  final String postId;
  
  const PostDetailsPage({
    Key? key,
    required this.postId,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post Details'),
      ),
      body: Center(
        child: Text('Post ID: $postId'),
      ),
    );
  }
}

/// Splash screen widget
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
        Navigator.of(context).pushReplacementNamed(RouteNames.welcome);
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