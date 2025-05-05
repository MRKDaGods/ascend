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
  final DateTime joinedAt;

  ReportedUser({
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.joinedAt,
    this.profilePictureUrl,
  });

  factory ReportedUser.fromJson(Map<String, dynamic> json) {
    return ReportedUser(
      userId: json['user_id'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      email: json['contact_info']['email'],
      profilePictureUrl: json['profile_picture_url'],
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
