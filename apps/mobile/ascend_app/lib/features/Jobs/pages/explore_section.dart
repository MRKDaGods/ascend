import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/more_categories_section.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

class ExploreScreen extends StatelessWidget {
  final List<String> categories = [
    'Technology',
    'Health',
    'Science',
    'Business',
    'Education',
    'Sports',
  ];
  final bool isDarkMode;
  final List<Jobsattributes> jobs; // Add jobs parameter

  ExploreScreen({
    super.key,
    required this.isDarkMode,
    required this.jobs, // Initialize jobs
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 16, top: 5),
          child: Text(
            "Explore with job collections",
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.bold,
              color: isDarkMode ? Colors.white : Colors.black,
            ),
          ),
        ),
        Wrap(
          children: [
            Row(
              children: [
                _tabItem(Icons.flash_on, "Easy Apply", () {
                  print("Easy Apply clicked");
                }, isDarkMode),
                _tabItem(Icons.access_time, "Part Time", () {
                  print("Part Time clicked");
                }, isDarkMode),
                _tabItem(Icons.work_outline, "Remote", () {
                  print("Remote clicked");
                }, isDarkMode),
                _tabItem(Icons.more_horiz, "More", () {
                  print("More clicked");
                }, isDarkMode),
              ],
            ),
          ],
        ),
      ],
    );
  }
}

// Function to create a clickable tab item
Widget _tabItem(
  IconData icon,
  String label,
  VoidCallback onTap,
  bool isDarkMode,
) {
  return Expanded(
    child: GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 24, color: Colors.blue),
          SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isDarkMode ? Colors.white : Colors.black,
            ),
          ),
        ],
      ),
    ),
  );
}
