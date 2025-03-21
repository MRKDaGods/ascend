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
}
