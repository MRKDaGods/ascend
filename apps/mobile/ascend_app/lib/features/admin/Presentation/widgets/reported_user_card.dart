import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/admin/bloc/users/bloc/users_bloc.dart';

class ReportedUserCard extends StatefulWidget {
  final String name;
  final String email;
  final String date;
  final List<String> reports; // List of report reasons
  final bool showReports;
  final VoidCallback onToggleReports;
  final String userId; // User ID for delete functionality
  final VoidCallback handleDeleteUser;
  final VoidCallback onBan;

  const ReportedUserCard({
    super.key,
    required this.name,
    required this.email,
    required this.date,
    required this.reports,
    required this.showReports,
    required this.onToggleReports,
    required this.userId,
    required this.handleDeleteUser,
    required this.onBan,
  });

  @override
  State<ReportedUserCard> createState() => _ReportedUserCardState();
}

class _ReportedUserCardState extends State<ReportedUserCard> {
  /// Handles the delete user action with a confirmation dialog.
  void _handleDeleteUser(BuildContext context, String userId) {
    showDialog(
      context: context,
      builder:
          (dialogContext) => AlertDialog(
            title: const Text('Delete User'),
            content: const Text(
              'Are you sure you want to delete this reported user?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(dialogContext);
                  context.read<UsersBloc>().add(
                    DeleteUserEvent(userId: int.parse(userId)),
                  );
                },
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Delete'),
              ),
            ],
          ),
    );
  }

  /// Handles the ban user action with a confirmation dialog.
  void _handleBanUser(BuildContext context, String userId) {
    final TextEditingController reasonController = TextEditingController();
    final TextEditingController expiresAtController = TextEditingController();

    showDialog(
      context: context,
      builder:
          (dialogContext) => AlertDialog(
            title: const Text('Ban User'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: reasonController,
                  decoration: const InputDecoration(
                    labelText: 'Reason (optional)',
                  ),
                ),
                TextField(
                  controller: expiresAtController,
                  decoration: const InputDecoration(
                    labelText:
                        'Expires At (optional, e.g., 2025-04-30T23:02:28.000Z)',
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(dialogContext);
                  context.read<UsersBloc>().add(
                    BanUserEvent(
                      userId: int.parse(userId),
                      reason:
                          reasonController.text.isNotEmpty
                              ? reasonController.text
                              : null,
                      expiresAt:
                          expiresAtController.text.isNotEmpty
                              ? expiresAtController.text
                              : null,
                    ),
                  );
                },
                style: TextButton.styleFrom(foregroundColor: Colors.orange),
                child: const Text('Ban'),
              ),
            ],
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildUserDetails(),
            const SizedBox(height: 8),
            _buildActions(context),
            if (widget.showReports) _buildReportsSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildUserDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
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
      ],
    );
  }

  Widget _buildActions(BuildContext context) {
    return Row(
      children: [
        TextButton.icon(
          onPressed: widget.onToggleReports,
          icon: Icon(
            widget.showReports ? Icons.expand_less : Icons.expand_more,
          ),
          label: Text(widget.showReports ? 'Hide Reports' : 'Show Reports'),
        ),
        const Spacer(),
        ElevatedButton.icon(
          onPressed: () => _handleBanUser(context, widget.userId),
          icon: const Icon(Icons.block, color: Colors.white),
          label: const Text('Ban', style: TextStyle(color: Colors.white)),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.orange,
            foregroundColor: Colors.white,
          ),
        ),
        const SizedBox(width: 8),
        ElevatedButton.icon(
          onPressed: () => _handleDeleteUser(context, widget.userId),
          icon: const Icon(Icons.delete, color: Colors.white),
          label: const Text('Delete', style: TextStyle(color: Colors.white)),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
            foregroundColor: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildReportsSection() {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Reports:',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 4),
          ...widget.reports.map(
            (report) => Text('- $report', style: const TextStyle(fontSize: 14)),
          ),
        ],
      ),
    );
  }
}
