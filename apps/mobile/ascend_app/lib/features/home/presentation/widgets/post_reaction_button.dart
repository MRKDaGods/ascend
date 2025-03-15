import 'package:flutter/material.dart';
import 'package:ascend_app/core/extensions/string_extensions.dart';

class PostReactionButton extends StatelessWidget {
  final bool isLiked;
  final String currentReaction;
  final VoidCallback onTap;
  final VoidCallback onLongPress;
  final Map<String, IconData> reactionIcons;
  final Map<String, Color> reactionColors;

  const PostReactionButton({
    super.key,
    required this.isLiked,
    required this.currentReaction,
    required this.onTap,
    required this.onLongPress,
    required this.reactionIcons,
    required this.reactionColors,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      onLongPress: onLongPress,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: [
            Icon(
              isLiked ? reactionIcons[currentReaction] : Icons.thumb_up_outlined,
              size: 20,
              color: isLiked ? reactionColors[currentReaction] : null,
            ),
            const SizedBox(width: 4),
            Text(
              isLiked ? currentReaction.capitalize() : "Like",
              style: TextStyle(
                fontSize: 12,
                color: isLiked ? reactionColors[currentReaction] : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}