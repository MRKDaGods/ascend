class PostModel {
  final String title;
  final String description;
  final List<String> images;
  final bool isSponsored;
  final bool useCarousel;

  PostModel({
    required this.title,
    required this.description,
    this.images = const [],
    this.isSponsored = false,
    this.useCarousel = false,
  });
}