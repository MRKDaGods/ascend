import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:flutter_bloc/flutter_bloc.dart'; // Import UserProfilePage

class PostHeader extends StatelessWidget {
  final String ownerName;
  final String ownerImageUrl;
  final String ownerOccupation;
  final String timePosted;
  final bool isSponsored;
  final int followers;
  final String userId; // Add userId field
  final VoidCallback? onRemove;
  final VoidCallback? onOptionsPressed; // This callback is key
  final Function(String)? onFeedbackSubmitted; // Callback for removal feedback
  final VoidCallback?
  onShowFeedbackOptions; // New callback to show feedback options
  final Function(String reason)? onHidePost; // Add this

  const PostHeader({
    super.key,
    required this.ownerName,
    required this.ownerImageUrl,
    this.ownerOccupation = '',
    required this.timePosted,
    this.isSponsored = false,
    this.followers = 0,
    required this.userId, // Require userId in constructor
    this.onRemove,
    this.onOptionsPressed,
    this.onFeedbackSubmitted,
    this.onShowFeedbackOptions,
    this.onHidePost,
  });

  @override
  Widget build(BuildContext context) {
    // You can now use widget.userId within the build method if needed
    // For example: debugPrint('User ID in PostHeader: ${widget.userId}');
    return GestureDetector(
      onTap: () {
        final bloc = context.read<UserProfileBloc>();
        if (bloc.profile == null) {
          debugPrint("Profile null? possible????");
          return;
        }

        final parsedId = int.parse(userId);

        Navigator.push(
          context,
          MaterialPageRoute(
            builder:
                (context) => UserProfilePage(
                  profileId: parsedId == bloc.profile!.userId ? null : parsedId,
                ),
          ),
        );
      },
      child: Row(
        children: [
          CircleAvatar(
            backgroundImage:
                ownerImageUrl.startsWith('http') ||
                        ownerImageUrl.startsWith('https')
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
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                  )
                else if (ownerOccupation.isNotEmpty)
                  // Show occupation for regular posts
                  Text(
                    ownerOccupation,
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                Text(
                  timePosted,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ),
          // Options button
          IconButton(
            icon: const Icon(Icons.more_horiz),
            splashRadius: 24,
            onPressed: () {
              debugPrint("Options button pressed in PostHeader");
              // Directly call the provided callback
              if (onOptionsPressed != null) {
                onOptionsPressed!();
              } else {
                debugPrint(
                  "Warning: onOptionsPressed callback is null in PostHeader",
                );
              }
            },
          ),
          // X button to remove post - only show for non-sponsored posts
          if (!isSponsored)
            IconButton(
              icon: const Icon(Icons.close),
              splashRadius: 24,
              onPressed: () {
                debugPrint("X button pressed");
                if (onShowFeedbackOptions != null) {
                  onShowFeedbackOptions!();
                } else {
                  debugPrint("Warning: onShowFeedbackOptions callback is null");
                  // No fallback - don't show dialog
                }
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
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ),
        ],
      ),
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
}
