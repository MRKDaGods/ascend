import 'package:flutter/material.dart';

class PostFeedbackOptions extends StatelessWidget {
  final String ownerName;
  final Function(String)? onFeedbackSubmitted;
  final VoidCallback? onUndo;

  const PostFeedbackOptions({
    super.key,
    required this.ownerName,
    this.onFeedbackSubmitted,
    this.onUndo,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Help us improve your feed',
                  style: TextStyle(
                    fontSize: 16, 
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: onUndo,
                  child: const Text('UNDO'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text('Why don\'t you want to see this?'),
            const SizedBox(height: 16),
            _buildFeedbackOption(
              context,
              'Not interested in this topic',
              'topic',
            ),
            const SizedBox(height: 8),
            _buildFeedbackOption(
              context,
              'Not interested in posts from $ownerName',
              'author',
            ),
            const SizedBox(height: 8),
            _buildFeedbackOption(
              context,
              'Not appropriate for LinkedIn',
              'inappropriate',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeedbackOption(BuildContext context, String text, String reason) {
    return InkWell(
      onTap: () {
        if (onFeedbackSubmitted != null) {
          onFeedbackSubmitted!(reason);
        }
        
        // Show a snackbar to confirm
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Post removed from your feed')),
        );
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(text),
      ),
    );
  }
}

