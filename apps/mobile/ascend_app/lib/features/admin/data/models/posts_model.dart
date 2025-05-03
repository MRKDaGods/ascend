class PostReport {
  final int id;
  final int reporterId;
  final String reporterFullName;
  final String reporterProfilePicture;
  final String reason;
  final String description;
  final String status;
  final String? adminComment;
  final DateTime createdAt;
  final DateTime updatedAt;

  PostReport({
    required this.id,
    required this.reporterId,
    required this.reporterFullName,
    required this.reporterProfilePicture,
    required this.reason,
    required this.description,
    required this.status,
    this.adminComment,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PostReport.fromJson(Map<String, dynamic> json) {
    return PostReport(
      id: json['id'],
      reporterId: json['reporter_id'],
      reporterFullName: json['reporter_full_name'],
      reporterProfilePicture: json['reporter_profile_picture'],
      reason: json['reason'],
      description: json['description'],
      status: json['status'],
      adminComment: json['admin_comment'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}

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
  final String profilePictureUrl;

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
    required this.profilePictureUrl,
  });

  factory ReportedPost.fromJson(Map<String, dynamic> json) {
    final user = json['user'] ?? {};
    final media = json['media'] as List? ?? [];

    return ReportedPost(
      id: json['id'].toString(), // Ensure ID is a string
      content: json['content'],
      createdAt: DateTime.parse(json['created_at']),
      privacy: json['privacy'],
      likesCount: json['likes_count'],
      commentsCount: json['comments_count'],
      sharesCount: json['shares_count'],
      mediaUrls: media.map((m) => m['url'].toString()).toList(),
      authorFullName: '${user['first_name']} ${user['last_name']}',
      reports:
          (json['reports'] as List? ?? [])
              .map((reportJson) => PostReport.fromJson(reportJson))
              .toList(),
      profilePictureUrl: _parseProfilePic(user['profile_picture_url']) ?? '',
    );
  }

  static String? _parseProfilePic(dynamic value) {
    // If the value is a String, it's a valid URL
    if (value is String) {
      return value;
    }
    // If the value is an int or any other type, return null to use fallback
    return null;
  }
}
