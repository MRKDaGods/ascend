import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/post_bloc/post_bloc.dart';
import '../bloc/post_bloc/post_event.dart';

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
  final String? postId;
  final BuildContext? context;
  
  // Getters
  bool get isLiked => _isLiked;
  String? get currentReaction => _currentReaction;
  
  // Constructor - can initialize with existing reaction state
  ReactionManager({
    bool isLiked = false, 
    String? currentReaction,
    this.postId,
    this.context,
  }) {
    _isLiked = isLiked;
    _currentReaction = currentReaction;
  }
  
  // Toggle the default reaction with Bloc integration
  void toggleReaction() {
    if (_isLiked) {
      _isLiked = false;
      _currentReaction = null;
    } else {
      _isLiked = true;
      _currentReaction = 'like';
    }
    
    // Update the Bloc if we have context and postId
    _updateBloc();
  }
  
  // Update to a specific reaction
  void updateReaction(String reactionType) {
    // If selecting the same reaction that's already active, remove it
    if (_isLiked && _currentReaction == reactionType) {
      removeReaction();

    } else {
      _isLiked = true;
      _currentReaction = reactionType;
      _updateBloc();
    }
  }
  
  // Remove reaction
  void removeReaction() {
    _isLiked = false;
    _currentReaction = null;
    _updateBloc();
  }
  
  // Private method to update the Bloc when reactions change
  void _updateBloc() {
    if (context != null && postId != null) {
      context!.read<PostBloc>().add(
        TogglePostReaction(postId!, _currentReaction)
      );
    }
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