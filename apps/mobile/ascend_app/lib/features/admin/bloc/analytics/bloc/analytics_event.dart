part of 'analytics_bloc.dart';

@immutable
sealed class AnalyticsEvent {
  const AnalyticsEvent(); // Add this constant constructor
}

/// Event to fetch analytics data for a specific duration.
final class FetchAnalyticsEvent extends AnalyticsEvent {
  final String duration; // e.g., 'day', 'week', 'month'

  const FetchAnalyticsEvent(this.duration); // Keep the const keyword
}
