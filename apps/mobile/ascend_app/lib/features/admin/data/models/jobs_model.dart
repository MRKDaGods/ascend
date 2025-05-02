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
    required this.companyLogoUrl,
    required this.createdAt,
  });

  factory ReportedJob.fromJson(Map<String, dynamic> json) {
    return ReportedJob(
      jobId: json['job_id'],
      title: json['title'],
      description: json['description'],
      industry: json['industry'],
      type: json['type'],
      experienceLevel: json['experience_level'],
      location: json['location'],
      workplaceType: json['workplace_type'],
      salaryMinRange: json['salary_min_range'],
      salaryMaxRange: json['salary_max_range'],
      companyId: json['company_id'],
      companyName: json['company_name'],
      companyLogoUrl: json['company_logo_url'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class JobReport {
  final int id;
  final int reporterId;
  final String reporterFullName;
  final String? reporterProfilePicture;
  final String reason;
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
  });

  factory JobReport.fromJson(Map<String, dynamic> json) {
    return JobReport(
      id: json['id'],
      reporterId: json['reporter_id'],
      reporterFullName: json['reporter_full_name'],
      reporterProfilePicture: json['reporter_profile_picture'],
      reason: json['reason'],
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
