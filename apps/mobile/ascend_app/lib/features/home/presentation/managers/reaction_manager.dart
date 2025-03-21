import 'package:flutter/material.dart';

class ReactionManager {
  bool _isLiked;
  String _currentReaction;
  int _likesCount;
  final Function(bool, String, int) onReactionChanged;

  static const Map<String, IconData> reactionIcons = {
    'like': Icons.thumb_up,
    'love': Icons.favorite,
    'haha': Icons.sentiment_very_satisfied,
    'wow': Icons.sentiment_satisfied_alt,
    'sad': Icons.sentiment_dissatisfied,
    'angry': Icons.sentiment_very_dissatisfied,
  };

  static const Map<String, Color> reactionColors = {
    'like': Colors.blue,
    'love': Colors.red,
    'haha': Colors.amber,
    'wow': Colors.amber,
    'sad': Colors.amber,
    'angry': Colors.orange,
  };

  ReactionManager({
    required bool isLiked,
    required String currentReaction,
    required int likesCount,
    required this.onReactionChanged,
  })  : _isLiked = isLiked,
        _currentReaction = currentReaction,
        _likesCount = likesCount;

  IconData getCurrentReactionIcon() {
    return _isLiked ? reactionIcons[_currentReaction]! : Icons.thumb_up_outlined;
  }

  Color getCurrentReactionColor() {
    return _isLiked ? reactionColors[_currentReaction]! : Colors.grey;
  }

  void toggleReaction(String reactionType) {
    // If already liked with the same reaction, unlike it
    if (_isLiked && _currentReaction == reactionType) {
      _isLiked = false;
      _likesCount--; // This is the key fix - decrement count when unliking
      onReactionChanged(_isLiked, _currentReaction, _likesCount);
      return;
    }

    // If already liked but with a different reaction, just change the reaction type
    // If not liked, like it with the given reaction type
    bool wasLiked = _isLiked;
    _isLiked = true;
    _currentReaction = reactionType;
    
    // Only increment count if this is a new like, not a reaction change
    if (!wasLiked) {
      _likesCount++;
    }
    
    onReactionChanged(_isLiked, _currentReaction, _likesCount);
  }
}