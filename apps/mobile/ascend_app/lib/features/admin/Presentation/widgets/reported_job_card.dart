import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/models/jobs_model.dart';

class ReportedJobCard extends StatefulWidget {
  final ReportedJob job;
  final List<JobReport> reports;
  final VoidCallback onExpand;
  final VoidCallback? onDelete; // Add new optional parameter

  const ReportedJobCard({
    Key? key,
    required this.job,
    required this.reports,
    required this.onExpand,
    this.onDelete, // Add this parameter
  }) : super(key: key);

  @override
  _ReportedJobCardState createState() => _ReportedJobCardState();
}

class _ReportedJobCardState extends State<ReportedJobCard> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    final job = widget.job;
    final reports = widget.reports;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Job Header Section
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (job.companyLogoUrl != null)
                  CircleAvatar(
                    backgroundImage: NetworkImage(job.companyLogoUrl!),
                    radius: 24,
                  )
                else
                  CircleAvatar(
                    backgroundColor: Colors.grey[300],
                    radius: 24,
                    child: const Icon(Icons.business, color: Colors.white),
                  ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        job.title,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        job.companyName,
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Job Details Section
            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: [
                _buildDetailChip(Icons.work, 'Type: ${job.type}'),
                _buildDetailChip(
                  Icons.school,
                  'Experience: ${job.experienceLevel}',
                ),
                _buildDetailChip(Icons.business, 'Industry: ${job.industry}'),
                _buildDetailChip(
                  Icons.location_on,
                  'Location: ${job.location} (${job.workplaceType})',
                ),
                if (job.salaryMinRange > 0 && job.salaryMaxRange > 0)
                  _buildDetailChip(
                    Icons.attach_money,
                    'Salary: \$${job.salaryMinRange} - \$${job.salaryMaxRange}',
                  ),
                _buildDetailChip(
                  Icons.calendar_today,
                  'Posted: ${DateFormat('MMM d, yyyy').format(job.createdAt)}',
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Action buttons row
            Row(
              children: [
                // Expand/Collapse Button
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _isExpanded = !_isExpanded;
                    });
                    if (_isExpanded) {
                      widget.onExpand(); // Trigger the onExpand callback
                    }
                  },
                  icon: Icon(
                    _isExpanded ? Icons.expand_less : Icons.expand_more,
                  ),
                  label: Text(_isExpanded ? 'Hide Reports' : 'Show Reports'),
                ),

                const Spacer(), // Push delete button to the right
                // Delete button
                if (widget.onDelete != null)
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

            // Reports Section
            if (_isExpanded)
              Column(
                children:
                    reports.map((report) => _buildReportCard(report)).toList(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailChip(IconData icon, String label) {
    return Chip(
      avatar: Icon(icon, size: 16, color: Colors.blue),
      label: Text(label, style: const TextStyle(fontSize: 12)),
      backgroundColor: Colors.grey[200],
    );
  }

  Widget _buildReportCard(JobReport report) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (report.reporterProfilePicture != null)
                  CircleAvatar(
                    backgroundImage: NetworkImage(
                      report.reporterProfilePicture!,
                    ),
                    radius: 20,
                  )
                else
                  CircleAvatar(
                    backgroundColor: Colors.grey[300],
                    radius: 20,
                    child: const Icon(Icons.person, color: Colors.white),
                  ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    report.reporterFullName,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text('Reason: ${report.reason}'),
            const SizedBox(height: 4),
            Row(
              children: [
                DropdownButton<String>(
                  value: report.status,
                  items:
                      ['pending', 'reviewed', 'resolved', 'rejected']
                          .map(
                            (status) => DropdownMenuItem(
                              value: status,
                              child: Text(
                                status[0].toUpperCase() + status.substring(1),
                              ),
                            ),
                          )
                          .toList(),
                  onChanged: (newStatus) {
                    setState(() {
                      report.status = newStatus!;
                    });
                  },
                ),
                const Spacer(),
                Text(
                  DateFormat('MMM d, yyyy').format(report.createdAt),
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
