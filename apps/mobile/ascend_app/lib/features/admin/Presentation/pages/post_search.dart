import 'package:flutter/material.dart';

class PostSearchDelegate extends SearchDelegate {
  final List<Map<String, dynamic>> reportedPosts;

  PostSearchDelegate(this.reportedPosts);

  @override
  List<Widget>? buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = ''; // Clear the search query
        },
      ),
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () {
        close(context, null); // Close the search
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    final results = _filterPosts();

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: results.length,
      itemBuilder: (context, index) {
        final post = results[index];
        final user = post['user'];
        final fullName =
            user != null
                ? '${user['first_name'] ?? 'Unknown'} ${user['last_name'] ?? 'User'}'
                : 'Unknown User';

        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fullName,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Text('Post: ${post['content']}'),
                const SizedBox(height: 4),
                if (post['reports'] != null && post['reports'].isNotEmpty)
                  ..._buildReportCards(post['reports']),
                const SizedBox(height: 10),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final suggestions = _filterPosts();

    return ListView.builder(
      itemCount: suggestions.length,
      itemBuilder: (context, index) {
        final post = suggestions[index];
        final user = post['user'];
        final fullName =
            user != null
                ? '${user['first_name'] ?? 'Unknown'} ${user['last_name'] ?? 'User'}'
                : 'Unknown User';

        return ListTile(
          title: Text(fullName),
          subtitle: Text('Post: ${post['content']}'),
          onTap: () {
            query = fullName;
            showResults(context);
          },
        );
      },
    );
  }

  List<Map<String, dynamic>> _filterPosts() {
    return reportedPosts.where((post) {
      final user = post['user'];
      final fullName =
          user != null
              ? '${user['first_name'] ?? ''} ${user['last_name'] ?? ''}'
                  .toLowerCase()
              : '';
      final content = post['content']?.toLowerCase() ?? '';
      final reports = post['reports'] as List<dynamic>;
      final reportReasons = reports
          .map((report) => report['reason']?.toLowerCase() ?? '')
          .join(' ');

      return fullName.contains(query.toLowerCase()) ||
          content.contains(query.toLowerCase()) ||
          reportReasons.contains(query.toLowerCase());
    }).toList();
  }

  List<Widget> _buildReportCards(List<dynamic> reports) {
    return reports.map<Widget>((report) {
      return Card(
        margin: const EdgeInsets.only(top: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Reporter: ${report['reporter'] ?? 'Unknown'}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text('Reason: ${report['reason'] ?? 'N/A'}'),
              const SizedBox(height: 4),
              Text('Description: ${report['description'] ?? ''}'),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  DropdownButton<String>(
                    value: 'pending',
                    items:
                        ['pending', 'reviewed', 'resolved', 'rejected']
                            .map(
                              (e) => DropdownMenuItem(value: e, child: Text(e)),
                            )
                            .toList(),
                    onChanged: (val) {
                      if (val != null) {
                        debugPrint('Status updated to: $val');
                        // Update the report status here
                      }
                    },
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: () {
                      debugPrint('Report deleted: ${report['description']}');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                    ),
                    child: const Text('DELETE REPORT'),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }).toList();
  }
}
