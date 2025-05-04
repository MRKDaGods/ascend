import 'package:flutter/material.dart';

class UserCard extends StatelessWidget {
  final String name;
  final String email;
  final String? date;
  final int? reports;
  final List<Widget> actions;

  const UserCard({
    Key? key,
    required this.name,
    required this.email,
    this.date,
    this.reports,
    required this.actions,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 4),
            Text(
              email,
              style: const TextStyle(color: Colors.black87, fontSize: 16),
            ),
            if (date != null)
              Text(
                'Date: $date',
                style: const TextStyle(color: Colors.black87, fontSize: 16),
              ),
            if (reports != null)
              Text(
                'Reports: $reports',
                style: const TextStyle(color: Colors.black87, fontSize: 16),
              ),
            const SizedBox(height: 8),
            Row(children: actions),
          ],
        ),
      ),
    );
  }
}