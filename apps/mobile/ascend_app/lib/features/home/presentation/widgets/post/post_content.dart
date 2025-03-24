import 'package:flutter/material.dart';

class PostContent extends StatefulWidget {
  final String title;
  final String description;
  final bool showFullDescription;
  final VoidCallback? onTap;
  final VoidCallback? onReadMoreTap; // New callback specifically for Read more button
  final int maxDescriptionLength; // Character limit for showing "Read more"
  
  const PostContent({
    super.key,
    required this.title,
    required this.description,
    this.showFullDescription = false,
    this.onTap,
    this.onReadMoreTap,
    this.maxDescriptionLength = 150, // Default value
  });

  @override
  State<PostContent> createState() => _PostContentState();
}

class _PostContentState extends State<PostContent> {
  bool _expanded = false;

  @override
  void initState() {
    super.initState();
    _expanded = widget.showFullDescription;
  }

  @override
  void didUpdateWidget(PostContent oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.showFullDescription != widget.showFullDescription) {
      _expanded = widget.showFullDescription;
    }
  }

  void _toggleExpanded() {
    setState(() {
      _expanded = !_expanded;
    });
    
    // If there's a specific callback for read more, call it
    if (widget.onReadMoreTap != null) {
      widget.onReadMoreTap!();
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool needsReadMore = widget.description.length > widget.maxDescriptionLength && !_expanded;
    
    return GestureDetector(
      onTap: widget.onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.title.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              widget.title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
          
          if (widget.description.isNotEmpty) ...[
            const SizedBox(height: 8),
            if (!needsReadMore)
              // Show the full description
              Text(widget.description)
            else
              // Show truncated description with "Read more" link
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${widget.description.substring(0, widget.maxDescriptionLength)}...',
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  GestureDetector(
                    onTap: () {
                      _toggleExpanded();
                    },
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