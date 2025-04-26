import 'package:flutter/material.dart';

class PostFeedbackOptions extends StatefulWidget {
  final String ownerName;
  final Function(String)? onReportSubmitted; // Renamed from onFeedbackSubmitted
  final VoidCallback? onUndo;

  const PostFeedbackOptions({
    super.key,
    required this.ownerName,
    this.onReportSubmitted, // Renamed
    this.onUndo,
  });

  @override
  State<PostFeedbackOptions> createState() => _PostFeedbackOptionsState();
}

class _PostFeedbackOptionsState extends State<PostFeedbackOptions> {
  String? _feedbackSubmittedReason; // Keep internal state name for clarity

  // Renamed internal handler
  void _handleReportSubmit(String reason) {
    widget.onReportSubmitted?.call(reason); // Call the renamed callback
    setState(() {
      _feedbackSubmittedReason = reason;
    });
  }

  void _handleUndo() {
    widget.onUndo?.call();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _feedbackSubmittedReason == null
                        ? 'Help us improve your feed' // Or change to "Report this post"
                        : 'Thank you for your feedback', // Or "Report submitted"
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: _handleUndo,
                    child: const Text('UNDO'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (_feedbackSubmittedReason == null) ...[
                const Text('Why are you reporting this post?'), // Updated text
                const SizedBox(height: 16),
                _buildFeedbackOption(
                  context,
                  'Not interested in this topic',
                  'topic', // Keep UI value if needed
                  // Use a backend-valid reason, e.g., 'spam' or 'irrelevant'
                  () => _handleReportSubmit('irrelevant'), // CHANGE REASON HERE
                ),
                const SizedBox(height: 8),
                _buildFeedbackOption(
                  context,
                  'Not interested in posts from ${widget.ownerName}',
                  'author', // Keep UI value if needed
                  // Use a backend-valid reason, e.g., 'block_author' or specific code
                  () => _handleReportSubmit('block_author'), // CHANGE REASON HERE
                ),
                const SizedBox(height: 8),
                _buildFeedbackOption(
                  context,
                  'Not appropriate for LinkedIn',
                  'inappropriate', // Keep UI value if needed
                  // Use a backend-valid reason, e.g., 'inappropriate_content'
                  () => _handleReportSubmit('inappropriate_content'), // CHANGE REASON HERE
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeedbackOption(
    BuildContext context,
    String text,
    String value,
    VoidCallback? onPressed,
  ) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.grey[700],
        side: BorderSide(color: Colors.grey[300]!),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      ),
      child: Text(text),
    );
  }
}

