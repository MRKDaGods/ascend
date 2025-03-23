import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:ascend_app/features/Jobs/jobcard.dart';

class JobPicksSection extends StatelessWidget {
  final bool isDarkMode;

  const JobPicksSection({super.key, required this.isDarkMode});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Job Picks for You",
            style: TextStyle(
              color: isDarkMode ? Colors.white : Colors.black,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 10),
          ...jobs.take(3).map((job) => jobCard(job, isDarkMode: isDarkMode)),
        ],
      ),
    );
  }
}
