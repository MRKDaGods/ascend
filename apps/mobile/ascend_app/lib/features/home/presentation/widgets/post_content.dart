import 'package:flutter/material.dart';

class PostContent extends StatelessWidget {
  final String title;
  final String description;
  final VoidCallback? onTap;
  final bool showFullDescription;

  const PostContent({
    super.key,
    required this.title,
    required this.description,
    this.onTap,
    this.showFullDescription = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title.isNotEmpty) ...[
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
          ],
          Text(
            description,
            // When showFullDescription is true, don't limit the number of lines
            maxLines: showFullDescription ? null : 5,
            overflow: showFullDescription ? TextOverflow.visible : TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 14),
          ),
          // Only show "see more" if we're not already showing the full description
          // and the description is long enough to be truncated
          if (!showFullDescription && description.length > 200) ...[
            const SizedBox(height: 4),
            GestureDetector(
              onTap: onTap,
              child: const Text(
                '...see more',
                style: TextStyle(
                  color: Colors.grey,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}