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

/// Represents a reported post in the admin dashboard.
class ReportedPost extends Equatable {
  /// Unique identifier for the reported post.
  final String id;

  /// Name of the author of the post.
  final String authorName;

  /// Content of the reported post.
  final String content;

  /// Reason for reporting the post.
  final String reason;

  /// Description of the report.
  final String description;

  /// Optional URL of the image associated with the post.
  final String? imageUrl;

  const ReportedPost({
    required this.id,
    required this.authorName,
    required this.content,
    required this.reason,
    required this.description,
    this.imageUrl,
  });

  /// Creates an instance of [ReportedPost] from a JSON object.
  factory ReportedPost.fromJson(Map<String, dynamic> json) {
    return ReportedPost(
      id: json['id'] ?? '',
      authorName: json['authorName'] ?? '',
      content: json['content'] ?? '',
      reason: json['reason'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'],
    );
  }

  /// Converts an instance of [ReportedPost] to a JSON object.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'authorName': authorName,
      'content': content,
      'reason': reason,
      'description': description,
      'imageUrl': imageUrl,
    };
  }

  @override
  List<Object?> get props => [
    id,
    authorName,
    content,
    reason,
    description,
    imageUrl,
  ];
}
