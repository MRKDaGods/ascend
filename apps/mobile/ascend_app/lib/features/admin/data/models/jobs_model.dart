class ReportedJob {
  final int jobId;
  final String title;
  final String description;
  final String industry;
  final String type;
  final String experienceLevel;
  final String location;
  final String workplaceType;
  final int salaryMinRange;
  final int salaryMaxRange;
  final int companyId;
  final String companyName;
  final String? companyLogoUrl;
  final DateTime createdAt;

  ReportedJob({
    required this.jobId,
    required this.title,
    required this.description,
    required this.industry,
    required this.type,
    required this.experienceLevel,
    required this.location,
    required this.workplaceType,
    required this.salaryMinRange,
    required this.salaryMaxRange,
    required this.companyId,
    required this.companyName,
    this.companyLogoUrl,
    required this.createdAt,
  });

  factory ReportedJob.fromJson(Map<String, dynamic> json) {
    return ReportedJob(
      jobId: json['job_id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      industry: json['industry'] ?? '',
      type: json['type'] ?? '',
      experienceLevel: json['experience_level'] ?? '',
      location: json['location'] ?? '',
      workplaceType: json['workplace_type'] ?? '',
      salaryMinRange: json['salary_min_range'] ?? 0,
      salaryMaxRange: json['salary_max_range'] ?? 0,
      companyId: json['company_id'] ?? 0,
      companyName: json['company_name'] ?? '',
      companyLogoUrl: json['company_logo_url'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
    );
  }
}

class JobReport {
  final int id;
  final int reporterId;
  final String reporterFullName;
  final String? reporterProfilePicture;
  final String reason;
  int totalRecords;
  String status;
  final DateTime createdAt;

  JobReport({
    required this.id,
    required this.reporterId,
    required this.reporterFullName,
    this.reporterProfilePicture,
    required this.reason,
    required this.status,
    required this.createdAt,
    this.totalRecords = 0,
  });

  factory JobReport.fromJson(Map<String, dynamic> json) {
    return JobReport(
      id: json['id'] ?? 0,
      reporterId: json['reporter_id'] ?? 0,
      reporterFullName: json['reporter_full_name'] ?? '',
      reporterProfilePicture: json['reporter_profile_picture'],
      reason: json['reason'] ?? '',
      status: json['status'] ?? '',
      totalRecords: json['total_records'] ?? 0,
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
    );
  }
}
