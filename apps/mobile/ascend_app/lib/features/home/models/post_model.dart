import 'package:equatable/equatable.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/managers/post_manager.dart';
import 'package:flutter/material.dart';

// New class to represent reaction information
class ReactionInfo extends Equatable {
  final bool reacted;
  final String? reactionType;
  
  const ReactionInfo({
    this.reacted = false,
    this.reactionType,
  });
  
  @override
  List<Object?> get props => [reacted, reactionType];
  
  factory ReactionInfo.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const ReactionInfo();
    return ReactionInfo(
      reacted: json['reacted'] as bool? ?? false,
      reactionType: json['reactionType'] as String?,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'reacted': reacted,
      'reactionType': reactionType,
    };
  }
  
  // Helper to check if there's any reaction
  bool get hasReaction => reacted && reactionType != null;
}

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
  final ReactionInfo isLiked;
  final List<Comment> comments;
  final bool showFeedbackOptions;
  final bool isSaved; // Existing field
  final bool isShared; // Add new field to track shared status

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
    this.isLiked = const ReactionInfo(), // Default to no reaction
    this.comments = const [],
    this.showFeedbackOptions = false,
    this.isSaved = false, // Initialize with default value
    this.isShared = false, // Add to constructor with default value
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
    comments,
    showFeedbackOptions,
    isSaved,
    isShared, // Add to props
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
    ReactionInfo? isLiked,
    List<Comment>? comments,
    bool? showFeedbackOptions,
    bool? isSaved,
    bool? isShared, // Add to copyWith parameters
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
      comments: comments ?? this.comments,
      showFeedbackOptions: showFeedbackOptions ?? this.showFeedbackOptions,
      isSaved: isSaved ?? this.isSaved,
      isShared: isShared ?? this.isShared, // Add to copyWith logic
    );
  }

  // Updated to handle toggling same reaction correctly
  PostModel toggleReaction(String? reactionType) {
    // Get current reaction state
    final currentReactionType = isLiked?.reactionType;
    final hasReaction = isLiked?.reacted ?? false;
    
    // Debug the state change
    debugPrint('🔄 [PostModel] Toggle reaction on post $id: Current=$currentReactionType, New=$reactionType');
    
    if (reactionType == null) {
      // REMOVING reaction - explicitly set reacted to false and reactionType to null
      debugPrint('⛔ [PostModel] Removing reaction from post $id');
      return copyWith(
        isLiked: ReactionInfo(reacted: false, reactionType: null),
        likesCount: hasReaction ? likesCount - 1 : likesCount, // Decrease only if there was a reaction
      );
    } else {
      // ADDING or CHANGING reaction
      if (!hasReaction) {
        // Adding new reaction
        debugPrint('➕ [PostModel] Adding new reaction to post $id: $reactionType');
        return copyWith(
          isLiked: ReactionInfo(reacted: true, reactionType: reactionType),
          likesCount: likesCount + 1,
        );
      } else if (currentReactionType != reactionType) {
        // Changing reaction type (count stays the same)
        debugPrint('🔄 [PostModel] Changing reaction type on post $id: $currentReactionType -> $reactionType');
        return copyWith(
          isLiked: ReactionInfo(reacted: true, reactionType: reactionType),
        );
      } else {
        // Same reaction type - REMOVE THE REACTION instead of no change
        debugPrint('⛔ [PostModel] Removing reaction (same type clicked again) from post $id');
        return copyWith(
          isLiked: ReactionInfo(reacted: false, reactionType: null),
          likesCount: likesCount > 0 ? likesCount - 1 : 0, // Decrease count, prevent negative
        );
      }
    }
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
      'isLiked': isLiked.toJson(),
      'comments': comments.map((comment) => comment.toJson()).toList(),
      'showFeedbackOptions': showFeedbackOptions,
      'isSaved': isSaved,
      'isShared': isShared, // Add to toJson
    };
  }

  // Updated factory constructor
  factory PostModel.fromJson(Map<String, dynamic> json) {
    // Ensure userId is handled correctly, converting if necessary
    final userIdValue = json['user_id'] ?? json['userId']; // Check both keys
    final userIdString =
        userIdValue?.toString() ??
        'unknown_user'; // Convert to string, provide default

    // Parse isLiked as an object instead of a boolean
    final isLikedData = json['isLiked'];
    final ReactionInfo isLiked = isLikedData is Map<String, dynamic> 
        ? ReactionInfo.fromJson(isLikedData)
        : ReactionInfo(reacted: json['isLiked'] as bool? ?? false);

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
      isLiked: isLiked,
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
      isSaved: json['isSaved'] as bool? ?? json['is_saved'] as bool? ?? false, // Check both formats
      isShared: json['isShared'] as bool? ?? json['is_shared'] as bool? ?? false, // Add isShared with both formats
    );
  }

  // Updated fromLegacyModel
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
      isSaved: false,
      isShared: false, // Add default value
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
      isLiked: const ReactionInfo(),
      comments: [],
      images: [],
      isSaved: false,
      isShared: false, // Add default value
    );
  }

  // Update the fromApiResponse constructor to properly extract metadata flags
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

      // Extract saved and shared flags
      final bool isSaved = apiPost['is_saved'] as bool? ?? false;
      final bool isShared = apiPost['is_shared'] as bool? ?? false;

      // Parse the isLiked object structure from API
      final isLikedData = apiPost['isLiked'] ?? apiPost['is_liked'];
      final ReactionInfo reactionInfo = isLikedData is Map<String, dynamic>
          ? ReactionInfo.fromJson(isLikedData)
          : ReactionInfo(reacted: apiPost['is_liked'] as bool? ?? false);

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
        
        // Reaction info
        isLiked: reactionInfo, // Use the ReactionInfo object
        
        comments: [],
        isSponsored: false,
        isSaved: isSaved,
        isShared: isShared,
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
