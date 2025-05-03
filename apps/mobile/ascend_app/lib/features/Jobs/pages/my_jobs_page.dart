import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';

import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'dart:convert';

class MyJobsPage extends StatefulWidget {
  const MyJobsPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _MyJobsPageState createState() => _MyJobsPageState();
}

class _MyJobsPageState extends State<MyJobsPage> {
  List<Jobsattributes> savedJobs = [];

  @override
  void initState() {
    super.initState();
    getSavedJobs();
  }

  Future<void> getSavedJobs() async {
    final apiClient = ApiClient();
    try {
      final response = await apiClient.get('/job/saved');
      if (response.statusCode == 200) {
        final List<dynamic> jobsData = jsonDecode(response.body)['data'];
        setState(() {
          savedJobs =
              jobsData
                  .map((data) {
                    try {
                      return Jobsattributes.fromJson(data);
                    } catch (e) {
                      print('Error parsing job data: $e');
                      return null;
                    }
                  })
                  .where((job) => job != null)
                  .cast<Jobsattributes>()
                  .toList();
        });
      } else {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to fetch saved jobs: ${response.body}'),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        // ignore: use_build_context_synchronously
        context,
      ).showSnackBar(SnackBar(content: Text('An error occurred: $e')));
    }
  }

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
                  savedJobs
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
