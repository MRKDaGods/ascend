import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:flutter/material.dart';

class MyJobsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 5,
      child: Scaffold(
        appBar: AppBar(
          title: Text('My Jobs'),
          bottom: TabBar(
            tabs: [
              Tab(text: 'Saved'),
              Tab(text: 'Pending'),
              Tab(text: 'Viewed'),
              Tab(text: 'Rejected'),
              Tab(text: 'Accepted'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Saved Jobs Tab
            ListView(
              children:
                  jobsDummy
                      .where((job) => job.isBookmarked)
                      .map(
                        (job) => jobCard(
                          context: context,
                          job: job,
                          isDarkMode: false, // Adjust based on theme
                          onRemove: (removedJob) {
                            // Handle job removal logic here
                          },
                          onTap: () {},
                        ),
                      )
                      .toList(),
            ),
            // Pending Jobs Tab
            ListView(
              children:
                  jobsDummy
                      .where((job) => job.applicationStatus == 'Pending')
                      .map(
                        (job) => jobCard(
                          context: context,
                          job: job,
                          isDarkMode: false,
                          onRemove: (removedJob) {},
                          onTap: () {},
                        ),
                      )
                      .toList(),
            ),
            // Viewed Jobs Tab
            ListView(
              children:
                  jobsDummy
                      .where((job) => job.viewed == true)
                      .map(
                        (job) => jobCard(
                          context: context,
                          job: job,
                          isDarkMode: false,
                          onRemove: (removedJob) {},
                          onTap: () {},
                        ),
                      )
                      .toList(),
            ),
            // Rejected Jobs Tab
            ListView(
              children:
                  jobsDummy
                      .where((job) => job.applicationStatus == 'Rejected')
                      .map(
                        (job) => jobCard(
                          context: context,
                          job: job,
                          isDarkMode: false,
                          onRemove: (removedJob) {},
                          onTap: () {},
                        ),
                      )
                      .toList(),
            ),
            // Accepted Jobs Tab
            ListView(
              children:
                  jobsDummy
                      .where((job) => job.applicationStatus == 'Accepted')
                      .map(
                        (job) => jobCard(
                          context: context,
                          job: job,
                          isDarkMode: false,
                          onRemove: (removedJob) {},
                          onTap: () {},
                        ),
                      )
                      .toList(),
            ),
          ],
        ),
      ),
    );
  }
}
