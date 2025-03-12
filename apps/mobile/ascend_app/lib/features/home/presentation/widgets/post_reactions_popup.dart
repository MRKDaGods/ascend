import 'package:ascend_app/core/extensions/string_extensions.dart';
import 'package:flutter/material.dart';

class PostReactionsPopup extends StatelessWidget {
  final Map<String, IconData> reactionIcons;
  final Map<String, Color> reactionColors;
  final Function(String) onReactionSelected;
  final Offset position;

  const PostReactionsPopup({
    super.key,
    required this.reactionIcons,
    required this.reactionColors,
    required this.onReactionSelected,
    required this.position,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    return Stack(
      children: [
        Positioned(
          left: 0,
          right: 0,
          top: position.dy + 280, // Adjust this value as needed
          child: Center(
            child: Material(
              color: Colors.transparent,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
                height: 71,
                constraints: BoxConstraints(
                  maxWidth: screenWidth * 0.9,
                  minWidth: screenWidth * 0.6,
                ),
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