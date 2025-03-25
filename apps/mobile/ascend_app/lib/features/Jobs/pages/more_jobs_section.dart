import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/jobcard.dart';
import 'package:ascend_app/features/Jobs/pages/job_details.dart';

class MoreJobsSection extends StatelessWidget {
  final bool isDarkMode;
  final List<Jobsattributes> jobs;
  final void Function(Jobsattributes) onRemove;

  const MoreJobsSection({
    super.key,
    required this.isDarkMode,
    required this.jobs,
    required this.onRemove,
  });

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
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: 10),
          if (jobs.isEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(
                    left: 16.0,
                    top: 10,
                    bottom: 10,
                  ),
                  child: Text(
                    "No jobs available at the moment.",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                ),
                Container(
                  height: 10,
                  color:
                      isDarkMode
                          ? Colors.black
                          : Colors.grey[300], // Gray if not dark mode
                ),
              ],
            )
          else
            ...jobs.map((job) {
              return jobCard(
                job: job,
                isDarkMode: isDarkMode,
                onRemove: onRemove,
                onTap: () {
                  // Navigate to the JobDetailsPage
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => JobDetailsPage(job: job),
                    ),
                  );
                },
              );
            }),
        ],
      ),
    );
  }
}
