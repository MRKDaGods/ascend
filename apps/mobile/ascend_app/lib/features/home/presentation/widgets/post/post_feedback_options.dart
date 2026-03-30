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
                        ? 'Report this post' // Updated text
                        : 'Report submitted', // Updated text
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (_feedbackSubmittedReason != null) // Only show UNDO after submitting
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
                  'Harassment', // Display text
                  'harassment', // Backend value
                  () => _handleReportSubmit('harassment'), // Use backend value
                ),
                const SizedBox(height: 8),
                _buildFeedbackOption(
                  context,
                  'Violence', // Display text
                  'violence', // Backend value
                  () => _handleReportSubmit('violence'), // Use backend value
                ),
                const SizedBox(height: 8),
                _buildFeedbackOption(
                  context,
                  'Hate Speech', // Display text
                  'hate_speech', // Backend value
                  () => _handleReportSubmit('hate_speech'), // Use backend value
                ),
                const SizedBox(height: 8),
                _buildFeedbackOption(
                  context,
                  'Misinformation', // Display text
                  'misinformation', // Backend value
                  () => _handleReportSubmit('misinformation'), // Use backend value
                ),
                const SizedBox(height: 8),
                _buildFeedbackOption(
                  context,
                  'Other', // Display text
                  'other', // Backend value
                  () => _handleReportSubmit('other'), // Use backend value
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
    String value, // Keep value if needed for internal logic, but not used here
    VoidCallback? onPressed,
  ) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(double.infinity, 40), // Full width
        alignment: Alignment.centerLeft,
        side: BorderSide(color: Colors.grey.shade300),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
      ),
      child: Text(
        text,
        style: const TextStyle(color: Colors.black87),
      ),
    );
  }
}

