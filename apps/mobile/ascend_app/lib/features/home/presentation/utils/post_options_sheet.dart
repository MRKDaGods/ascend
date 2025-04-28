import 'package:flutter/material.dart';

class PostOptionsSheet extends StatelessWidget {
  final String ownerName;
  final VoidCallback? onSave;
  final VoidCallback? onShare;
  final VoidCallback? onNotInterested;
  final VoidCallback? onUnfollow;
  final VoidCallback? onReport;
  final VoidCallback? onMessage; // Add this callback

  // Options to show/hide specific items
  final bool showSave;
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
    this.onShare,
    this.onNotInterested,
    this.onUnfollow,
    this.onReport,
    this.onMessage, // Add this parameter
    this.showSave = true,
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
          if (showSave)
            ListTile(
              leading: const Icon(Icons.bookmark_border),
              title: const Text('Save'),
              onTap: () {
                Navigator.pop(context);
                if (onSave != null) {
                  onSave!();
                } else {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(const SnackBar(content: Text('Post saved')));
                }
              },
            ),

          if (showShare)
            ListTile(
              leading: const Icon(Icons.share),
              title: const Text('Share via'),
              onTap: () {
                Navigator.pop(context);
                if (onShare != null) {
                  onShare!();
                } else {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(const SnackBar(content: Text('Sharing...')));
                }
              },
            ),

          // Add the message option here
          if (showMessage)
            ListTile(
              leading: const Icon(Icons.message_outlined),
              title: Text('Message $ownerName'),
              onTap: () {
                Navigator.pop(context);
                if (onMessage != null) {
                  onMessage!();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Opening chat with $ownerName')),
                  );
                }
              },
            ),

          if (showNotInterested)
            ListTile(
              leading: const Icon(Icons.not_interested),
              title: const Text('Not interested'),
              onTap: () {
                Navigator.pop(context);
                if (onNotInterested != null) {
                  onNotInterested!();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('We\'ll show fewer posts like this'),
                    ),
                  );
                }
              },
            ),

          if (showUnfollow)
            ListTile(
              leading: const Icon(Icons.person_remove_outlined),
              title: Text('Unfollow $ownerName'),
              onTap: () {
                Navigator.pop(context);
                if (onUnfollow != null) {
                  onUnfollow!();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Unfollowed $ownerName')),
                  );
                }
              },
            ),

          if (showReport)
            ListTile(
              leading: const Icon(Icons.flag_outlined),
              title: Text(reportText),
              onTap: () {
                Navigator.pop(context);
                if (onReport != null) {
                  onReport!();
                } else {
                  // Show report dialog
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text(reportText),
                        content: Text(
                          'Why are you reporting this ${reportText.toLowerCase().contains('post') ? 'post' : 'content'}?',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    '${reportText.toLowerCase().contains('post') ? 'Post' : 'Content'} reported',
                                  ),
                                ),
                              );
                            },
                            child: const Text('Submit'),
                          ),
                        ],
                      );
                    },
                  );
                }
              },
            ),
        ],
      ),
    );
  }
}
