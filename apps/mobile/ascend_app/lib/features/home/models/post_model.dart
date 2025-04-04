import 'package:equatable/equatable.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/managers/post_manager.dart';

// Renamed from Post to PostModel for consistency
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
  final String? currentReaction;
  final List<Comment> comments;
  final bool showFeedbackOptions;

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
    this.likesCount = 0,
    this.commentsCount = 0,
    this.followers = 0,
    this.isLiked = false,
    this.currentReaction,
    this.comments = const [],
    this.showFeedbackOptions = false,
  });

  @override
  List<Object?> get props => [
    id,
    title,
    description,
    images,
    useCarousel,
    isSponsored,
    ownerName,
    ownerImageUrl,
    ownerOccupation,
    timePosted,
    likesCount,
    commentsCount,
    followers,
    isLiked,
    currentReaction,
    comments,
    showFeedbackOptions,
  ];

  // Updated to return PostModel
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
    List<Comment>? comments,
    bool? showFeedbackOptions,
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
      comments: comments ?? this.comments,
      showFeedbackOptions: showFeedbackOptions ?? this.showFeedbackOptions,
    );
  }
  
  // Updated to return PostModel
  PostModel toggleReaction(String? reactionType) {
    return PostManager.toggleReaction(this, reactionType);
  }

  // Updated to return PostModel
  PostModel addComment(Comment comment) {
    return PostManager.addComment(this, comment);
  }

  // Updated to return PostModel
  PostModel toggleCommentReaction(String commentId, String? reactionType) {
    return PostManager.toggleCommentReaction(this, commentId, reactionType);
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'images': images,
      'useCarousel': useCarousel,
      'isSponsored': isSponsored,
      'ownerName': ownerName,
      'ownerImageUrl': ownerImageUrl,
      'ownerOccupation': ownerOccupation,
      'timePosted': timePosted,
      'likesCount': likesCount,
      'commentsCount': commentsCount,
      'followers': followers,
      'isLiked': isLiked,
      'currentReaction': currentReaction,
      'comments': comments.map((comment) => comment.toJson()).toList(),
      'showFeedbackOptions': showFeedbackOptions,
    };
  }

  // Updated factory constructor
  factory PostModel.fromJson(Map<String, dynamic> json) {
    return PostModel(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      images: List<String>.from(json['images'] as List),
      useCarousel: json['useCarousel'] as bool? ?? false,
      isSponsored: json['isSponsored'] as bool? ?? false,
      ownerName: json['ownerName'] as String,
      ownerImageUrl: json['ownerImageUrl'] as String,
      ownerOccupation: json['ownerOccupation'] as String? ?? '',
      timePosted: json['timePosted'] as String,
      likesCount: json['likesCount'] as int? ?? 0,
      commentsCount: json['commentsCount'] as int? ?? 0,
      followers: json['followers'] as int? ?? 0,
      isLiked: json['isLiked'] as bool? ?? false,
      currentReaction: json['currentReaction'] as String?,
      comments: json['comments'] != null 
          ? List<Comment>.from(
              (json['comments'] as List).map(
                (comment) => Comment.fromJson(comment as Map<String, dynamic>),
              ),
            )
          : const [],
      showFeedbackOptions: json['showFeedbackOptions'] as bool? ?? false,
    );
  }
  
  // Updated factory constructor
  factory PostModel.fromLegacyModel(Map<String, dynamic> oldModel) {
    return PostModel(
      id: oldModel['id'] ?? 'post_${DateTime.now().millisecondsSinceEpoch}',
      title: oldModel['title'] ?? '',
      description: oldModel['description'] ?? '',
      images: oldModel['images'] != null ? List<String>.from(oldModel['images']) : const [],
      useCarousel: oldModel['useCarousel'] ?? false,
      isSponsored: oldModel['isSponsored'] ?? false,
      ownerName: oldModel['ownerName'] ?? '',
      ownerImageUrl: oldModel['ownerImageUrl'] ?? '',
      ownerOccupation: oldModel['ownerOccupation'] ?? '',
      timePosted: oldModel['timePosted'] ?? 'Just now',
      likesCount: oldModel['initialLikes'] ?? oldModel['likesCount'] ?? 0,
      commentsCount: oldModel['initialComments'] ?? oldModel['commentsCount'] ?? 0,
      followers: oldModel['followers'] ?? 0,
      isLiked: oldModel['isLiked'] ?? false,
      comments: const [],
      showFeedbackOptions: oldModel['showFeedbackOptions'] ?? false,
    );
  }

  // Added factory constructor
  factory PostModel.empty() {
    return PostModel(
      id: '',
      title: '',
      description: '',
      ownerName: '',
      ownerImageUrl: '',
      ownerOccupation: '',
      timePosted: '',
      likesCount: 0,
      commentsCount: 0,
      followers: 0,
      isLiked: false,
      comments: [],
      images: [],
    );
  }
}

// Remove the type alias since the class is now directly named PostModel
// typedef PostModel = Post;  <-- Remove this line