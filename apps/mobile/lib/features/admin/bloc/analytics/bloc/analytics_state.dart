part of 'analytics_bloc.dart';

@immutable
sealed class AnalyticsState {
  const AnalyticsState(); // Add this constant constructor
}

/// Initial state when no data is loaded yet.
final class AnalyticsInitial extends AnalyticsState {
  const AnalyticsInitial(); // Add const constructor here as well
}

/// State when analytics data is being fetched.
final class AnalyticsLoading extends AnalyticsState {
  const AnalyticsLoading(); // Add const constructor here as well
}

/// State when analytics data is successfully fetched.
final class AnalyticsLoaded extends AnalyticsState {
  final Map<String, int> analyticsData;

  const AnalyticsLoaded(this.analyticsData);
}

/// State when an error occurs while fetching analytics data.
final class AnalyticsError extends AnalyticsState {
  final String errorMessage;

  const AnalyticsError(this.errorMessage);
}
