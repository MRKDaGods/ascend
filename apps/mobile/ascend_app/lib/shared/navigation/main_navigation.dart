import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ascend_app/features/home/presentation/pages/home.dart';
import 'package:ascend_app/features/Jobs/jobapp.dart';
import 'package:ascend_app/features/networks/pages/networks.dart';
import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:ascend_app/features/UserPage/Data/dummy_profile_sections.dart';
import 'package:ascend_app/features/notifications/presentation/pages/notifications_page.dart'; // Add this import
import 'package:ascend_app/features/CompanyPage/company_page.dart';
import 'package:ascend_app/features/CompanyPage/Data/dummy_page_sections.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;
  bool isDarkMode = false;
  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      Home(),
      //Center(child: Text("Video")),
      UserProfilePage(sections: sections),

      Networks(),
      NotificationsPage(), // Replace the placeholder with your actual notifications page
      JobApp(isDarkMode: isDarkMode),
    ];
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        final shouldExit = await showDialog<bool>(
          context: context,
          builder:
              (context) => AlertDialog(
                title: const Text('Exit App'),
                content: const Text('Are you sure you want to close the app?'),
                actions: [
                  TextButton(
                    onPressed:
                        () =>
                            Navigator.of(context).pop(false), // Stay in the app
                    child: const Text('Cancel'),
                  ),
                  TextButton(
                    onPressed: () => SystemNavigator.pop(), // Close the app
                    child: const Text('Exit'),
                  ),
                ],
              ),
        );
        return shouldExit ?? false;
      },
      child: Scaffold(
        body: IndexedStack(index: _selectedIndex, children: _pages),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _selectedIndex,
          type: BottomNavigationBarType.fixed,
          onTap: _onItemTapped,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(
              icon: Icon(Icons.video_library),
              label: 'Video',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.groups),
              label: 'Networks',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.notifications),
              label: 'Notifications',
            ),
            BottomNavigationBarItem(icon: Icon(Icons.work), label: 'Jobs'),
          ],
        ),
      ),
    );
  }
}
