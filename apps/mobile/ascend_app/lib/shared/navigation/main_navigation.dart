import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/pages/home.dart';
import 'package:ascend_app/features/Jobs/jobapp.dart';
import 'package:ascend_app/features/networks/pages/networks.dart';

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
      Center(child: Text("Video")),
      Networks(),
      Center(child: Text("Notifications")),
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
    return Scaffold(
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
          BottomNavigationBarItem(icon: Icon(Icons.groups), label: 'Networks'),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: 'Notifications',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.work), label: 'Jobs'),
        ],
      ),
    );
  }
}
