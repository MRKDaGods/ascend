import 'package:ascend_app/features/StartPages/Model/secure_storage_helper.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/SignIn.dart';
import 'package:ascend_app/features/settings/Presentation/pages/advertising_data_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/data_privacy_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/help_center_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/notifications_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/sign_out_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/visibility_page.dart';
import 'package:ascend_app/shared/navigation/main_navigation.dart';
import 'package:ascend_app/theme.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/welcome.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/profile/bloc/user_profile_bloc.dart';
import 'features/profile/bloc/user_profile_event.dart';
import 'features/home/bloc/post_bloc/post_bloc.dart';
import 'features/home/bloc/post_bloc/post_event.dart';
import 'features/home/repositories/post_repository.dart';
import 'package:ascend_app/features/settings/presentation/pages/settings_main_page.dart';
import 'package:ascend_app/features/settings/presentation/pages/account_preferences_page.dart';
import 'package:ascend_app/features/settings/presentation/pages/sign_in_security_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized(); // Ensure Flutter is initialized

  // Debugging: Print stored values
  final isFirstTime = await SecureStorageHelper.isFirstTimeUser();
  final authToken = await SecureStorageHelper.getAuthToken();
  print('Is First Time User: $isFirstTime');
  print('Auth Token: $authToken');
  //-------------
  // WidgetsFlutterBinding.ensureInitialized(); // Ensure Flutter is initialized
  // await SecureStorageHelper.setFirstTimeUser(
  //   true,
  // ); // Reset first-time user flag for testing

  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _getInitialRoute(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator(); // Show loading indicator
        }

        final initialRoute = snapshot.data as String;

        return MultiBlocProvider(
          providers: [
            BlocProvider<UserProfileBloc>(
              create:
                  (context) => UserProfileBloc()..add(const LoadUserProfile()),
            ),
            BlocProvider<PostBloc>(
              create:
                  (context) =>
                      PostBloc(PostRepository())..add(const LoadPosts()),
            ),
            // Add other BLoCs here as needed
          ],
          child: MaterialApp(
            theme: AppTheme.light,
            darkTheme: AppTheme.dark,
            debugShowCheckedModeBanner: false,
            initialRoute: initialRoute,
            routes: {
              '/': (context) => const Welcome(),
              '/signIn': (context) => const SignInPage(),
              '/home': (context) => const MainNavigation(),
              '/settings': (context) => const SettingsMainPage(),
              '/accountPreferences':
                  (context) => const AccountPreferencesPage(),
              '/signInSecurity': (context) => const SignInSecurityPage(),
              "/visibility": (context) => const VisibilityPage(),
              '/dataPrivacy': (context) => const DataPrivacyPage(),
              '/advertisingData': (context) => const AdvertisingDataPage(),
              '/notifications': (context) => const NotificationsPage(),
              '/helpCenter': (context) => const HelpCenterPage(),
              '/privacyPolicy': (context) => const HelpCenterPage(),
              '/signOut': (context) => const SignOutPage(),
              // Add other routes here
            },
          ),
        );
      },
    );
  }

  Future<String> _getInitialRoute() async {
    final isFirstTime = await SecureStorageHelper.isFirstTimeUser();
    if (isFirstTime) {
      // Do NOT set the flag to false here. Let the Welcome page handle it.
      return '/'; // Route to Welcome page
    }

    final authToken = await SecureStorageHelper.getAuthToken();
    return authToken != null ? '/home' : '/signIn'; // Route based on auth token
  }
}
