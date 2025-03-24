class Jobsattributes {
  Jobsattributes({
    required this.title,
    required this.company,
    this.companyPhoto,
    required this.location,
    required this.experienceLevel,
    required this.salaryRange,
    this.isBookmarked = false,
    this.jobDescription,
    this.applied = false,
    this.applicationStatus = "Pending", // Default status
    this.alumniCount = 0,
    this.timePosted = "1 day ago", // Default time posted
    this.isPromoted = false,
    required this.easyapply,
    this.viewed = false,
  });

  final String title;
  final String company;
  final String? companyPhoto;
  final String location;
  final String experienceLevel; // Example: "Entry", "Mid", "Senior"
  final int salaryRange;
  bool isBookmarked;
  final String? jobDescription;
  bool applied;
  String applicationStatus; // Track application status (Pending, Viewed, etc.)
  int alumniCount; // Number of alumni working at the company
  String timePosted; // Time since job was posted
  bool isPromoted; // Promoted jobs are displayed at the top of the list
  final bool easyapply; // Indicates if job supports easy apply
  bool viewed; // Track if job has been viewed
}
