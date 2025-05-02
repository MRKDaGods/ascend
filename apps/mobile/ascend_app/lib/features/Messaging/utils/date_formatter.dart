class DateFormatter {
  /// Formats a date for conversation listings
  static String formatMessageDate(DateTime? time) {
    final localTime = time?.toLocal();
    if (localTime == null) return '';

    final now = DateTime.now().toLocal();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(Duration(days: 1));
    final messageDate = DateTime(
      localTime.year,
      localTime.month,
      localTime.day,
    );

    if (messageDate == today) {
      // Today, return time
      return '${localTime.hour}:${localTime.minute.toString().padLeft(2, '0')}';
    } else if (messageDate == yesterday) {
      // Yesterday
      return 'Yesterday';
    } else if (now.difference(messageDate).inDays < 7) {
      // This week, return day name
      final dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return dayNames[localTime.weekday - 1];
    } else {
      // Older, return date
      return '${localTime.day}/${localTime.month}';
    }
  }

  /// Formats a time for message bubbles
  static String formatMessageTime(DateTime time) {
    return '${time.hour}:${time.minute.toString().padLeft(2, '0')}';
  }

  /// Formats a date header for chat
  static String formatChatDateHeader(DateTime date) {
    final localData = date.toLocal();
    final now = DateTime.now().toLocal();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(Duration(days: 1));

    if (localData == today) {
      return 'Today';
    } else if (localData == yesterday) {
      return 'Yesterday';
    } else if (now.difference(localData).inDays < 7) {
      final dayNames = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      return dayNames[localData.weekday - 1];
    } else {
      return '${localData.day}/${localData.month}/${localData.year}';
    }
  }

  /// Formats a timestamp for detailed views
  static String formatDetailedTimestamp(DateTime timestamp) {
    final now = DateTime.now().toLocal();
    final difference = now.difference(timestamp.toLocal());

    if (difference.inSeconds < 60) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      final minutes = difference.inMinutes;
      return '$minutes ${minutes == 1 ? 'minute' : 'minutes'} ago';
    } else if (difference.inHours < 24) {
      final hours = difference.inHours;
      return '$hours ${hours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inDays < 7) {
      final days = difference.inDays;
      return '$days ${days == 1 ? 'day' : 'days'} ago';
    } else {
      return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
    }
  }
}
