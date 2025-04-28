import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/managers/reaction_manager.dart';
import 'package:ascend_app/features/home/presentation/widgets/reaction/reaction_button.dart';
import 'package:ascend_app/features/home/presentation/utils/sheet_helpers.dart';

class CommentBox extends StatelessWidget {
  final String authorName;
  final String? authorOccupation;
  final String timePosted;
  final String text;
  final String avatarImage;

  // Replace generic onMenuTap with specific handlers
  final Function(String) onMenuOptionSelected;

  final VoidCallback? onReplyTap;
  final VoidCallback? onReactionTap;
  final VoidCallback? onReactionLongPress;
  final bool isLiked;
  final String? reaction;
  final int likeCount;

  // Optional: Allow child widgets to be passed in instead of text
  final Widget? child;

  const CommentBox({
    super.key,
    required this.authorName,
    this.authorOccupation,
    required this.timePosted,
    required this.text,
    required this.avatarImage,
    required this.onMenuOptionSelected,
    this.onReplyTap,
    this.onReactionTap,
    this.onReactionLongPress,
    this.isLiked = false,
    this.reaction,
    this.likeCount = 0,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Avatar
        CircleAvatar(backgroundImage: AssetImage(avatarImage), radius: 16),

        const SizedBox(width: 8),

        // Comment content and actions
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Gray comment box
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Author info row with time and menu all on the same line
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Author name (left side)
                        Expanded(
                          child: Text(
                            authorName,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ),

                        // Right side with time and menu dots on the same line
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Time posted
                            Text(
                              timePosted,
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 12,
                              ),
                            ),

                            // Menu dots - aligned with time and name
                            InkWell(
                              onTap: () => _showOptionsSheet(context),
                              child: Padding(
                                padding: const EdgeInsets.only(left: 4.0),
                                child: Icon(
                                  Icons.more_horiz,
                                  color: Colors.grey[600],
                                  size: 18,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Author occupation if available - below the name
                    if (authorOccupation != null &&
                        authorOccupation!.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 2.0),
                        child: Text(
                          authorOccupation!,
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ),

                    const SizedBox(height: 8),

                    // Comment text or custom child widget
                    child ?? Text(text),
                  ],
                ),
              ),

              // Interaction buttons (like and reply)
              Padding(
                padding: const EdgeInsets.only(left: 12.0, top: 4.0),
                child: Row(
                  children: [
                    // Replace PostReactionButton with ReactionButton
                    if (onReactionTap != null)
                      Row(
                        children: [
                          ReactionButton(
                            // Create a manager with the current state
                            manager: ReactionManager(
                              isLiked: isLiked,
                              currentReaction: reaction,
                            ),
                            // Connect callbacks
                            onTap: onReactionTap,
                            onLongPressStart: onReactionLongPress ?? () {},
                            onLongPressEnd: () {}, // Add empty handler
                          ),
                          // Display like count
                          if (likeCount > 0)
                            Padding(
                              padding: const EdgeInsets.only(left: 4.0),
                              child: Text(
                                likeCount.toString(),
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 12,
                                ),
                              ),
                            ),
                        ],
                      ),

                    const SizedBox(width: 16),

                    // Always show Reply button if onReplyTap is provided
                    if (onReplyTap != null)
                      GestureDetector(
                        onTap: onReplyTap,
                        child: Text(
                          'Reply',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Use SheetHelpers, but connect to our callback system
  void _showOptionsSheet(BuildContext context) {
    SheetHelpers.showPostOptionsSheet(
      context: context,
      ownerName: authorName,
      showSave: false,
      showNotInterested: false,
      showUnfollow: false,
      showMessage: true, // Enable message option
      reportText: 'Report comment',
      onShare: () {
        Navigator.pop(context);
        onMenuOptionSelected('share');
      },
      onMessage: () {
        Navigator.pop(context);
        onMenuOptionSelected('message');
      },
      onReport: () {
        Navigator.pop(context);
        onMenuOptionSelected('report');
      },
    );
  }
}
