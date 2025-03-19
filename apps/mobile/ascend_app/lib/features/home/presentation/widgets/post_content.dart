import 'package:flutter/material.dart';

class PostContent extends StatelessWidget {
  final String title;
  final String description;
  final bool showFullDescription;
  final VoidCallback? onTap;
  final int maxDescriptionLength; // Character limit for showing "Read more"
  
  const PostContent({
    super.key,
    required this.title,
    required this.description,
    this.showFullDescription = false,
    this.onTap,
    this.maxDescriptionLength = 150, // Default value
  });

  @override
  Widget build(BuildContext context) {
    final bool needsReadMore = description.length > maxDescriptionLength && !showFullDescription;
    
    return GestureDetector(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
          
          if (description.isNotEmpty) ...[
            const SizedBox(height: 8),
            if (!needsReadMore)
              // Show the full description
              Text(description)
            else
              // Show truncated description with "Read more" link
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${description.substring(0, maxDescriptionLength)}...',
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  GestureDetector(
                    onTap: onTap,
                    child: Text(
                      'Read more',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ],
      ),
    );
  }
}