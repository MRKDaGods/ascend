class PostModel {
  final String title;
  final String description;
  final List<String> images;
  final bool isSponsored;
  final bool useCarousel;
  final String ownerName;
  final String ownerImageUrl;
  final String timePosted;
  final int initialLikes;
  final int initialComments;

  PostModel({
    this.title = '',
    this.description = '',
    this.images = const [],
    this.isSponsored = false,
    this.useCarousel = false,
    this.ownerName = 'Anonymous User',
    this.ownerImageUrl = 'assets/logo.jpg',
    this.timePosted = '2h ago',
    this.initialLikes = 0,
    this.initialComments = 0,
  });
}