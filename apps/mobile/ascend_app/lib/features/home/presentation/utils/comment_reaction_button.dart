import 'package:flutter/material.dart';

class CommentReactionButton extends StatelessWidget {
  final bool isLiked;
  final String currentReaction;
  final Function() onTap;
  final Function() onLongPress;
  final Map<String, IconData> reactionIcons;
  final Map<String, Color> reactionColors;

  const CommentReactionButton({
    Key? key,
    required this.isLiked,
    required this.currentReaction,
    required this.onTap,
    required this.onLongPress,
    required this.reactionIcons,
    required this.reactionColors,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get the appropriate icon and color based on reaction state
    final IconData icon = isLiked 
        ? reactionIcons[currentReaction] ?? Icons.thumb_up
        : Icons.thumb_up_outlined;
    
    final Color color = isLiked
        ? reactionColors[currentReaction] ?? Colors.blue
        : Colors.grey;
    
    // Get the reaction text
    final String reactionText = isLiked
        ? currentReaction.substring(0, 1).toUpperCase() + currentReaction.substring(1)
        : 'Like';
    
    return GestureDetector(
      onTap: onTap,
      onLongPress: onLongPress,
      child: Row(
        children: [
          Icon(
            icon,
            color: color,
            size: 16,
          ),
          const SizedBox(width: 4),
          Text(
            reactionText,
            style: TextStyle(
              color: color,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

class CommentItem extends StatelessWidget {
  final Comment comment;
  final Function(String, String)? onReaction;

  const CommentItem({
    Key? key,
    required this.comment,
    this.onReaction,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Other widgets in the row
        if (onReaction != null)
          CommentReactionButton(
            isLiked: comment.isLiked,
            currentReaction: comment.reaction ?? 'like',
            onTap: () {
              // Toggle like by default on tap
              onReaction!(comment.id, comment.isLiked ? 'none' : comment.reaction ?? 'like');
            },
            onLongPress: () {
              // Show reactions popup on long press
              _showReactionsPopup(context);
            },
            reactionIcons: ReactionManager.reactionIcons,
            reactionColors: ReactionManager.reactionColors,
          ),
      ],
    );
  }

  void _showReactionsPopup(BuildContext context) {
    // Implementation for showing reactions popup
  }
}

class Comment {
  final String id;
  final bool isLiked;
  final String? reaction;

  Comment({
    required this.id,
    required this.isLiked,
    this.reaction,
  });
}

class ReactionManager {
  static const Map<String, IconData> reactionIcons = {
    'like': Icons.thumb_up,
    'love': Icons.favorite,
    'haha': Icons.insert_emoticon,
    'wow': Icons.sentiment_very_satisfied,
    'sad': Icons.sentiment_dissatisfied,
    'angry': Icons.sentiment_very_dissatisfied,
  };

  static const Map<String, Color> reactionColors = {
    'like': Colors.blue,
    'love': Colors.red,
    'haha': Colors.yellow,
    'wow': Colors.orange,
    'sad': Colors.blueGrey,
    'angry': Colors.redAccent,
  };
}