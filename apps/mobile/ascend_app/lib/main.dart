
import 'package:ascend_app/features/Home/home.dart';
import 'package:ascend_app/features/Networks/networks.dart';
import 'package:flutter/material.dart';



void main() {
  runApp(const MainApp());
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  _MainAppState createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  int _selectedIndex = 0;
  static final List<Widget> _pages = <Widget>[
    Home(),
    Home(),
    Networks(),
    Home(),
    Home(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: _pages.elementAt(_selectedIndex),
        bottomNavigationBar: BottomNavigationBar(
          
          fixedColor: Color.fromARGB(255, 0, 0, 0),
          unselectedItemColor: const Color.fromARGB(255, 88, 88, 88),
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.video_library),
              label: 'Video',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.groups),
              label: 'My Network',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.notifications),
              label: 'Notifications',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.work_rounded),
              label: 'Jobs',
            ),
          ],
        ),
      ),
    );
  }
}
