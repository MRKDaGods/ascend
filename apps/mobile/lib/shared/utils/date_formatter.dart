import 'package:intl/intl.dart';

/// Utility class for formatting dates in a user-friendly way
class DateFormatter {
  /// Formats a DateTime as a relative time (e.g. "2 hours ago", "Yesterday", etc.)
  static String formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inSeconds < 60) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      final minutes = difference.inMinutes;
      return '$minutes ${minutes == 1 ? 'minute' : 'minutes'} ago';
    } else if (difference.inHours < 24) {
      final hours = difference.inHours;
      return '$hours ${hours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inDays < 7) {
      if (difference.inDays == 1) {
        return 'Yesterday';
      } else {
        return '${difference.inDays} days ago';
      }
    } else if (dateTime.year == now.year) {
      // Same year, show month and day
      return DateFormat.MMMd().format(dateTime);
    } else {
      // Different year, show full date
      return DateFormat.yMMMd().format(dateTime);
    }
  }
  
  /// Formats a DateTime as a short date (e.g. "Apr 7")
  static String formatShortDate(DateTime dateTime) {
    return DateFormat.MMMd().format(dateTime);
  }
  
  /// Formats a DateTime as a full date (e.g. "April 7, 2023")
  static String formatFullDate(DateTime dateTime) {
    return DateFormat.yMMMMd().format(dateTime);
  }
  
  /// Private constructor to prevent instantiation
  DateFormatter._();
}