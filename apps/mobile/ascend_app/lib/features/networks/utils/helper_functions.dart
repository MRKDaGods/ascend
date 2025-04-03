import 'package:flutter/material.dart';

String timeDifference(DateTime date) {
  final difference = DateTime.now().difference(date);
  if (difference.inMinutes < 60) {
    return '${difference.inMinutes} Minutes ago';
  } else if (difference.inHours < 24) {
    return '${difference.inHours} hours ago';
  } else {
    return '${difference.inDays} days ago';
  }
}
