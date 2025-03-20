class Jobsattributes {
  Jobsattributes({
    required this.title,
    required this.company,
    this.companyPhoto,
    required this.location,
    this.isBookmarked = false,
  });

  final String title;
  final String company;
  final String? companyPhoto;
  final String location;
  bool isBookmarked;
}
