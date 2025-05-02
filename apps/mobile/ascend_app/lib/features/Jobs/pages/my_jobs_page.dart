import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'dart:convert';
import 'package:http/http.dart' as http; // Import http package
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class MyJobsPage extends StatefulWidget {
  @override
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
                  .map(
                    (job) => Jobsattributes(
                      jobID: job['job_id'],
                      title: job['title'],
                      company: job['company_name'],
                      location: job['location'],
                      experienceLevel: job['experience_level'],
                      salaryMinRange: job['salary_min_range'],
                      salaryMaxRange: job['salary_max_range'],
                      easyapply:
                          false, // Assuming easy apply is not provided in the response
                      jobDescription: job['description'],
                      isRemote: job['workplace_type'] == 'Remote',
                      isHybrid: job['workplace_type'] == 'Hybrid',
                      isPartTime: job['type'] == 'Part-time',
                      companyPhoto: job['company_logo_url'],
                      createdAt:
                          DateTime.tryParse(job['saved_at'] ?? '') ??
                          DateTime.now(),
                    ),
                  )
                  .toList();
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to fetch saved jobs: ${response.body}'),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
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
