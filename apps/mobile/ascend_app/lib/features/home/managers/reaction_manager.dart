import 'package:flutter/material.dart';

class ReactionManager {
  // Static maps for reaction icons and colors
  static const Map<String, IconData> reactionIcons = {
    'like': Icons.thumb_up,
    'love': Icons.favorite,
    'haha': Icons.sentiment_very_satisfied,
    'wow': Icons.emoji_emotions,
    'sad': Icons.sentiment_dissatisfied,
    'angry': Icons.mood_bad,
  };
  
  static const Map<String, Color> reactionColors = {
    'like': Colors.blue,
    'love': Colors.red,
    'haha': Colors.amber,
    'wow': Colors.amber,
    'sad': Colors.purple,
    'angry': Colors.orange,
  };
  
  // Instance properties
  bool _isLiked = false;
  String? _currentReaction;
  
  // Getters
  bool get isLiked => _isLiked;
  String? get currentReaction => _currentReaction;
  
  // Constructor - can initialize with existing reaction state
  ReactionManager({bool isLiked = false, String? currentReaction}) {
    _isLiked = isLiked;
    _currentReaction = currentReaction;
  }
  
  // Toggle the default reaction (like)
  void toggleReaction() {
    if (_isLiked && _currentReaction == 'like') {
      // If already liked with default reaction, remove it
      _isLiked = false;
      _currentReaction = null;
    } else {
      // Otherwise set to default like
      _isLiked = true;
      _currentReaction = 'like';
    }
  }
  
  // Update to a specific reaction
  void updateReaction(String reactionType) {
    _isLiked = true;
    _currentReaction = reactionType;
  }
  
  // Remove reaction
  void removeReaction() {
    _isLiked = false;
    _currentReaction = null;
  }
  
  // Get current reaction icon
  IconData getCurrentReactionIcon() {
    if (!_isLiked) {
      return Icons.thumb_up_outlined;
    }
    return reactionIcons[_currentReaction] ?? Icons.thumb_up;
  }
  
  // Get current reaction color
  Color getCurrentReactionColor() {
    if (!_isLiked) {
      return Colors.grey;
    }
    return reactionColors[_currentReaction] ?? Colors.blue;
  }
  
  // Get current reaction label
  String getCurrentReactionLabel() {
    if (!_isLiked) {
      return 'Like';
    }
    
    switch (_currentReaction) {
      case 'like':
        return 'Like';
      case 'love':
        return 'Love';
      case 'haha':
        return 'Haha';
      case 'wow':
        return 'Wow';
      case 'sad':
        return 'Sad';
      case 'angry':
        return 'Angry';
      default:
        return 'Like';
    }
  }
}