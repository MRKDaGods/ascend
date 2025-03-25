import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/jobcard.dart';

class JobPicksSection extends StatelessWidget {
  final bool isDarkMode;
  final List<Jobsattributes> jobs;
  final void Function(Jobsattributes) onRemove;
  const JobPicksSection({
    super.key,
    required this.isDarkMode,
    required this.jobs,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 16, top: 5),
          child: Text(
            "Job picks for you",
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.bold,
              color: isDarkMode ? Colors.white : Colors.black,
            ),
          ),
        ),
        if (jobs.isEmpty)
          Padding(
            padding: const EdgeInsets.only(left: 16.0, top: 10, bottom: 10),
            child: Text(
              "No jobs available at the moment.",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          )
        else ...[
          Padding(
            padding: const EdgeInsets.only(left: 16.0, right: 16),
            child: Text(
              "Based on your profile, preferences, and activity like applies, searches, and saves",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
              overflow: TextOverflow.visible,
              softWrap: true,
            ),
          ),
          ...jobs.take(3).map((job) {
            return Column(
              children: [
                jobCard(job: job, isDarkMode: isDarkMode, onRemove: onRemove),
                Divider(
                  color: isDarkMode ? Colors.grey[800] : Colors.grey[300],
                  thickness: 1,
                  height: 10,
                ),
              ],
            );
          }),
          const SizedBox(height: 5),
          if (jobs.length > 3)
            Center(
              child: TextButton(
                onPressed: () {
                  // Handle "Show all" button press
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text("Show all ", style: TextStyle(color: Colors.grey)),
                    Icon(Icons.arrow_forward, color: Colors.grey),
                  ],
                ),
              ),
            ),
        ],
      ],
    );
  }
}
