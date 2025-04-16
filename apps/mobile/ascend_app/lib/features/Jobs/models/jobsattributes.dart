class Jobsattributes {
  Jobsattributes({
    required this.title,
    required this.company,
    required this.location,
    required this.experienceLevel,
    required this.salary,
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
    this.timePosted = "1 day ago", // Default time posted
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
  final int salary; // Salary in USD
  bool isBookmarked; // Track if user has bookmarked job
  final String? jobDescription; // Detailed job description
  bool applied; // Track if user has applied to job
  String applicationStatus; // Track application status (Pending, Viewed, etc.)
  int alumniCount; // Number of alumni working at the company
  String timePosted; // Time since job was posted
  bool isPromoted; // Promoted jobs are displayed at the top of the list
  final bool easyapply; // Indicates if job supports easy apply
  bool viewed; // Track if job has been viewed
  final String? applicationForm; // URL for application form

  DateTime? get timePostedDate {
    try {
      final parts = timePosted.split(' ');
      if (parts.length == 3) {
        final value = int.parse(parts[0]);
        final unit = parts[1].toLowerCase();

        switch (unit) {
          case 'minute':
          case 'minutes':
            return DateTime.now().subtract(Duration(minutes: value));
          case 'hour':
          case 'hours':
            return DateTime.now().subtract(Duration(hours: value));
          case 'day':
          case 'days':
            return DateTime.now().subtract(Duration(days: value));
          case 'week':
          case 'weeks':
            return DateTime.now().subtract(Duration(days: value * 7));
          case 'month':
          case 'months':
            return DateTime.now().subtract(Duration(days: value * 30));
          default:
            return null;
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  }
}
