class ReportedPost {
  final String id;
  final String content;
  final DateTime createdAt;
  final String privacy;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final List<String> mediaUrls;
  final String authorFullName;
  final List<PostReport> reports;

  ReportedPost({
    required this.id,
    required this.content,
    required this.createdAt,
    required this.privacy,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.mediaUrls,
    required this.authorFullName,
    required this.reports,
  });

  factory ReportedPost.fromJson(Map<String, dynamic> json) {
    final user = json['user'] ?? {};
    final media = json['media'] as List? ?? [];

    return ReportedPost(
      id: json['id'],
      content: json['content'],
      createdAt: DateTime.parse(json['created_at']),
      privacy: json['privacy'],
      likesCount: json['likes_count'],
      commentsCount: json['comments_count'],
      sharesCount: json['shares_count'],
      mediaUrls: media.map<String>((m) => m['url'] as String).toList(),
      authorFullName:
          '${user['first_name'] ?? 'Unknown'} ${user['last_name'] ?? 'User'}',
      reports: (json['reports'] as List? ?? [])
          .map((r) => PostReport.fromJson(r))
          .toList(),
    );
  }
}

class PostReport {
  final String reporter;
  final String reason;
  final String description;

  PostReport({
    required this.reporter,
    required this.reason,
    required this.description,
  });

  factory PostReport.fromJson(Map<String, dynamic> json) {
    return PostReport(
      reporter: json['reporter'] ?? 'Unknown',
      reason: json['reason'] ?? 'N/A',
      description: json['description'] ?? '',
    );
  }
}