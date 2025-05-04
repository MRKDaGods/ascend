import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/models/posts_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/posts/bloc/posts_bloc.dart';
import '../../bloc/posts/bloc/posts_event.dart';

class ReportedPostCard extends StatelessWidget {
  final ReportedPost post;
  final bool isExpanded;
  final bool showReports;
  final VoidCallback onToggleExpand;
  final VoidCallback onToggleReports;
  final VoidCallback onDelete;

  const ReportedPostCard({
    super.key,
    required this.post,
    required this.isExpanded,
    required this.showReports,
    required this.onToggleExpand,
    required this.onToggleReports,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final fullName = post.authorFullName;
    final createdAt = DateFormat('yyyy-MM-dd – kk:mm').format(post.createdAt);
    final hasImage = post.mediaUrls.isNotEmpty;
    final imageUrl = hasImage ? post.mediaUrls.first : null;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Author + Time
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundImage:
                          post.profilePictureUrl.isNotEmpty
                              ? NetworkImage(post.profilePictureUrl)
                              : const AssetImage('assets/default_profile.png')
                                  as ImageProvider,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      fullName,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                Text(
                  createdAt,
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 8),

            /// Post content
            Text(post.content, style: const TextStyle(fontSize: 15)),
            const SizedBox(height: 10),

            /// Optional image
            if (hasImage)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  imageUrl!,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            if (hasImage) const SizedBox(height: 10),

            /// Metadata row
            Row(
              children: [
                _metaIcon(Icons.visibility, post.privacy),
                const SizedBox(width: 12),
                _metaIcon(Icons.thumb_up, post.likesCount.toString()),
                const SizedBox(width: 12),
                _metaIcon(Icons.comment, post.commentsCount.toString()),
                const SizedBox(width: 12),
                _metaIcon(Icons.share, post.sharesCount.toString()),
              ],
            ),
            const SizedBox(height: 16),

            /// Action row
            Row(
              children: [
                // Toggle reports button with specific implementation
                TextButton.icon(
                  onPressed: onToggleReports,
                  icon: Icon(
                    showReports ? Icons.expand_less : Icons.expand_more,
                  ),
                  label: Text(showReports ? 'Hide Reports' : 'Show Reports'),
                ),

                const Spacer(), // Push delete button to the right
                // Delete button
                ElevatedButton.icon(
                  onPressed: onDelete,
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

            // Show reports section when showReports is true
            if (showReports) ...[
              const SizedBox(height: 16),
              const Text(
                'Reports:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              BlocBuilder<PostsBloc, PostsState>(
                builder: (context, state) {
                  // Debug prints to see what's happening
                  debugPrint('Current state: $state');
                  debugPrint(
                    'Post ID: ${post.id}, Reports count: ${post.reports.length}',
                  );

                  // Show loading indicator while fetching reports
                  if (state is FetchingPostReportsState) {
                    return const Center(
                      child: Padding(
                        padding: EdgeInsets.all(8.0),
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }

                  // Add specific handling for PostReportsFetchedState
                  if (state is PostReportsFetchedState &&
                      state.postId == post.id) {
                    // Show reports from state if they're for this post
                    return Column(
                      children:
                          state.postReports
                              .map<Widget>(
                                (report) => _buildReportCard(context, report),
                              )
                              .toList(),
                    );
                  }

                  // Show reports from post object if available
                  if (post.reports.isNotEmpty) {
                    return Column(
                      children:
                          post.reports
                              .map<Widget>(
                                (report) => _buildReportCard(context, report),
                              )
                              .toList(),
                    );
                  } else {
                    // If we get here and we don't have reports, but we know there should be reports
                    // Check if bloc has reports for this post
                    final reportsFromBloc =
                        context.read<PostsBloc>().postReports[post.id];
                    if (reportsFromBloc != null && reportsFromBloc.isNotEmpty) {
                      return Column(
                        children:
                            reportsFromBloc
                                .map<Widget>(
                                  (report) => _buildReportCard(context, report),
                                )
                                .toList(),
                      );
                    }

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('No reports shown. Trying to fetch...'),
                        const SizedBox(height: 8),
                        ElevatedButton(
                          onPressed: () {
                            // Try to fetch reports again
                            context.read<PostsBloc>().add(
                              FetchPostReports(postId: post.id),
                            );
                          },
                          child: const Text('Refresh Reports'),
                        ),
                      ],
                    );
                  }
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _metaIcon(IconData icon, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[700]),
        const SizedBox(width: 4),
        Text(value, style: const TextStyle(fontSize: 13)),
      ],
    );
  }

  Widget _buildReportCard(BuildContext context, PostReport report) {
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
                if (report.reporterProfilePicture.isNotEmpty)
                  CircleAvatar(
                    backgroundImage: NetworkImage(
                      report.reporterProfilePicture,
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

            // Report reason and description
            Text('Reason: ${report.reason}'),
            if (report.description.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text('Description: ${report.description}'),
            ],
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
    PostReport report,
    String newStatus,
  ) {
    if (report.status != newStatus) {
      debugPrint(
        'Updating report ${report.id} status from ${report.status} to $newStatus',
      );

      // Call the bloc event to update status
      context.read<PostsBloc>().add(
        UpdatePostReportStatus(
          reportId: report.id.toString(),
          status: newStatus,
        ),
      );
    }
  }
}
