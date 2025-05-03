import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ReportedPostCard extends StatelessWidget {
  final Map<String, dynamic> post;
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
    final user = post['user'];
    final fullName = user != null
        ? '${user['first_name'] ?? 'Unknown'} ${user['last_name'] ?? 'User'}'
        : 'Unknown User';
    final createdAt = DateFormat('yyyy-MM-dd – kk:mm').format(DateTime.parse(post['created_at']));
    final media = post['media'] as List;
    final hasImage = media.isNotEmpty;
    final imageUrl = hasImage ? media[0]['url'] : null;

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
                Text(
                  fullName,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  createdAt,
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 8),

            /// Post content
            Text(post['content'], style: const TextStyle(fontSize: 15)),
            const SizedBox(height: 10),

            /// Optional image
            if (hasImage)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  imageUrl,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            if (hasImage) const SizedBox(height: 10),

            /// Metadata row
            Row(
              children: [
                _metaIcon(Icons.visibility, post['privacy']),
                const SizedBox(width: 12),
                _metaIcon(Icons.thumb_up, post['likes_count'].toString()),
                const SizedBox(width: 12),
                _metaIcon(Icons.comment, post['comments_count'].toString()),
                const SizedBox(width: 12),
                _metaIcon(Icons.share, post['shares_count'].toString()),
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
              if (post['reports'] != null &&
                  post['reports'] is List &&
                  post['reports'].isNotEmpty)
                ...post['reports'].map<Widget>((report) {
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
                            report['reporter'] ?? 'Unknown',
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
                                  text: report['reason'] ?? 'N/A',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(report['description'] ?? ''),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              DropdownButton<String>(
                                value: 'pending',
                                items: ['pending', 'reviewed', 'resolved', 'rejected']
                                    .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                                    .toList(),
                                onChanged: (val) {},
                              ),
                              const SizedBox(width: 12),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                ),
                                child: const Text('DELETE POST'),
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