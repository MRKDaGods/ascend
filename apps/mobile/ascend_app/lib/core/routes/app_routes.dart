import 'package:ascend_app/features/StartPages/Presentation/Pages/welcome.dart';
import 'package:ascend_app/features/settings/Presentation/pages/account_preferences_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/settings_main_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/sign_in_security_page.dart';
import 'package:flutter/material.dart';
import '../../features/home/presentation/pages/create_post_page.dart'; // Import the new page
import 'package:ascend_app/features/settings/Presentation/pages/advertising_data_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/data_privacy_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/help_center_page.dart';
import 'package:ascend_app/features/notifications/presentation/pages/notifications_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/sign_out_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/visibility_page.dart';
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
  static const String createPost = '/create-post'; // Add new route name
  static const String accountPreferences = '/accountPreferences';
  static const String signInSecurity = '/signInSecurity';
  static const String visibility = '/visibility';
  static const String dataPrivacy = '/dataPrivacy';
  static const String advertisingData = '/advertisingData';
  static const String helpCenter = '/helpCenter';
  static const String privacyPolicy = '/privacyPolicy';
  static const String signOut = '/signOut';
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
      RouteNames.createPost:
          (context) => const CreatePostPage(), // Add the new route
      RouteNames.settings: (context) => const SettingsMainPage(),
      RouteNames.accountPreferences:
          (context) => const AccountPreferencesPage(),
      RouteNames.signInSecurity: (context) => const SignInSecurityPage(),
      RouteNames.visibility: (context) => const VisibilityPage(),
      RouteNames.dataPrivacy: (context) => const DataPrivacyPage(),
      RouteNames.advertisingData: (context) => const AdvertisingDataPage(),
      RouteNames.helpCenter: (context) => const HelpCenterPage(),
      RouteNames.privacyPolicy: (context) => const HelpCenterPage(),
      RouteNames.signOut: (context) => const SignOutPage(),

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
      builder:
          (_) => Scaffold(
            appBar: AppBar(title: const Text('Error')),
            body: const Center(child: Text('Route not found')),
          ),
    );
  }
}

/// Example of a dynamic route page class
class PostDetailsPage extends StatelessWidget {
  final String postId;

  const PostDetailsPage({super.key, required this.postId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Post Details')),
      body: Center(child: Text('Post ID: $postId')),
    );
  }
}

/// Splash screen widget
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

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
