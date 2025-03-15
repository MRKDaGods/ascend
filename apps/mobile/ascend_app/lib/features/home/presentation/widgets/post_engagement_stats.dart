import 'package:flutter/material.dart';

class PostEngagementStats extends StatelessWidget {
  final int likesCount;
  final int commentsCount;
  final IconData reactionIcon;
  final Color? reactionColor;

  const PostEngagementStats({
    super.key,
    required this.likesCount,
    required this.commentsCount,
    required this.reactionIcon,
    this.reactionColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(
            reactionIcon,
            size: 16,
            color: reactionColor ?? Colors.grey[600],
          ),
          const SizedBox(width: 4),
          Text(
            '$likesCount likes',
            style: TextStyle(color: Colors.grey[600], fontSize: 12),
          ),
          const SizedBox(width: 12),
          Text(
            '$commentsCount comments',
            style: TextStyle(color: Colors.grey[600], fontSize: 12),
          ),
        ],
      ),
    );
  }
}