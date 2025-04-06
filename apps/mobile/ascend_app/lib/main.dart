import 'package:ascend_app/features/settings/Presentation/pages/advertising_data_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/data_privacy_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/help_center_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/notifications_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/sign_out_page.dart';
import 'package:ascend_app/features/settings/Presentation/pages/visibility_page.dart';
import 'package:ascend_app/theme.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/welcome.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/profile/bloc/user_profile_bloc.dart';
import 'features/profile/bloc/user_profile_event.dart';
import 'features/home/bloc/post_bloc/post_bloc.dart';
import 'features/home/bloc/post_bloc/post_event.dart';
import 'features/home/repositories/post_repository.dart';
import 'package:ascend_app/features/settings/presentation/pages/settings_main_page.dart';
import 'package:ascend_app/features/settings/presentation/pages/account_preferences_page.dart';
import 'package:ascend_app/features/settings/presentation/pages/sign_in_security_page.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<UserProfileBloc>(
          create: (context) => UserProfileBloc()..add(const LoadUserProfile()),
        ),
        BlocProvider<PostBloc>(
          create:
              (context) => PostBloc(PostRepository())..add(const LoadPosts()),
        ),
        // Add other BLoCs here as needed
      ],
      child: MaterialApp(
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        debugShowCheckedModeBanner: false,
        initialRoute: '/settings', // Set the initial route to '/'
        routes: {
          '/': (context) => const Welcome(), // Open Welcome page on app start
          '/settings': (context) => const SettingsMainPage(),
          '/accountPreferences': (context) => const AccountPreferencesPage(),
          '/signInSecurity': (context) => const SignInSecurityPage(),
          "/visibility": (context) => const VisibilityPage(),
          '/dataPrivacy': (context) => const DataPrivacyPage(),
          '/advertisingData': (context) => const AdvertisingDataPage(),
          '/notifications': (context) => const NotificationsPage(),
          // ------------------------------------
          '/helpCenter': (context) => const HelpCenterPage(),
          '/privacyPolicy': (context) => const HelpCenterPage(),
          '/signOut': (context) => const SignOutPage(),
          // Add other routes here
        },
      ),
    );
  }
}
