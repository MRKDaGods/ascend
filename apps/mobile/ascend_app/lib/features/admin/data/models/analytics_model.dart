import 'package:equatable/equatable.dart';

/// Represents analytics data for the admin dashboard.
class AnalyticsData extends Equatable {
  /// Total number of users.
  final int totalUsers;

  /// Total number of jobs.
  final int totalJobs;

  /// Total number of posts.
  final int totalPosts;

  /// Total number of connections.
  final int connections;

  /// Total number of follows.
  final int follows;

  /// Total number of reported jobs.
  final int reportedJobs;

  /// Total number of reported posts.
  final int reportedPosts;

  const AnalyticsData({
    required this.totalUsers,
    required this.totalJobs,
    required this.totalPosts,
    required this.connections,
    required this.follows,
    required this.reportedJobs,
    required this.reportedPosts,
  });

  /// Creates an instance of [AnalyticsData] from a JSON object.
  factory AnalyticsData.fromJson(Map<String, dynamic> json) {
    return AnalyticsData(
      totalUsers: json['totalUsers'] ?? 0,
      totalJobs: json['totalJobs'] ?? 0,
      totalPosts: json['totalPosts'] ?? 0,
      connections: json['connections'] ?? 0,
      follows: json['follows'] ?? 0,
      reportedJobs: json['reportedJobs'] ?? 0,
      reportedPosts: json['reportedPosts'] ?? 0,
    );
  }

  /// Converts an instance of [AnalyticsData] to a JSON object.
  Map<String, dynamic> toJson() {
    return {
      'totalUsers': totalUsers,
      'totalJobs': totalJobs,
      'totalPosts': totalPosts,
      'connections': connections,
      'follows': follows,
      'reportedJobs': reportedJobs,
      'reportedPosts': reportedPosts,
    };
  }

  @override
  List<Object?> get props => [
    totalUsers,
    totalJobs,
    totalPosts,
    connections,
    follows,
    reportedJobs,
    reportedPosts,
  ];
}
