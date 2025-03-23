import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:ascend_app/features/Jobs/jobcard.dart';

class MoreJobsSection extends StatelessWidget {
  final bool isDarkMode;

  const MoreJobsSection({super.key, required this.isDarkMode});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "More Jobs for You",
            style: TextStyle(
              color: isDarkMode ? Colors.white : Colors.black,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 10),
          ...jobs.skip(3).map((job) => jobCard(job, isDarkMode: isDarkMode)),
        ],
      ),
    );
  }
}
