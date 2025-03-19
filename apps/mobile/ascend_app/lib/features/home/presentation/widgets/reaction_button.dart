import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ReactionButton extends StatelessWidget {
  final bool isLiked;
  final String reaction;
  final int likesCount;
  final Function(String) onReactionSelected;
  
  const ReactionButton({
    super.key,
    required this.isLiked,
    required this.reaction,
    required this.likesCount,
    required this.onReactionSelected,
  });
  
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        GestureDetector(
          onTap: () => onReactionSelected('like'),
          onLongPress: () => _showReactionOptions(context),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Icon(
              _getReactionIcon(reaction),
              color: isLiked ? _getReactionColor(reaction) : Colors.grey,
            ),
          ),
        ),
        Text(
          '$likesCount',
          style: TextStyle(
            color: isLiked ? _getReactionColor(reaction) : Colors.grey,
          ),
        ),
      ],
    );
  }
  
  void _showReactionOptions(BuildContext context) {
    final RenderBox button = context.findRenderObject() as RenderBox;
    final RenderBox overlay = Overlay.of(context).context.findRenderObject() as RenderBox;
    final Offset position = Offset(0, -80);
    final RelativeRect positionRect = RelativeRect.fromRect(
      Rect.fromPoints(
        button.localToGlobal(position, ancestor: overlay),
        button.localToGlobal(button.size.bottomRight(Offset.zero), ancestor: overlay),
      ),
      Offset.zero & overlay.size,
    );

    showMenu(
      context: context,
      position: positionRect,
      items: [
        _buildReactionMenuItem('like'),
        _buildReactionMenuItem('love'),
        _buildReactionMenuItem('support'),
        _buildReactionMenuItem('celebrate'),
        _buildReactionMenuItem('insightful'),
        _buildReactionMenuItem('curious'),
      ],
    );
  }
  
  PopupMenuItem<String> _buildReactionMenuItem(String reactionType) {
    return PopupMenuItem<String>(
      value: reactionType,
      onTap: () => onReactionSelected(reactionType),
      child: Row(
        children: [
          Icon(_getReactionIcon(reactionType), color: _getReactionColor(reactionType)),
          const SizedBox(width: 8),
          Text(reactionType.capitalize()),
        ],
      ),
    );
  }
  
  // Helper methods to get the right icon and color for each reaction
  IconData _getReactionIcon(String reaction) {
    switch (reaction) {
      case 'like':
        return FontAwesomeIcons.thumbsUp;
      case 'love':
        return FontAwesomeIcons.heart;
      case 'support':
        return FontAwesomeIcons.handHoldingHeart;
      case 'celebrate':
        return FontAwesomeIcons.champagneGlasses;
      case 'insightful':
        return FontAwesomeIcons.lightbulb;
      case 'curious':
        return FontAwesomeIcons.faceSurprise;
      default:
        return FontAwesomeIcons.thumbsUp;
    }
  }
  
  Color _getReactionColor(String reaction) {
    switch (reaction) {
      case 'like':
        return Colors.blue;
      case 'love':
        return Colors.red;
      case 'support':
        return Colors.purple;
      case 'celebrate':
        return Colors.amber;
      case 'insightful':
        return Colors.green;
      case 'curious':
        return Colors.orange;
      default:
        return Colors.blue;
    }
  }
}

// Extension to capitalize strings
extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1)}";
  }
}