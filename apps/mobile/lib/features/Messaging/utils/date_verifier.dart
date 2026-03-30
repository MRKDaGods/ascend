import 'package:flutter/widgets.dart';

class DateVerifier {
  /// Checks if a date is today
  static bool isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  /// Checks if a date is yesterday
  static bool isYesterday(DateTime date) {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return date.year == yesterday.year &&
        date.month == yesterday.month &&
        date.day == yesterday.day;
  }

  /// Gets a formatted string for a date based on how recent it is
  static String getFormattedDateString(DateTime date) {
    final localDate = date.toLocal();
    if (isToday(localDate)) {
      return 'TODAY';
    } else if (isYesterday(localDate)) {
      return 'YESTERDAY';
    } else {
      // Format for other dates (e.g., "APR 25")
      final months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ];
      return '${months[date.month - 1]} ${localDate.day}';
    }
  }

  /// Formats time in 12-hour format (e.g., "5:20am")
  static String formatTime(DateTime time) {
    // Convert to local time zone before formatting
    final localDate = time.toLocal();

    // Debug logging to see the time conversion
    debugPrint('Original UTC time: $time');
    // Format using local time
    return '${localDate.hour % 12}:${localDate.minute.toString().padLeft(2, '0')}${localDate.hour >= 12 ? 'pm' : 'am'}';
  }

  /// Checks if a message has been read
  static bool isMessageRead(DateTime? readAt, DateTime sentAt) {
    if (readAt == null) return false;
    return readAt.isAfter(sentAt);
  }

  /// Checks if two dates are on the same day
  static bool isSameDay(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }
}
