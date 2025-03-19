import 'package:equatable/equatable.dart';

class PostModel extends Equatable {
  final String id;
  final String title;
  final String description;
  final List<String> images;
  final bool useCarousel;
  final bool isSponsored;
  final String ownerName;
  final String ownerImageUrl;
  final String ownerOccupation;
  final String timePosted;
  final int likesCount;
  final int commentsCount;
  final int followers;
  final bool isLiked;
  final String currentReaction;
  final bool isRemoved; 
  final int initialLikes;
  
  const PostModel({
    required this.id,
    required this.title,
    required this.description,
    this.images = const [],
    this.useCarousel = false,
    this.isSponsored = false,
    required this.ownerName,
    required this.ownerImageUrl,
    this.ownerOccupation = '',
    required this.timePosted,
    int? initialLikes,
    int? likesCount,
    this.commentsCount = 0,
    this.followers = 0,
    this.isLiked = false,
    this.currentReaction = 'like',
    this.isRemoved = false,
  }) : 
    this.initialLikes = initialLikes ?? 0,
    this.likesCount = likesCount ?? initialLikes ?? 0;
  
  // Factory constructor to create a post with a manually specified ID
  factory PostModel.create({
    required String id,
    required String title,
    required String description,
    List<String> images = const [],
    bool useCarousel = false,
    bool isSponsored = false,
    required String ownerName,
    required String ownerImageUrl,
    String ownerOccupation = '',
    required String timePosted,
    int initialLikes = 0,
    int? likesCount,
    int commentsCount = 0,
    int followers = 0,
    bool isLiked = false,
    String currentReaction = 'like',
    bool isRemoved = false,
  }) {
    return PostModel(
      id: id,
      title: title,
      description: description,
      images: images,
      useCarousel: useCarousel,
      isSponsored: isSponsored,
      ownerName: ownerName,
      ownerImageUrl: ownerImageUrl,
      ownerOccupation: ownerOccupation,
      timePosted: timePosted,
      initialLikes: initialLikes,
      likesCount: likesCount ?? initialLikes,
      commentsCount: commentsCount,
      followers: followers,
      isLiked: isLiked,
      currentReaction: currentReaction,
      isRemoved: isRemoved,
    );
  }
  
  // CopyWith method for creating a new instance with some updated fields
  PostModel copyWith({
    String? id,
    String? title,
    String? description,
    List<String>? images,
    bool? useCarousel,
    bool? isSponsored,
    String? ownerName,
    String? ownerImageUrl,
    String? ownerOccupation,
    String? timePosted,
    int? likesCount,
    int? commentsCount,
    int? followers,
    bool? isLiked,
    String? currentReaction,
    bool? isRemoved,
    int? initialLikes,
  }) {
    return PostModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      images: images ?? this.images,
      useCarousel: useCarousel ?? this.useCarousel,
      isSponsored: isSponsored ?? this.isSponsored,
      ownerName: ownerName ?? this.ownerName,
      ownerImageUrl: ownerImageUrl ?? this.ownerImageUrl,
      ownerOccupation: ownerOccupation ?? this.ownerOccupation,
      timePosted: timePosted ?? this.timePosted,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      followers: followers ?? this.followers,
      isLiked: isLiked ?? this.isLiked,
      currentReaction: currentReaction ?? this.currentReaction,
      isRemoved: isRemoved ?? this.isRemoved,
      initialLikes: initialLikes ?? this.initialLikes,
    );
  }
  
  // Add a method to toggle like status
  PostModel toggleLike(String reaction) {
    final newIsLiked = !isLiked || currentReaction != reaction;
    final newLikesCount = newIsLiked 
        ? (isLiked ? likesCount : likesCount + 1) 
        : likesCount - 1;
    
    return copyWith(
      isLiked: newIsLiked,
      currentReaction: newIsLiked ? reaction : 'like',
      likesCount: newLikesCount,
    );
  }
  
  // Add a method to mark the post as removed
  PostModel markAsRemoved() {
    return copyWith(isRemoved: true);
  }
  
  // Add a method to restore a removed post
  PostModel restore() {
    return copyWith(isRemoved: false);
  }
  
  // Add a method to increment comments
  PostModel incrementComments() {
    return copyWith(commentsCount: commentsCount + 1);
  }
  
  @override
  List<Object?> get props => [
    id, title, description, images, useCarousel, isSponsored,
    ownerName, ownerImageUrl, ownerOccupation, timePosted,
    likesCount, commentsCount, followers, isLiked, currentReaction,
    isRemoved, initialLikes
  ];
}