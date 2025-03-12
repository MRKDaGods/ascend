import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/comment_model.dart';

class CommentItem extends StatelessWidget {
  final Comment comment;

  const CommentItem({
    super.key,
    required this.comment,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundImage: AssetImage(comment.authorImage),
            radius: 16,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        comment.authorName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                      const SizedBox(height: 2),
                      Text(comment.text),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 2.0, left: 8.0),
                  child: Row(
                    children: [
                      Text(
                        comment.timePosted,
                        style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        'Like',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        'Reply',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}