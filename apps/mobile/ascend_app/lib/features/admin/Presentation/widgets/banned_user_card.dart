import 'package:flutter/material.dart';

class BannedUserCard extends StatelessWidget {
  final String name;
  final String email;
  final String date;
  final VoidCallback onUnban;

  const BannedUserCard({
    super.key,
    required this.name,
    required this.email,
    required this.date,
    required this.onUnban,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User details
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  email,
                  style: const TextStyle(color: Colors.black87, fontSize: 16),
                ),
                Text(
                  date,
                  style: const TextStyle(color: Colors.black87, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Unban button row
            Row(
              mainAxisAlignment:
                  MainAxisAlignment.end, // Align to the far right
              children: [
                ElevatedButton.icon(
                  onPressed: onUnban,
                  icon: const Icon(Icons.undo, color: Colors.white),
                  label: const Text(
                    'Unban',
                    style: TextStyle(color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
