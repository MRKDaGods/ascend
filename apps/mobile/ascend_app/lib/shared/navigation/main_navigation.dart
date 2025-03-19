import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/pages/home.dart';
import 'package:ascend_app/features/Jobs/jobapp.dart';
import 'package:ascend_app/features/networks/pages/networks.dart';
import 'package:ascend_app/features/networks/presentation/networks.dart';
//import 'package:ascend_app/features/networks/presentation/networks.dart';
import 'package:ascend_app/features/UserPage/models/profile_section.dart';

final List<ProfileSection> sectionss = [
  ProfileSection(
    title: 'Highlights',
    content: [
      Text(
        'You both studied at Cairo University from 2021 to 2026',
        style: TextStyle(color: Colors.white, fontSize: 14),
      ),
    ],
  ),
  ProfileSection(
    title: 'Activity',
    content: [
      Text(
        'Hamada hasn’t posted yet',
        style: TextStyle(color: Colors.white, fontSize: 14),
      ),
    ],
  ),
  ProfileSection(
    title: 'Education',
    content: [
      Text(
        'Cairo University\nBachelor of Engineering - Computer Engineering\nOct 2021 - Jun 2026',
        style: TextStyle(color: Colors.white, fontSize: 14),
      ),
      Text(
        'Pioneers Language School\nHigh School\nSep 20 14 - Jun 2021',
        style: TextStyle(color: Colors.white, fontSize: 14),
      ),
    ],
  ),
  ProfileSection(
    title: 'Interests',
    content: [
      Text(
        'Cairo University',
        style: TextStyle(color: Colors.white, fontSize: 14),
      ),
      Text('Microsoft', style: TextStyle(color: Colors.white, fontSize: 14)),
      Text('Flutter', style: TextStyle(color: Colors.white, fontSize: 14)),
    ],
  ),
];


class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

    UserProfilePage(
      name: "Maged Amgad",
      bio: "sw",
      location: "Cairo,Egypt",
      latestEducation: "Cairo university",
      sections: sectionss,
    ),
    Home(),
    Center(child: Text("Video")),
    Networks(),
    Center(child: Text("Notifications")),
    JobApp(),
  ];

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
