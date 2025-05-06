import 'package:ascend_app/features/home/presentation/pages/create_post_page.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/pages/home.dart';
import 'package:ascend_app/features/Jobs/jobapp.dart';
import 'package:ascend_app/features/networks/pages/networks.dart';

import 'package:ascend_app/features/notifications/presentation/pages/notifications_page.dart'; // Add this import

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;
  bool isDarkMode = false;

  @override
  void initState() {
    super.initState();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final pages = [
      Home(),
      Networks(),
      CreatePostPage(),
      NotificationsPage(),
      JobApp(isDarkMode: isDarkMode),
    ];

    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: pages),
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -1),
                ),
              ],
              color: isDark ? Colors.black : Colors.white,
            ),
            child: BottomNavigationBar(
              currentIndex: _selectedIndex,
              type: BottomNavigationBarType.fixed,
              onTap: _onItemTapped,
              backgroundColor: isDark ? Colors.black : Colors.white,
              selectedItemColor: const Color(
                0xFF0077B5,
              ), // Back to LinkedIn blue for text/icons
              unselectedItemColor: isDark ? Colors.grey[400] : Colors.grey[600],
              selectedFontSize: 11,
              unselectedFontSize: 11,
              iconSize: 24,
              elevation: 0,
              showSelectedLabels: true,
              showUnselectedLabels: true,
              items: [
                _buildNavItem(
                  Icons.home_filled,
                  Icons.home_outlined,
                  'Home',
                  0,
                ),
                _buildNavItem(
                  Icons.group,
                  Icons.group_outlined,
                  'My Network',
                  1,
                ),
                _buildNavItem(Icons.add_box, Icons.add_box_outlined, 'Post', 2),
                _buildNavItem(
                  Icons.notifications,
                  Icons.notifications_outlined,
                  'Notifications',
                  3,
                ),
                _buildNavItem(Icons.work, Icons.work_outline, 'Jobs', 4),
              ],
            ),
          ),
        ],
      ),
    );
  }

  BottomNavigationBarItem _buildNavItem(
    IconData selectedIcon,
    IconData unselectedIcon,
    String label,
    int index,
  ) {
    final isSelected = _selectedIndex == index;
    return BottomNavigationBarItem(
      icon: Container(
        decoration: BoxDecoration(
          border:
              isSelected
                  ? const Border(
                    top: BorderSide(
                      color: Color(0xFF0077B5),
                      width: 2.5, // Slightly thicker line
                    ),
                  )
                  : null,
        ),
        padding: const EdgeInsets.only(top: 5.0),
        child: Icon(isSelected ? selectedIcon : unselectedIcon),
      ),
      label: label,
    );
  }
}
