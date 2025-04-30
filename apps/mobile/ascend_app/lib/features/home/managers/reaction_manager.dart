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
  String? _currentReaction;
  final String? postId;
  final BuildContext? context;

  // Getters
  bool get isLiked => _currentReaction != null;
  String? get currentReaction => _currentReaction;

  // Constructor - can initialize with existing reaction state
  ReactionManager({
    String? currentReaction,
    this.postId,
    this.context,
  }) {
    _currentReaction = currentReaction;
  }

  // Toggle the default reaction with Bloc integration
  void toggleReaction() {
    if (isLiked) {
      // If currently liked (any reaction), remove it
      _currentReaction = null;
    } else {
      // If not liked, set to default 'like'
      _currentReaction = 'like';
    }

    // Update the Bloc if we have context and postId
    _updateBloc();
  }

  // Update to a specific reaction
  void updateReaction(String reactionType) {
    // If selecting the same reaction that's already active, remove it
    if (isLiked && _currentReaction == reactionType) {
      removeReaction();
    } else {
      _currentReaction = reactionType;
      _updateBloc();
    }
  }

  // Remove reaction
  void removeReaction() {
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
    if (!isLiked) {
      return Icons.thumb_up_outlined;
    }
    return reactionIcons[_currentReaction!] ?? Icons.thumb_up;
  }

  // Get current reaction color
  Color getCurrentReactionColor() {
    if (!isLiked) {
      return Colors.grey;
    }
    return reactionColors[_currentReaction!] ?? Colors.blue;
  }

  // Get current reaction label
  String getCurrentReactionLabel() {
    if (!isLiked) {
      return 'Like';
    }

    switch (_currentReaction!) {
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