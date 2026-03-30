import 'package:flutter/material.dart';
import 'package:http/http.dart' as http; // Import http package
import 'dart:convert'; // Import for JSON encoding
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

Future<void> postFeedback(
  BuildContext context,
  int jobId,
  String reason,
) async {
  final String baseUrl = 'https://api.ascendx.tech';
  final String endpoint = '/job';
  final token = await SecureStorageHelper.getAuthToken();

  try {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint/$jobId/report'),
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'reason': reason}),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Feedback submitted successfully!')),
      );
      Navigator.pop(context); // Go back a page
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to submit feedback: ${response.body}')),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('An error occurred: $e')));
  }
}

class ReportPage extends StatelessWidget {
  final int jobId;

  const ReportPage({super.key, required this.jobId});

  @override
  Widget build(BuildContext context) {
    final TextEditingController controller = TextEditingController();

    return Scaffold(
      resizeToAvoidBottomInset:
          true, // Ensures the UI adjusts when the keyboard is opened
      appBar: AppBar(title: const Text('Report')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Reason for Report',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: controller,
              maxLines: 5,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Enter the reason for reporting this job',
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                final reason = controller.text;
                if (reason.isNotEmpty) {
                  // Call the postFeedback method or handle the report submission
                  postFeedback(context, jobId, reason);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Please enter a reason.')),
                  );
                }
              },
              child: const Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }
}
