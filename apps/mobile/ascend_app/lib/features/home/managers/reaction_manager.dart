import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/post_bloc/post_bloc.dart';
import '../bloc/post_bloc/post_event.dart';

class ReactionManager {
  // Static maps for reaction icons and colors - Updated
  static const Map<String, IconData> reactionIcons = {
    'like': Icons.thumb_up,
    'love': Icons.favorite,
    'support': Icons.volunteer_activism, // Example icon
    'celebrate': Icons.celebration, // Example icon
    'funny': Icons.sentiment_very_satisfied, // Reusing 'haha' icon
    'curious': Icons.help_outline, // Example icon
    'insightful': Icons.lightbulb_outline, // Example icon
  };

  static const Map<String, Color> reactionColors = {
    'like': Colors.blue,
    'love': Colors.red,
    'support': Colors.purple, // Example color
    'celebrate': Colors.green, // Example color
    'funny': Colors.amber, // Reusing 'haha' color
    'curious': Colors.teal, // Example color
    'insightful': Colors.orange, // Example color
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
    // Log the passed-in reaction for debugging
    if (currentReaction != null) {
      debugPrint('👍 ReactionManager initialized with reaction: $currentReaction');
    }
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
    // Log that we're explicitly removing the reaction
    debugPrint('⛔ ReactionManager: Explicitly removing reaction (was: $_currentReaction)');
    
    _currentReaction = null;
    _updateBloc();
  }

  // Private method to update the Bloc when reactions change
  void _updateBloc() {
    if (context != null && postId != null) {
      debugPrint('📢 ReactionManager: Updating bloc with reaction: $_currentReaction');
      context!.read<PostBloc>().add(
        TogglePostReaction(postId!, _currentReaction)
      );
    } else {
      debugPrint('⚠️ ReactionManager: Cannot update bloc - missing context or postId');
    }
  }

  // Get current reaction icon
  IconData getCurrentReactionIcon() {
    if (!isLiked) {
      return Icons.thumb_up_outlined; // Empty outline icon when no reaction
    }
    
    // Use specific reaction icon or default to filled thumb up
    final icon = reactionIcons[_currentReaction!];
    debugPrint('🔍 Using reaction icon for type: $_currentReaction');
    return icon ?? Icons.thumb_up;
  }

  // Get current reaction color
  Color getCurrentReactionColor() {
    if (!isLiked) {
      return Colors.grey; // Grey when no reaction
    }
    
    // Use specific reaction color or default to blue
    final color = reactionColors[_currentReaction!];
    debugPrint('🎨 Using reaction color for type: $_currentReaction');
    return color ?? Colors.blue;
  }

  // Get current reaction label - Updated
  String getCurrentReactionLabel() {
    if (!isLiked) {
      return 'Like';
    }

    switch (_currentReaction!) {
      case 'like':
        return 'Like';
      case 'love':
        return 'Love';
      case 'support':
        return 'Support';
      case 'celebrate':
        return 'Celebrate';
      case 'funny':
        return 'Funny';
      case 'curious':
        return 'Curious';
      case 'insightful':
        return 'Insightful';
      default:
        return 'Like'; // Fallback to 'Like'
    }
  }
}