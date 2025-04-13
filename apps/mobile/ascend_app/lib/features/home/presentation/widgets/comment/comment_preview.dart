import 'package:flutter/material.dart';
import '../../../models/comment_model.dart';

class CommentPreview extends StatelessWidget {
  final Comment comment;
  final VoidCallback onTap;

  const CommentPreview({
    Key? key,
    required this.comment,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8.0),
          border: Border.all(color: Colors.grey[300]!),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // User avatar
                CircleAvatar(
                  radius: 14,
                  backgroundImage: AssetImage(comment.authorImageUrl),
                ),
                const SizedBox(width: 8),
                // User name
                Text(
                  comment.authorName,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                const Spacer(),
                // Time posted
                Text(
                  comment.timePosted,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            // Comment text (truncated)
            Text(
              comment.text,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 4),
            // See more comments row
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  'See all comments',
                  style: TextStyle(
                    color: Theme.of(context).primaryColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(width: 4),
                Icon(
                  Icons.arrow_forward_ios,
                  size: 10,
                  color: Theme.of(context).primaryColor,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}