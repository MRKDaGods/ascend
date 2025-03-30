import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/utils/sheet_helpers.dart';
import '../post/post_feedback_options.dart';

class PostHeader extends StatelessWidget {
  final String ownerName;
  final String ownerImageUrl;
  final String ownerOccupation;
  final String timePosted;
  final bool isSponsored;
  final int followers;
  final VoidCallback? onRemove;
  final VoidCallback? onOptionsPressed;
  final Function(String)? onFeedbackSubmitted; // Callback for removal feedback
  final VoidCallback? onShowFeedbackOptions; // New callback to show feedback options
  final Function(String reason)? onHidePost; // Add this

  const PostHeader({
    super.key,
    required this.ownerName,
    required this.ownerImageUrl,
    this.ownerOccupation = '',
    required this.timePosted,
    this.isSponsored = false,
    this.followers = 0,
    this.onRemove,
    this.onOptionsPressed,
    this.onFeedbackSubmitted,
    this.onShowFeedbackOptions,
    this.onHidePost,
  });

  void _showOptionsBottomSheet(BuildContext context) {
    SheetHelpers.showPostOptionsSheet(
      context: context,
      ownerName: ownerName,
      onSave: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Post saved')),
        );
      },
      onShare: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sharing...')),
        );
      },
      onNotInterested: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('We\'ll show fewer posts like this')),
        );
      },
      onUnfollow: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Unfollowed $ownerName')),
        );
      },
      onReport: () {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Report post'),
              content: const Text('Why are you reporting this post?'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Post reported')),
                    );
                  },
                  child: const Text('Submit'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          backgroundImage: ownerImageUrl.startsWith('http') || ownerImageUrl.startsWith('https')
            ? NetworkImage(ownerImageUrl) as ImageProvider
            : AssetImage(ownerImageUrl),
          radius: 20,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                ownerName,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              if (isSponsored && followers > 0)
                // Show followers for sponsored posts
                Text(
                  '${_formatNumber(followers)} followers',
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                )
              else if (ownerOccupation.isNotEmpty)
                // Show occupation for regular posts
                Text(
                  ownerOccupation,
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
              Text(
                timePosted,
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
        // Options button
        IconButton(
          icon: const Icon(Icons.more_horiz),
          splashRadius: 24,
          onPressed: () => onOptionsPressed != null 
                          ? onOptionsPressed!() 
                          : _showOptionsBottomSheet(context),
        ),
        // X button to remove post - only show for non-sponsored posts
        if (!isSponsored)
          IconButton(
            icon: const Icon(Icons.close),
            splashRadius: 24,
            onPressed: () {
              // Show the feedback options directly
              showFeedbackOptions(context);
            },
          ),
        if (isSponsored)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Text(
              'Sponsored',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
          ),
      ],
    );
  }
  
  // Helper method to format large numbers
  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    } else {
      return number.toString();
    }
  }

  // Add this method to PostHeader
  void showFeedbackOptions(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        content: PostFeedbackOptions(
          ownerName: ownerName,
          onFeedbackSubmitted: (reason) {
            Navigator.pop(dialogContext);
            if (onHidePost != null) {
              onHidePost!(reason);
            }
          },
          onUndo: () {
            Navigator.pop(dialogContext);
          },
        ),
        contentPadding: EdgeInsets.zero,
      ),
    );
  }
}

