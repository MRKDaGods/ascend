import 'package:flutter/material.dart';

class PostOptionsSheet extends StatelessWidget {
  final String ownerName;
  final VoidCallback? onSave;
  final VoidCallback? onUnsave; // Add onUnsave callback
  final VoidCallback? onShare;
  final VoidCallback? onNotInterested;
  final VoidCallback? onUnfollow;
  final VoidCallback? onReport;
  final VoidCallback? onMessage; // Add this callback

  // Options to show/hide specific items
  final bool showSave;
  final bool showUnsave; // Add showUnsave flag
  final bool showShare;
  final bool showNotInterested;
  final bool showUnfollow;
  final bool showReport;
  final bool showMessage; // Add this option

  // Customizable text for report option
  final String reportText;

  const PostOptionsSheet({
    super.key,
    required this.ownerName,
    this.onSave,
    this.onUnsave, // Add to constructor
    this.onShare,
    this.onNotInterested,
    this.onUnfollow,
    this.onReport,
    this.onMessage, // Add this parameter
    this.showSave = true,
    this.showUnsave = false, // Add to constructor, default false
    this.showShare = true,
    this.showNotInterested = true,
    this.showUnfollow = true,
    this.showReport = true,
    this.showMessage = false, // Default to false
    this.reportText = 'Report post',
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // --- Save Option ---
          if (showSave)
            ListTile(
              leading: const Icon(Icons.bookmark_border),
              title: const Text('Save'),
              onTap: () {
                Navigator.pop(context); // Close sheet
                onSave?.call(); // Call callback if provided
              },
            ),

          // --- Unsave Option ---
          if (showUnsave)
            ListTile(
              leading: const Icon(Icons.bookmark_remove_outlined), // Different icon
              title: const Text('Unsave'),
              onTap: () {
                Navigator.pop(context); // Close sheet
                onUnsave?.call(); // Call callback if provided
              },
            ),

          // --- Share Option ---
          if (showShare)
            ListTile(
              leading: const Icon(Icons.share),
              title: const Text('Share via'),
              onTap: () {
                Navigator.pop(context); // Close sheet
                onShare?.call(); // Call callback if provided
              },
            ),

          // --- Not Interested Option ---
          if (showNotInterested)
            ListTile(
              leading: const Icon(Icons.visibility_off_outlined),
              title: const Text('Not interested in this post'),
              onTap: () {
                Navigator.pop(context); // Close sheet
                onNotInterested?.call(); // Call callback if provided
              },
            ),

          // --- Unfollow Option ---
          if (showUnfollow)
            ListTile(
              leading: const Icon(Icons.person_remove_alt_1_outlined),
              title: Text('Unfollow $ownerName'),
              onTap: () {
                Navigator.pop(context); // Close sheet
                onUnfollow?.call(); // Call callback if provided
              },
            ),

          // --- Report Option ---
          if (showReport)
            ListTile(
              leading: const Icon(Icons.flag_outlined),
              title: Text(reportText),
              onTap: () {
                Navigator.pop(context); // Close sheet
                onReport?.call(); // Call callback if provided
              },
            ),

          // --- Message Option ---
          if (showMessage)
            ListTile(
              leading: const Icon(Icons.message_outlined),
              title: Text('Message $ownerName'),
              onTap: () {
                Navigator.pop(context); // Close sheet
                onMessage?.call(); // Call callback if provided
              },
            ),
        ],
      ),
    );
  }
}
