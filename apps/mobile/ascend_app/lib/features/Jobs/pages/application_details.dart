import 'package:flutter/material.dart';

class ApplicationDetails extends StatelessWidget {
  final String name;
  final String email;
  final String resumeUrl;

  const ApplicationDetails({
    Key? key,
    required this.name,
    required this.email,
    required this.resumeUrl,
  }) : super(key: key);

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
              'Name: $name',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('Email: $email', style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 16),
            const Text(
              'Resume:',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () {
                // Open the resume URL in a browser
                // You can use the `url_launcher` package for this
              },
              child: Text(
                resumeUrl,
                style: const TextStyle(
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
