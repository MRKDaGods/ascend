import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/pages/job_details.dart';

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
              //color: isDarkMode ? Colors.white : Colors.black,
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
                //color: Colors.grey,
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
                //color: Colors.grey,
              ),
              overflow: TextOverflow.visible,
              softWrap: true,
            ),
          ),
          SizedBox(height: 10),

          ...jobs.take(3).map((job) {
            return Column(
              children: [
                jobCard(
                  context: context,
                  job: job,
                  isDarkMode: isDarkMode,
                  onRemove: onRemove,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => JobDetailsPage(job: job),
                      ),
                    );
                  },
                ),
                Divider(
                  //color: isDarkMode ? Colors.grey[800] : Colors.grey[300],
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
                    Text("Show all ", style: TextStyle()),
                    Icon(Icons.arrow_forward),
                  ],
                ),
              ),
            ),
        ],
      ],
    );
  }
}
