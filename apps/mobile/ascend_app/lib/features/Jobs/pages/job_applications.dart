import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:flutter/material.dart';

import 'dart:convert';
import 'application_details.dart';

class JobApplications extends StatefulWidget {
  final int jobId;

  const JobApplications({super.key, required this.jobId});

  @override
  _JobApplicationsState createState() => _JobApplicationsState();
}

class _JobApplicationsState extends State<JobApplications> {
  List<dynamic> applications = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchApplications();
  }

  Future<void> fetchApplications() async {
    final apiClient = ApiClient();
    final job = widget.jobId;
    try {
      final response = await apiClient.get('/job/$job/applications?page=1');
      print("response: ${response.body}");
      print("status code: ${response.statusCode}");
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          applications = data['data'];
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load applications');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error fetching applications: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Job Applications')),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : applications.isEmpty
              ? const Center(child: Text('No applications found.'))
              : ListView.builder(
                itemCount: applications.length,
                itemBuilder: (context, index) {
                  final application = applications[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: ListTile(
                      title: Text(
                        application['user_full_name'] ?? 'No Name Provided',
                      ),
                      subtitle: Text(
                        application['email'] ?? 'No Email Provided',
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => ApplicationDetails(
                                  status: application['status'] ?? 'No Status',
                                  name:
                                      application['user_full_name'] ??
                                      'No Name Provided',
                                  email:
                                      application['email'] ??
                                      'No Email Provided',
                                  resumeUrl: application['resume_url'] ?? '',
                                  applicationId:
                                      application['application_id'] ?? 0,
                                ),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
    );
  }
}
