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

String getMonthName(int month) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month - 1];
}

String getFormattedDate(DateTime date) {
  final difference = timeDifference(date);
  if (difference.contains('days')) {
    if (difference.split(' ')[0] == '0') {
      return 'TODAY';
    } else if (difference.split(' ')[0] == '1') {
      return 'YESTERDAY';
    } else {
      return '${getMonthName(date.month)} ${date.day}, ${date.year}';
    }
  } else {
    return 'TODAY';
  }
}

String formatTime(DateTime date) {
  return '${date.hour}:${date.minute}';
}
