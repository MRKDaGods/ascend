import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApplicationDetails extends StatefulWidget {
  final String name;
  final String email;
  final String phone; // Added phone number
  final String resumeUrl;
  final int applicationId;
  final String status;
  const ApplicationDetails({
    super.key,
    required this.name,
    required this.email,
    required this.phone, // Added phone number
    required this.resumeUrl,
    required this.applicationId,
    required this.status,
  });

  @override
  _ApplicationDetailsState createState() => _ApplicationDetailsState();
}

class _ApplicationDetailsState extends State<ApplicationDetails> {
  String? _selectedStatus;

  @override
  void initState() {
    super.initState();
    _selectedStatus = widget.status; // Default status
  }

  // Future<void> _fetchApplicationStatus() async {
  //   try {
  //     final token = await SecureStorageHelper.getAuthToken();
  //     final appId = widget.applicationId.toString();
  //     final response = await http.get(
  //       Uri.parse('https://api.ascendx.tech/job/applications/$appId/status'),
  //       headers: {
  //         'Authorization': 'Bearer $token',
  //         'Accept': 'application/json',
  //       },
  //     );
  //     print('Response status: ${response.statusCode}');
  //     print('Response body: ${response.body}');
  //     if (response.statusCode == 200) {
  //       final data = json.decode(response.body);
  //       setState(() {
  //         _selectedStatus = data['status'];
  //       });
  //     } else {
  //       throw Exception('Failed to fetch application status');
  //     }
  //   } catch (e) {
  //     ScaffoldMessenger.of(
  //       context,
  //     ).showSnackBar(SnackBar(content: Text('Error fetching status: $e')));
  //   }
  // }

  Future<void> _downloadResume(BuildContext context, String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not open the resume.')),
      );
    }
  }

  Future<void> _updateApplicationStatus(String status) async {
    try {
      final appId = widget.applicationId.toString();
      final token = await SecureStorageHelper.getAuthToken();

      final response = await http.patch(
        Uri.parse('https://api.ascendx.tech/job/applications/$appId/status'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json.encode({'status': status}),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Application status updated to $status.')),
        );
      } else {
        throw Exception('Failed to update application status');
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error updating status: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Application Details')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Name: ${widget.name}',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Email: ${widget.email}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Phone: ${widget.phone}', // Show phone number
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            const Text(
              'Resume:',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () {
                if (widget.resumeUrl.isNotEmpty) {
                  _downloadResume(context, widget.resumeUrl);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('No resume URL provided.')),
                  );
                }
              },
              child: Text(
                widget.resumeUrl.isNotEmpty
                    ? 'Download Resume'
                    : 'No Resume URL',
                style: const TextStyle(
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Update Application Status:',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedStatus,
              items:
                  ['Pending', 'Viewed', 'Rejected', 'Accepted']
                      .map(
                        (status) => DropdownMenuItem(
                          value: status,
                          child: Text(status),
                        ),
                      )
                      .toList(),
              onChanged: (value) {
                setState(() {
                  _selectedStatus = value;
                });
              },
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 12),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                if (_selectedStatus != null) {
                  await _updateApplicationStatus(_selectedStatus!);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Please select a status to update.'),
                    ),
                  );
                }
              },
              child: const Text('Update Status'),
            ),
          ],
        ),
      ),
    );
  }
}
