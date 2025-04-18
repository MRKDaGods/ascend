class Jobsattributes {
  Jobsattributes({
    required this.title,
    required this.company,
    required this.location,
    required this.experienceLevel,
    required this.salaryMinRange,
    required this.salaryMaxRange,
    required this.createdAt, // Date the job was created
    required this.easyapply,

    this.isPartTime, // Indicates if job is part-time
    this.isRemote, // Indicates if job is remote
    this.isHybrid, // Indicates if job is hybrid
    this.isConstruction, // Indicates if job is in construction
    this.isEducation, // Indicates if job is in education
    this.isSmallBusiness, // Indicates if job is in small business
    this.companyPhoto,
    this.isBookmarked = false,
    this.jobDescription,
    this.applied = false,
    this.applicationStatus = "Pending", // Default status
    this.alumniCount = 0,
    this.isPromoted = false,
    this.viewed = false,
    this.applicationForm,
  });

  final bool? isHybrid; // Indicates if job is hybrid
  final bool? isConstruction; // Indicates if job is in construction
  final bool? isEducation; // Indicates if job is in education
  final bool? isSmallBusiness; // Indicates if job is in small business
  final bool? isPartTime; // Indicates if job is part-time
  final bool? isRemote; // Indicates if job is remote
  final String title; // Job title
  final String company; // Company name
  final String? companyPhoto; // URL for company logo
  final String location; // Example: "San Francisco, CA"
  final String experienceLevel; // Example: "Entry", "Mid", "Senior"
  final int salaryMinRange; // Salary in USD
  final int salaryMaxRange; // Salary in USD
  bool isBookmarked; // Track if user has bookmarked job
  final String? jobDescription; // Detailed job description
  bool applied; // Track if user has applied to job
  String applicationStatus; // Track application status (Pending, Viewed, etc.)
  int alumniCount; // Number of alumni working at the company
  bool isPromoted; // Promoted jobs are displayed at the top of the list
  final bool easyapply; // Indicates if job supports easy apply
  bool viewed; // Track if job has been viewed
  final String? applicationForm; // URL for application form
  final DateTime createdAt; // Date the job was created

  factory Jobsattributes.fromJson(Map<String, dynamic> json) {
    return Jobsattributes(
      title: json['title'] as String? ?? 'Unknown Title',
      company: json['company_name'] as String? ?? 'Unknown Company',
      location: json['location'] as String? ?? 'Unknown Location',
      experienceLevel: json['experience_level'] as String? ?? 'Unknown Level',
      salaryMinRange: json['salary_min_range'] as int? ?? 0,
      salaryMaxRange:
          json['salary_max_range'] as int? ?? double.infinity.toInt(),
      easyapply: json['easyapply'] as bool? ?? true,
      jobDescription: json['description'] as String? ?? 'No Description',
      isPartTime: json['is_part_time'] as bool? ?? false,
      isRemote: json['is_remote'] as bool? ?? false,
      isHybrid: json['is_hybrid'] as bool? ?? false,
      isConstruction: json['is_construction'] as bool? ?? false,
      isEducation: json['is_education'] as bool? ?? false,
      isSmallBusiness: json['is_small_business'] as bool? ?? false,
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
    );
  }
}
