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

  // Add copyWith method to enable easy status updates
  PostReport copyWith({
    int? id,
    int? reporterId,
    String? reporterFullName,
    String? reporterProfilePicture,
    String? reason,
    String? description,
    String? status,
    String? adminComment,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return PostReport(
      id: id ?? this.id,
      reporterId: reporterId ?? this.reporterId,
      reporterFullName: reporterFullName ?? this.reporterFullName,
      reporterProfilePicture: reporterProfilePicture ?? this.reporterProfilePicture,
      reason: reason ?? this.reason,
      description: description ?? this.description,
      status: status ?? this.status,
      adminComment: adminComment ?? this.adminComment,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

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
  final String authorFullName;
  final String profilePictureUrl;
  final String content;
  final List<String> mediaUrls;
  final String privacy;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final DateTime createdAt;
  final List<PostReport> reports;

  ReportedPost({
    required this.id,
    required this.authorFullName,
    required this.profilePictureUrl,
    required this.content,
    required this.mediaUrls,
    required this.privacy,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.createdAt,
    this.reports = const [],
  });

  // Add this copyWith method to enable updating properties
  ReportedPost copyWith({
    String? id,
    String? authorFullName,
    String? profilePictureUrl,
    String? content,
    List<String>? mediaUrls,
    String? privacy,
    int? likesCount,
    int? commentsCount,
    int? sharesCount,
    DateTime? createdAt,
    List<PostReport>? reports,
  }) {
    return ReportedPost(
      id: id ?? this.id,
      authorFullName: authorFullName ?? this.authorFullName,
      profilePictureUrl: profilePictureUrl ?? this.profilePictureUrl,
      content: content ?? this.content,
      mediaUrls: mediaUrls ?? this.mediaUrls,
      privacy: privacy ?? this.privacy,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      sharesCount: sharesCount ?? this.sharesCount,
      createdAt: createdAt ?? this.createdAt,
      reports: reports ?? this.reports,
    );
  }

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
