import 'package:flutter/material.dart';

class ExploreSection extends StatelessWidget {
  final bool isDarkMode;

  const ExploreSection({super.key, required this.isDarkMode});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Explore Jobs",
            style: TextStyle(
              color: isDarkMode ? Colors.white : Colors.black,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 10),
          // Add more UI elements related to exploring jobs
          Placeholder(fallbackHeight: 100), // Placeholder for job collection UI
        ],
      ),
    );
  }
}
