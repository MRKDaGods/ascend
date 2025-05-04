import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/models/jobs_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/jobs/bloc/jobs_bloc.dart';

class ReportedJobCard extends StatefulWidget {
  final ReportedJob job;
  final List<JobReport> reports;
  final VoidCallback onExpand;
  final VoidCallback? onDelete;

  const ReportedJobCard({
    Key? key,
    required this.job,
    required this.reports,
    required this.onExpand,
    this.onDelete,
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

    return BlocListener<JobsBloc, JobsState>(
      listener: (context, state) {
        if (state is JobReportUpdateFailedState) {
          // Show a snackbar instead of a dialog
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to update report status: ${state.error}'),
              duration: const Duration(seconds: 3),
              action: SnackBarAction(
                label: 'Retry',
                onPressed: () {
                  // Allow a retry
                  context.read<JobsBloc>().add(
                    UpdateJobReportStatus(
                      reportId: state.reportId,
                      status: state.status,
                    ),
                  );
                },
              ),
            ),
          );
        } else if (state is JobReportStatusUpdatedState) {
          // Show success message
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Report status updated successfully'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 2),
            ),
          );
        }
      },
      child: Card(
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
                      radius: 24,
                      backgroundColor: Colors.grey[200],
                      child: ClipOval(
                        child: Image.network(
                          job.companyLogoUrl!,
                          width: 48,
                          height: 48,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            debugPrint('Error loading image: $error');
                            return const Icon(
                              Icons.business,
                              color: Colors.grey,
                            );
                          },
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return const Center(
                              child: SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
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
                      reports
                          .map((report) => _buildReportCard(context, report))
                          .toList(),
                ),
            ],
          ),
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

  Widget _buildReportCard(BuildContext context, JobReport report) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Reporter info row
            Row(
              children: [
                if (report.reporterProfilePicture != null &&
                    report.reporterProfilePicture!.isNotEmpty)
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

            // Report reason only (since JobReport doesn't have a details field)
            Text('Reason: ${report.reason}'),
            const SizedBox(height: 12),

            // Status row with dropdown
            Row(
              children: [
                // Status label
                const Text(
                  'Status: ',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),

                // Status dropdown with all possible values
                DropdownButton<String>(
                  value: report.status,
                  underline: Container(
                    height: 1,
                    color: _getStatusColor(report.status),
                  ),
                  icon: Icon(
                    Icons.arrow_drop_down,
                    color: _getStatusColor(report.status),
                  ),
                  items:
                      ['pending', 'reviewed', 'resolved', 'rejected'].map((
                        status,
                      ) {
                        return DropdownMenuItem<String>(
                          value: status,
                          child: Text(
                            status[0].toUpperCase() + status.substring(1),
                            style: TextStyle(
                              color: _getStatusColor(status),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        );
                      }).toList(),
                  onChanged: (newStatus) {
                    if (newStatus != null && newStatus != report.status) {
                      // Show loading indicator
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Updating status...'),
                          duration: Duration(seconds: 1),
                        ),
                      );

                      // Update status via bloc
                      _handleUpdateStatus(context, report, newStatus);
                    }
                  },
                ),

                const Spacer(),

                // Date formatter
                Text(
                  DateFormat('MMM d, yyyy').format(report.createdAt),
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),

            // Action buttons (alternative to dropdown)
            if (report.status == 'pending') ...[
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  // Quick status update buttons
                  OutlinedButton(
                    onPressed:
                        () => _handleUpdateStatus(context, report, 'reviewed'),
                    child: const Text('Mark Reviewed'),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed:
                        () => _handleUpdateStatus(context, report, 'resolved'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Resolve'),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  // Helper method to get colors for different statuses
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'reviewed':
        return Colors.blue;
      case 'resolved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.red;
    }
  }

  // Add a method to handle updating report status
  void _handleUpdateStatus(
    BuildContext context,
    JobReport report,
    String newStatus,
  ) {
    if (report.status != newStatus) {
      debugPrint(
        'Updating job report ${report.id} status from ${report.status} to $newStatus',
      );

      // Call the bloc event to update status
      context.read<JobsBloc>().add(
        UpdateJobReportStatus(
          reportId: report.id.toString(),
          status: newStatus,
        ),
      );
    }
  }
}
