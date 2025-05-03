import 'package:ascend_app/features/Jobs/pages/create_new_job.dart';
import 'package:ascend_app/features/Jobs/pages/job_applications.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:flutter/material.dart';

import 'dart:convert';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

class CompanyDetails extends StatefulWidget {
  final int companyId;

  const CompanyDetails({super.key, required this.companyId});

  @override
  // ignore: library_private_types_in_public_api
  _CompanyDetailsState createState() => _CompanyDetailsState();
}

class _CompanyDetailsState extends State<CompanyDetails> {
  List<dynamic> jobs = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchJobs();
  }

  Future<void> fetchJobs() async {
    final apiClient = ApiClient();

    try {
      final response = await apiClient.get(
        '/job/company/${widget.companyId}?page=1',
      );

      if (response.statusCode == 200) {
        setState(() {
          jobs = json.decode(response.body)['data'];
          isLoading = false;
        });
      } else {
        print("Response: ${response.body}");
        throw Exception('Failed to load jobs');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      print("Error: $e");
      ScaffoldMessenger.of(
        // ignore: use_build_context_synchronously
        context,
      ).showSnackBar(SnackBar(content: Text('Error fetching jobs: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Company Details')),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : jobs.isEmpty
              ? const Center(child: Text('No jobs found.'))
              : ListView.builder(
                itemCount: jobs.length,
                itemBuilder: (context, index) {
                  final job = jobs[index];
                  return jobCard(
                    context: context,
                    job: Jobsattributes(
                      jobID: job['job_id'],
                      title: job['title'],
                      company: job['company_name'],
                      location: job['location'],
                      companyPhoto: job['company_logo_url'],
                      createdAt: DateTime.parse(job['created_at']),
                      alumniCount: 0, // Placeholder value
                      isPromoted: false, // Placeholder value
                      isBookmarked: false, // Placeholder value
                      viewed: false, // Placeholder value
                      easyapply: true, // Placeholder value
                      experienceLevel: job['experience_level'],
                      salaryMinRange:
                          job['salary_min_range'] ?? 0, // Default to 0 if null
                      salaryMaxRange:
                          job['salary_max_range'] ??
                          200000, // Default to 0 if null
                    ),
                    description: job['description'],
                    experienceLevel: job['experience_level'],
                    salaryMinRange: job['salary_min_range'] ?? 0,
                    salaryMaxRange: job['salary_max_range'] ?? 200000,
                    industry: job['industry'],
                    location: job['location'],
                    title: job['title'],
                    type: job['type'],
                    workplaceType: job['workplace_type'],
                    isDarkMode: false, // Adjust based on your app's theme
                    onRemove: (job) {},
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder:
                              (context) =>
                                  JobApplications(jobId: job['job_id']),
                        ),
                      );
                    },
                    isFromCompanyDetails:
                        true, // Indicate that this is from company details
                  );
                },
              ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to the create job page
          Navigator.push(
            context,
            MaterialPageRoute(
              builder:
                  (context) => CreateNewJob(
                    companyId: widget.companyId,
                    isEditMode: false,
                  ),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
