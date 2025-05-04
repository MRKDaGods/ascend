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
      reporterProfilePicture:
          reporterProfilePicture ?? this.reporterProfilePicture,
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
      id: json['id'] ?? 0,
      reporterId: json['reporter_id'] ?? 0,
      reporterFullName: json['reporter_full_name'] ?? '',
      reporterProfilePicture: json['reporter_profile_picture'] ?? '',
      reason: json['reason'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'pending',
      adminComment: json['admin_comment'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'])
              : DateTime.now(),
    );
  }
}

class ReportedPost {
  final String id;
  final String authorFullName;
  final String profilePictureUrl;
  final String content;
  final List<Map<String, String>>
  media; // Change to store media with type information
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
    required this.media,
    required this.privacy,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.createdAt,
    this.reports = const [],
  });

  // Get just the URLs for backward compatibility
  List<String> get mediaUrls => media.map((m) => m['url'] ?? '').toList();

  // Add this copyWith method to enable updating properties
  ReportedPost copyWith({
    String? id,
    String? authorFullName,
    String? profilePictureUrl,
    String? content,
    List<Map<String, String>>? media,
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
      media: media ?? this.media,
      privacy: privacy ?? this.privacy,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      sharesCount: sharesCount ?? this.sharesCount,
      createdAt: createdAt ?? this.createdAt,
      reports: reports ?? this.reports,
    );
  }

  factory ReportedPost.fromJson(Map<String, dynamic> json) {
    // Handle potentially null fields safely
    final user = json['user'] ?? {};
    final mediaList = json['media'] as List? ?? [];

    return ReportedPost(
      id: json['id']?.toString() ?? '', // Ensure ID is a string and handle null
      content: json['content'] ?? '',
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
      privacy: json['privacy'] ?? 'private',
      likesCount: json['likes_count'] ?? 0,
      commentsCount: json['comments_count'] ?? 0,
      sharesCount: json['shares_count'] ?? 0,
      media: _parseMedia(mediaList),
      authorFullName: _formatFullName(user),
      reports: _parseReports(json),
      profilePictureUrl: _parseProfilePic(user),
    );
  }

  static String _formatFullName(Map<String, dynamic> user) {
    final firstName = user['first_name'] ?? '';
    final lastName = user['last_name'] ?? '';
    return '$firstName $lastName'.trim();
  }

  // New method to parse media with type information
  static List<Map<String, String>> _parseMedia(List mediaList) {
    return mediaList.map((m) {
      if (m is Map) {
        return {
          'url': m['url']?.toString() ?? '',
          'type': m['type']?.toString() ?? 'image',
          'title': m['title']?.toString() ?? '',
          'description': m['description']?.toString() ?? '',
        };
      }
      return {'url': '', 'type': 'image', 'title': '', 'description': ''};
    }).toList();
  }

  // Keep this for backward compatibility
  static List<String> _parseMediaUrls(List media) {
    return media
        .map((m) {
          if (m is Map && m.containsKey('url')) {
            return m['url']?.toString() ?? '';
          }
          return '';
        })
        .where((url) => url.isNotEmpty)
        .toList();
  }

  static List<PostReport> _parseReports(Map<String, dynamic> json) {
    if (json.containsKey('reports') && json['reports'] is List) {
      return (json['reports'] as List)
          .map((reportJson) => PostReport.fromJson(reportJson))
          .toList();
    }
    return [];
  }

  static String _parseProfilePic(Map<String, dynamic> user) {
    // Handle the changes in profile picture structure
    // Check if profile_picture_id exists and is not null
    if (user.containsKey('profile_picture_id') &&
        user['profile_picture_id'] != null) {
      // If you have a way to construct the URL from ID, implement it here
      return 'https://api.ascendx.tech/files/view?token=${user['profile_picture_id']}';
    }

    // Check for backward compatibility
    if (user.containsKey('profile_picture_url') &&
        user['profile_picture_url'] != null) {
      return user['profile_picture_url'];
    }

    // Return empty string as fallback
    return '';
  }
}
