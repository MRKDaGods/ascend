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

    this.jobID,
    this.industry,
    this.contract = false, // Indicates if job is contract
    this.internship = false, // Indicates if job is internship
    this.volunteer = false, // Indicates if job is volunteer
    this.isPartTime, // Indicates if job is part-time
    this.fullTime = false, // Indicates if job is full-time
    this.isRemote, // Indicates if job is remote
    this.isHybrid, // Indicates if job is hybrid
    this.isConstruction, // Indicates if job is in construction
    this.isEducation, // Indicates if job is in education
    this.isSmallBusiness, // Indicates if job is in small business
    this.companyPhoto,
    this.isBookmarked = false,
    this.jobDescription,
    this.applied = false,
    this.applicationStatus = "", // Default status
    this.alumniCount = 0,
    this.isPromoted = false,
    this.viewed = false,
    this.applicationForm,
    this.type,
    this.workplaceType,
  });
  final String? workplaceType; // Type of workplace (e.g., Remote, Hybrid)
  final String? type; // Type of job (e.g., Full Time, Part Time)
  final bool fullTime; // Indicates if job is full-time
  final bool contract; // Indicates if job is contract
  final bool internship; // Indicates if job is internship
  final bool volunteer; // Indicates if job is volunteer
  final String? industry; // Industry of the company
  final int? jobID; // Unique identifier for the job
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
    bool remote = false;
    bool hybrid = false;
    bool fullTime = false;
    bool partTime = false;
    bool internship = false;
    bool contract = false;
    bool volunteer = false;
    if (json['type'] == "Full-Time") {
      fullTime = true;
    } else if (json['type'] == "Part-time") {
      partTime = true;
    } else if (json['type'] == "Internship") {
      internship = true;
    } else if (json['type'] == "Contract") {
      contract = true;
    } else if (json['type'] == "Volunteer") {
      volunteer = true;
    }
    if (json['workplace_type'] == "Remote") {
      remote = true;
    } else if (json['workplace_type'] == "Hybrid") {
      hybrid = true;
    }
    return Jobsattributes(
      title: json['title'] as String? ?? 'Unknown Title',
      company: json['company_name'] as String? ?? 'Unknown Company',
      location: json['location'] as String? ?? 'Unknown Location',
      experienceLevel: json['experience_level'] as String? ?? 'Unknown Level',
      salaryMinRange: json['salary_min_range'] as int? ?? 0,
      easyapply: json['easyapply'] as bool? ?? true,
      salaryMaxRange:
          (json['salary_max_range'] is int)
              ? json['salary_max_range'] as int
              : (json['salary_max_range'] == 'infinity'
                  ? double.maxFinite.toInt()
                  : 9223372036854775807),
      jobDescription: json['description'] as String? ?? 'No Description',
      isPartTime: json['is_part_tixzce'] as bool? ?? partTime,
      isRemote: json['is_remote'] as bool? ?? remote,
      isHybrid: json['is_hybrid'] as bool? ?? hybrid,
      isConstruction: json['is_construction'] as bool? ?? false,
      isEducation: json['is_education'] as bool? ?? false,
      isSmallBusiness: json['is_small_business'] as bool? ?? false,
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      jobID: json['job_id'] as int?,
      industry: json['industry'] as String? ?? 'Unknown Industry',
      fullTime: json['is_full_time'] as bool? ?? fullTime,
      contract: json['is_contract'] as bool? ?? contract,
      internship: json['is_internship'] as bool? ?? internship,
      volunteer: json['is_volunteer'] as bool? ?? volunteer,
      type: json['type'] as String? ?? 'Unknown Type',
      workplaceType: json['workplace_type'] as String? ?? 'Unknown Workplace',
    );
  }
}
