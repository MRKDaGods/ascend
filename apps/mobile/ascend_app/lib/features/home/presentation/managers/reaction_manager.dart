import 'package:flutter/material.dart';

class ReactionManager {
  final bool isLiked;
  final String currentReaction;
  final int likesCount;
  final Function(bool, String, int) onReactionChanged;
  
  // Map reactions to their icons
  static const Map<String, IconData> reactionIcons = {
    'like': Icons.thumb_up,
    'love': Icons.favorite,
    'laugh': Icons.sentiment_very_satisfied, 
    'wow': Icons.sentiment_satisfied_alt,
    'sad': Icons.sentiment_dissatisfied,
    'angry': Icons.sentiment_very_dissatisfied,
  };
  
  // Map reactions to their colors
  static const Map<String, Color> reactionColors = {
    'like': Colors.blue,
    'love': Colors.red,
    'laugh': Colors.amber,
    'wow': Colors.orange,
    'sad': Colors.blueGrey,
    'angry': Colors.deepOrange,
  };
  
  ReactionManager({
    required this.isLiked, 
    required this.currentReaction,
    required this.likesCount,
    required this.onReactionChanged,
  });
  
  void toggleReaction(String reactionType) {
    bool newIsLiked = isLiked;
    String newReaction = currentReaction;
    int newLikesCount = likesCount;
    
    if (isLiked) {
      if (currentReaction != reactionType) {
        newReaction = reactionType;
      } else {
        newLikesCount--;
        newIsLiked = false;
        newReaction = 'like';
      }
    } else {
      newLikesCount++;
      newIsLiked = true;
      newReaction = reactionType;
    }
    
    onReactionChanged(newIsLiked, newReaction, newLikesCount);
  }
  
  IconData getCurrentReactionIcon() {
    return isLiked ? reactionIcons[currentReaction]! : reactionIcons['like']!;
  }
  
  Color? getCurrentReactionColor() {
    return isLiked ? reactionColors[currentReaction] : null;
  }
}