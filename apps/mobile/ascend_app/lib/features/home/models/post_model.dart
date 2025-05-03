import 'package:equatable/equatable.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/managers/post_manager.dart';
import 'package:flutter/material.dart';

// Renamed from Post to PostModel for consistency
class PostModel extends Equatable {
  final String id;
  final String userId; // Add userId field
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
  final int sharedCount;
  final int followers;
  final bool isLiked;
  final String? currentReaction;
  final List<Comment> comments;
  final bool showFeedbackOptions;
  final bool isSaved; // Add this field

  const PostModel({
    required this.id,
    required this.userId, // Add to constructor
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
    this.sharedCount = 0,
    this.followers = 0,
    this.isLiked = false,
    this.currentReaction,
    this.comments = const [],
    this.showFeedbackOptions = false,
    this.isSaved = false, // Initialize with default value
  });

  @override
  List<Object?> get props => [
    id,
    userId, // Add to props
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
    sharedCount,
    followers,
    isLiked,
    currentReaction,
    comments,
    showFeedbackOptions,
    isSaved, // Add to props
  ];

  // Updated to return PostModel
  PostModel copyWith({
    String? id,
    String? userId, // Add userId parameter
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
    int? sharedCount,
    int? followers,
    bool? isLiked,
    String? currentReaction,
    List<Comment>? comments,
    bool? showFeedbackOptions,
    bool? isSaved, // Add to copyWith parameters
  }) {
    return PostModel(
      id: id ?? this.id,
      userId: userId ?? this.userId, // Add to copyWith logic
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
      sharedCount: sharedCount ?? this.sharedCount,
      followers: followers ?? this.followers,
      isLiked: isLiked ?? this.isLiked,
      currentReaction: currentReaction ?? this.currentReaction,
      comments: comments ?? this.comments,
      showFeedbackOptions: showFeedbackOptions ?? this.showFeedbackOptions,
      isSaved: isSaved ?? this.isSaved, // Add to copyWith logic
    );
  }

  // Updated to return PostModel
  PostModel toggleReaction(String? reactionType) {
    // If removing reaction (reactionType is null)
    if (reactionType == null) {
      // If currently liked, decrement like count
      final newLikesCount = isLiked ? likesCount - 1 : likesCount;
      return copyWith(
        isLiked: false,
        currentReaction: null,
        likesCount: newLikesCount,
      );
    }

    // If adding or changing reaction
    final newLikesCount = isLiked ? likesCount : likesCount + 1;
    return copyWith(
      isLiked: true,
      currentReaction: reactionType,
      likesCount: newLikesCount,
    );
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
      'user_id': userId, // Add to toJson, matching API key
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
      'shares_count': sharedCount, // Change to match API naming convention
      'followers': followers,
      'isLiked': isLiked,
      'currentReaction': currentReaction,
      'comments': comments.map((comment) => comment.toJson()).toList(),
      'showFeedbackOptions': showFeedbackOptions,
      'isSaved': isSaved, // Add to toJson
    };
  }

  // Updated factory constructor
  factory PostModel.fromJson(Map<String, dynamic> json) {
    // Ensure userId is handled correctly, converting if necessary
    final userIdValue = json['user_id'] ?? json['userId']; // Check both keys
    final userIdString =
        userIdValue?.toString() ??
        'unknown_user'; // Convert to string, provide default

    return PostModel(
      id: (json['id'] ?? '').toString(), // Ensure id is string
      userId: userIdString, // Use the processed userId
      title: json['title'] as String? ?? '', // Handle potential null title
      description: json['description'] as String? ?? '',
      images: List<String>.from(json['images'] as List),
      useCarousel: json['useCarousel'] as bool? ?? false,
      isSponsored: json['isSponsored'] as bool? ?? false,
      ownerName: json['ownerName'] as String,
      ownerImageUrl: json['ownerImageUrl'] as String,
      ownerOccupation: json['ownerOccupation'] as String? ?? '',
      timePosted: json['timePosted'] as String,
      likesCount: json['likesCount'] as int? ?? 0,
      commentsCount: json['commentsCount'] as int? ?? 0,
      sharedCount: json['sharedCount'] as int? ?? 0,
      followers: json['followers'] as int? ?? 0,
      isLiked: json['isLiked'] as bool? ?? false,
      currentReaction: json['currentReaction'] as String?,
      comments:
          json['comments'] != null
              ? List<Comment>.from(
                (json['comments'] as List).map(
                  (comment) =>
                      Comment.fromJson(comment as Map<String, dynamic>),
                ),
              )
              : const [],
      showFeedbackOptions: json['showFeedbackOptions'] as bool? ?? false,
      isSaved: json['isSaved'] as bool? ?? false, // Add fromJson logic
    );
  }

  // Updated factory constructor
  factory PostModel.fromLegacyModel(Map<String, dynamic> oldModel) {
    return PostModel(
      id: oldModel['id'] ?? 'post_${DateTime.now().millisecondsSinceEpoch}',
      userId:
          oldModel['userId']?.toString() ??
          'legacy_user', // Add default userId, ensure string
      title: oldModel['title'] ?? '',
      description: oldModel['description'] ?? '',
      images:
          oldModel['images'] != null
              ? List<String>.from(oldModel['images'])
              : const [],
      useCarousel: oldModel['useCarousel'] ?? false,
      isSponsored: oldModel['isSponsored'] ?? false,
      ownerName: oldModel['ownerName'] ?? '',
      ownerImageUrl: oldModel['ownerImageUrl'] ?? '',
      ownerOccupation: oldModel['ownerOccupation'] ?? '',
      timePosted: oldModel['timePosted'] ?? 'Just now',
      likesCount: oldModel['initialLikes'] ?? oldModel['likesCount'] ?? 0,
      commentsCount:
          oldModel['initialComments'] ?? oldModel['commentsCount'] ?? 0,
      sharedCount: oldModel['sharedCount'] ?? 0,
      followers: oldModel['followers'] ?? 0,
      isLiked: oldModel['isLiked'] ?? false,
      comments: const [],
      showFeedbackOptions: oldModel['showFeedbackOptions'] ?? false,
      isSaved: false, // Add default value
    );
  }

  // Added factory constructor
  factory PostModel.empty() {
    return PostModel(
      id: '',
      userId: '', // Add default userId
      title: '',
      description: '',
      ownerName: '',
      ownerImageUrl: '',
      ownerOccupation: '',
      timePosted: '',
      likesCount: 0,
      commentsCount: 0,
      sharedCount: 0,
      followers: 0,
      isLiked: false,
      comments: [],
      images: [],
      isSaved: false, // Add default value
    );
  }

  // Add this factory constructor to your PostModel class
  factory PostModel.fromApiResponse(Map<String, dynamic> apiPost) {
    try {
      // Debug what we're receiving
      debugPrint('Processing API post: ${apiPost['id']}');

      // Extract user data
      final userData = apiPost['user'] as Map<String, dynamic>? ?? {};

      // Extract userId directly from the post object or user object
      final userIdValue = apiPost['user_id'] ?? userData['id'];
      final userIdString =
          userIdValue?.toString() ?? 'unknown_user'; // Fallback

      // Combine first and last name
      final firstName = userData['first_name'] as String? ?? '';
      final lastName = userData['last_name'] as String? ?? '';
      final fullName = '$firstName $lastName'.trim();

      // Extract media URLs from complex media objects
      final mediaList = apiPost['media'] as List<dynamic>? ?? [];
      final imageUrls =
          mediaList
              .where(
                (media) => media['type'] == 'image' && media['url'] != null,
              )
              .map((media) => media['url'] as String)
              .toList();

      // Format the timestamp
      final createdAt =
          apiPost['created_at'] != null
              ? DateTime.parse(apiPost['created_at'] as String)
              : DateTime.now();
      final timeAgo = formatTimeAgo(createdAt);

      // Extract profile picture URL, provide a valid default if missing
      final profilePicUrl = userData['profile_picture_url'] as String?;
      final ownerImageUrl =
          (profilePicUrl != null && profilePicUrl.isNotEmpty)
              ? profilePicUrl
              : 'assets/images/profile/EmptyUser.png'; // Use a known valid asset

      return PostModel(
        // Convert numeric ID to string
        id: (apiPost['id'] ?? '').toString(),
        userId: userIdString, // Use the extracted userId
        // Set title empty and use content for description
        title: '',
        description: apiPost['content'] as String? ?? '',

        // Media handling
        images: imageUrls,
        useCarousel: imageUrls.length > 1,

        // User information
        ownerName:
            fullName.isNotEmpty ? fullName : 'Ascend User', // Fallback name
        ownerImageUrl: ownerImageUrl, // Use the determined image URL
        ownerOccupation: 'User', // Not provided by API
        // Time posted
        timePosted: timeAgo,

        // Engagement metrics from API
        likesCount: apiPost['likes_count'] as int? ?? 0,
        commentsCount: apiPost['comments_count'] as int? ?? 0,
        sharedCount:
            apiPost['shares_count'] as int? ??
            0, // Make sure to use the correct API field
        followers: 0, // Not provided by API
        // Default values for fields not in API
        isLiked: false,
        currentReaction: null,
        comments: [],
        isSponsored: false,
        isSaved:
            apiPost['is_saved'] as bool? ??
            false, // Assuming API provides 'is_saved'
      );
    } catch (e) {
      debugPrint('Error creating PostModel from API data: $e');
      debugPrint('API post data: $apiPost');
      rethrow;
    }
  }

  // Helper method to format timestamps - Made public static
  static String formatTimeAgo(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 365) {
      return '${(difference.inDays / 365).floor()}y ago';
    } else if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()}m ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  // Add this method to parse a list of API posts
  static List<PostModel> fromApiResponseList(List<dynamic> apiPosts) {
    return apiPosts
        .map((post) => PostModel.fromApiResponse(post as Map<String, dynamic>))
        .toList();
  }
}

// Remove the type alias since the class is now directly named PostModel
// typedef PostModel = Post;  <-- Remove this line
