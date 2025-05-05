import 'package:flutter/material.dart';

class ReportedUserCard extends StatefulWidget {
  final String name;
  final String email;
  final String date;
  final List<String> reports; // Updated to accept a list of report reasons
  final bool showReports;
  final VoidCallback onToggleReports;
  final VoidCallback onDelete;
  final VoidCallback onBan;

  const ReportedUserCard({
    super.key,
    required this.name,
    required this.email,
    required this.date,
    required this.reports, // Updated to accept a list
    required this.showReports,
    required this.onToggleReports,
    required this.onDelete,
    required this.onBan,
  });

  @override
  State<ReportedUserCard> createState() => _ReportedUserCardState();
}

class _ReportedUserCardState extends State<ReportedUserCard> {
  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 6),
            // User details
            Text(
              widget.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 4),
            Text(
              widget.email,
              style: const TextStyle(color: Colors.black87, fontSize: 16),
            ),
            Text(
              'Date: ${widget.date}',
              style: const TextStyle(color: Colors.black87, fontSize: 16),
            ),
            Text(
              'Reports: ${widget.reports.length}',
              style: const TextStyle(color: Colors.black87, fontSize: 16),
            ),
            const SizedBox(height: 8),

            // Actions
            Row(
              children: [
                // Toggle reports button
                TextButton.icon(
                  onPressed: widget.onToggleReports,
                  icon: Icon(
                    widget.showReports ? Icons.expand_less : Icons.expand_more,
                  ),
                  label: Text(
                    widget.showReports ? 'Hide Reports' : 'Show Reports',
                  ),
                ),
                const Spacer(), // Push buttons to the right
                // Ban button
                ElevatedButton.icon(
                  onPressed: widget.onBan,
                  icon: const Icon(Icons.block, color: Colors.white),
                  label: const Text(
                    'Ban',
                    style: TextStyle(color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                  ),
                ),
                const SizedBox(width: 8), // Add spacing between buttons
                // Delete button
                ElevatedButton.icon(
                  onPressed: widget.onDelete,
                  icon: const Icon(Icons.delete, color: Colors.white),
                  label: const Text(
                    'Delete',
                    style: TextStyle(color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),

            // Reports section (conditionally visible)
            if (widget.showReports)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Reports:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    ...widget.reports.map(
                      (report) => Text(
                        '- $report',
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
