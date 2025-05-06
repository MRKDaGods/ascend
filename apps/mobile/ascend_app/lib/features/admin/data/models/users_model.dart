class UserReport {
  final int id;
  final int reportedId;
  final int reportedById;
  final String reason;
  final DateTime createdAt;
  final ReportedUser reported;
  final ReporterUser reportedBy;

  UserReport({
    required this.id,
    required this.reportedId,
    required this.reportedById,
    required this.reason,
    required this.createdAt,
    required this.reported,
    required this.reportedBy,
  });

  factory UserReport.fromJson(Map<String, dynamic> json) {
    return UserReport(
      id: json['id'],
      reportedId: json['reported_id'],
      reportedById: json['reported_by_id'],
      reason: json['reason'],
      createdAt: DateTime.parse(json['created_at']),
      reported: ReportedUser.fromJson({
        ...json['reported'],
        'user_id':
            json['reported_id'], // Dynamically pass the reportedId as userId
      }),
      reportedBy: ReporterUser.fromJson(json['reported_by']),
    );
  }
}

class ReportedUser {
  final int userId;
  final String firstName;
  final String lastName;
  final String email;
  final String? profilePictureUrl;
  final String? coverPhotoUrl; // Add this property
  final DateTime joinedAt;

  ReportedUser({
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.joinedAt,
    this.profilePictureUrl,
    this.coverPhotoUrl, // Add this to constructor
  });

  factory ReportedUser.fromJson(Map<String, dynamic> json) {
    return ReportedUser(
      userId: json['user_id'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      email: json['contact_info']['email'],
      profilePictureUrl: json['profile_picture_url'],
      coverPhotoUrl: json['cover_photo_url'], // Extract from JSON
      joinedAt: DateTime.parse(json['created_at']),
    );
  }
}

class ReporterUser {
  final int userId;
  final String firstName;
  final String lastName;

  ReporterUser({
    required this.userId,
    required this.firstName,
    required this.lastName,
  });

  factory ReporterUser.fromJson(Map<String, dynamic> json) {
    return ReporterUser(
      userId: json['user_id'],
      firstName: json['first_name'],
      lastName: json['last_name'],
    );
  }
}

class BannedUser {
  final int id;
  final int userId;
  final String? reason;
  final int bannedBy;
  final DateTime createdAt;
  final DateTime? expiresAt;
  // Simplified user profile info
  final String firstName;
  final String lastName;
  final String? profilePictureUrl;
  final String? coverPhotoUrl;
  final String privacy;
  final String email;
  // Simplified banner info
  final String bannerFirstName;
  final String bannerLastName;

  BannedUser({
    required this.id,
    required this.userId,
    this.reason,
    required this.bannedBy,
    required this.createdAt,
    this.expiresAt,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.privacy,
    this.profilePictureUrl,
    this.coverPhotoUrl,
    required this.bannerFirstName,
    required this.bannerLastName,
  });

  factory BannedUser.fromJson(Map<String, dynamic> json) {
    return BannedUser(
      id: json['id'],
      userId: json['user_id'],
      reason: json['reason'],
      bannedBy: json['banned_by'],
      createdAt: DateTime.parse(json['created_at']),
      expiresAt:
          json['expires_at'] != null
              ? DateTime.parse(json['expires_at'])
              : null,
      // Extract user profile info directly
      firstName: json['user_profile']['first_name'],
      lastName: json['user_profile']['last_name'],
      email: json['user_profile']['contact_info']['email'],
      privacy: json['user_profile']['privacy'],
      profilePictureUrl: json['user_profile']['profile_picture_url'],
      coverPhotoUrl: json['user_profile']['cover_photo_url'],
      // Extract banner info
      bannerFirstName: json['banned_by_profile']['first_name'],
      bannerLastName: json['banned_by_profile']['last_name'],
    );
  }

  // Helper method to get full name
  String get fullName => '$firstName $lastName';

  // Helper method to get banner full name
  String get bannerFullName => '$bannerFirstName $bannerLastName';
}

