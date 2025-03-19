import 'package:flutter/material.dart';

class ReactionConstants {
  static const Map<String, IconData> reactionIcons = {
    'like': Icons.thumb_up,
    'love': Icons.favorite,
    'celebrate': Icons.celebration,
    'support': Icons.volunteer_activism,
    'insightful': Icons.lightbulb,
  };
  
  static const Map<String, Color> reactionColors = {
    'like': Colors.blue,
    'love': Colors.red,
    'celebrate': Colors.amber,
    'support': Colors.green,
    'insightful': Colors.purple,
  };
}