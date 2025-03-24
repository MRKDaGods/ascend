import 'package:ascend_app/core/extensions/string_extensions.dart';
import 'package:flutter/material.dart';

class PostReactionsPopup extends StatelessWidget {
  final Map<String, IconData> reactionIcons;
  final Map<String, Color> reactionColors;
  final Function(String) onReactionSelected;
  final Offset position;
  final bool isComment; // Add this parameter to differentiate posts from comments

  const PostReactionsPopup({
    super.key,
    required this.reactionIcons,
    required this.reactionColors,
    required this.onReactionSelected,
    required this.position,
    this.isComment = false, // Default to post behavior
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    
    // Calculate popup height
    const popupHeight = 71.0;
    
    // Position the popup differently for comments vs posts
    double topPosition;
    
    if (isComment) {
      // For comments: Position 50 pixels above tap point
      topPosition = position.dy - popupHeight +20;
    } else {
      // For posts: Position 60 pixels above the bottom of the post
      topPosition = position.dy+150 ;
    }
    
    // Ensure the popup stays on screen
    if (topPosition < 10) {
      topPosition = 10;
    }
    
    return Stack(
      children: [
        // Full screen transparent touch target to dismiss popup
        Positioned.fill(
          child: GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            behavior: HitTestBehavior.opaque,
            child: Container(color: Colors.transparent),
          ),
        ),
        
        // Reactions popup - always centered horizontally
        Positioned(
          left: 0,
          right: 0,
          top: topPosition,
          child: Center(
            child: Material(
              color: Colors.transparent,
              elevation: 8,
              borderRadius: BorderRadius.circular(30),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
                height: popupHeight,
                width: screenWidth * 0.7, // Fix width at 70% of screen
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      spreadRadius: 1,
                      blurRadius: 5,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: reactionIcons.entries.map((entry) {
                    return _buildReactionOption(entry.key, entry.value);
                  }).toList(),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildReactionOption(String type, IconData icon) {
    return GestureDetector(
      onTap: () => onReactionSelected(type),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.grey[100],
              ),
              padding: const EdgeInsets.all(8.0),
              child: Icon(
                icon,
                color: reactionColors[type],
                size: 20,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              type.capitalize(),
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.bold,
                color: reactionColors[type],
              ),
            ),
          ],
        ),
      ),
    );
  }
}