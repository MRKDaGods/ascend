import 'package:ascend_app/features/admin/data/models/posts_model.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ReportedPostCard extends StatelessWidget {
  final ReportedPost post;
  final bool isExpanded;
  final VoidCallback onToggleExpand;

  const ReportedPostCard({
    super.key,
    required this.post,
    required this.isExpanded,
    required this.onToggleExpand,
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
            Wrap(
              spacing: 12,
              runSpacing: 8,
              alignment: WrapAlignment.end,
              children: [
                ElevatedButton(
                  onPressed: onToggleExpand,
                  child: Text(isExpanded ? 'HIDE REPORTS' : 'VIEW REPORTS'),
                ),
              ],
            ),
            if (isExpanded) ...[
              const SizedBox(height: 16),
              const Text(
                'Reports:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              if (post.reports.isNotEmpty)
                ...post.reports.map<Widget>((report) {
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            report.reporterId as String,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          RichText(
                            text: TextSpan(
                              text: 'Reason: ',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                              children: [
                                TextSpan(
                                  text: report.reason,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(report.description),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              DropdownButton<String>(
                                value: 'pending',
                                items:
                                    [
                                          'pending',
                                          'reviewed',
                                          'resolved',
                                          'rejected',
                                        ]
                                        .map(
                                          (e) => DropdownMenuItem(
                                            value: e,
                                            child: Text(e),
                                          ),
                                        )
                                        .toList(),
                                onChanged: (val) {},
                              ),
                              const SizedBox(width: 12),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                ),
                                child: const Text(
                                  'DELETE POST',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList()
              else
                const Text('No reports available.'),
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
}
