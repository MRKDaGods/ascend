import 'package:equatable/equatable.dart';

import 'post_model.dart';

class Comment extends Equatable {
  final String id;
  final String text;
  final String authorId; // Add this field to identify the author
  final String authorName;
  final String authorImageUrl;
  final String authorOccupation;
  final String timePosted;
  final int likesCount;
  final bool isLiked;
  final String? currentReaction;
  final List<Comment> replies;
  final String? parentId;

  const Comment({
    required this.id,
    required this.text,
    required this.authorId,
    required this.authorName,
    required this.authorImageUrl,
    this.authorOccupation = '',
    required this.timePosted,
    this.likesCount = 0,
    this.isLiked = false,
    this.currentReaction,
    this.replies = const [],
    this.parentId,
  });

  // Factory method for creating a new comment with current user info
  factory Comment.create({
    required String text,
    required String authorId,
    required String authorName,
    required String authorImageUrl, // Keep this required
    String authorOccupation = '',
    String? parentId,
  }) {
    // Ensure a valid image URL is used, falling back to a default asset
    final validAuthorImageUrl = (authorImageUrl.isNotEmpty)
        ? authorImageUrl
        : 'assets/images/profile/EmptyUser.png'; // Use a known valid asset

    return Comment(
      id: 'comment_${DateTime.now().millisecondsSinceEpoch}',
      text: text,
      authorId: authorId,
      authorName: authorName,
      authorImageUrl: validAuthorImageUrl, // Use the validated URL
      authorOccupation: authorOccupation,
      timePosted: 'Just now',
      likesCount: 0,
      isLiked: false,
      currentReaction: null,
      replies: [],
      parentId: parentId,
    );
  }

  @override
  List<Object?> get props => [
        id,
        text,
        authorId,
        authorName,
        authorImageUrl,
        authorOccupation,
        timePosted,
        likesCount,
        isLiked,
        currentReaction,
        replies,
        parentId,
      ];

  // Add copyWith method
  Comment copyWith({
    String? id,
    String? text,
    String? authorId,
    String? authorName,
    String? authorImageUrl,
    String? authorOccupation,
    String? timePosted,
    int? likesCount,
    bool? isLiked,
    String? currentReaction,
    List<Comment>? replies,
    String? parentId,
  }) {
    return Comment(
      id: id ?? this.id,
      text: text ?? this.text,
      authorId: authorId ?? this.authorId,
      authorName: authorName ?? this.authorName,
      authorImageUrl: authorImageUrl ?? this.authorImageUrl,
      authorOccupation: authorOccupation ?? this.authorOccupation,
      timePosted: timePosted ?? this.timePosted,
      likesCount: likesCount ?? this.likesCount,
      isLiked: isLiked ?? this.isLiked,
      currentReaction: currentReaction ?? this.currentReaction,
      replies: replies ?? this.replies,
      parentId: parentId ?? this.parentId,
    );
  }

  // Helper method to add a new reply
  Comment copyWithNewReply(Comment reply) {
    final updatedReplies = [...replies, reply];
    return copyWith(replies: updatedReplies);
  }

  // Helper to toggle reaction
  Comment toggleReaction(String? reactionType) {
    if (isLiked && reactionType == currentReaction) {
      // Remove reaction
      return copyWith(
        isLiked: false,
        currentReaction: null,
        likesCount: likesCount > 0 ? likesCount - 1 : 0,
      );
    } else {
      // Add or change reaction
      final newLikesCount = !isLiked ? likesCount + 1 : likesCount;
      return copyWith(
        isLiked: true,
        currentReaction: reactionType,
        likesCount: newLikesCount,
      );
    }
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'authorId': authorId,
      'authorName': authorName,
      'authorImageUrl': authorImageUrl,
      'authorOccupation': authorOccupation,
      'timePosted': timePosted,
      'likesCount': likesCount,
      'isLiked': isLiked,
      'currentReaction': currentReaction,
      'parentId': parentId,
      'replies': replies.map((reply) => reply.toJson()).toList(),
    };
  }

  // Create from JSON
  factory Comment.fromJson(Map<String, dynamic> json) {
    // Handle potential user data structure within the comment JSON if needed
    final userData = json['user'] as Map<String, dynamic>?; // Example if user data is nested
    final authorName = userData != null
        ? '${userData['first_name'] ?? ''} ${userData['last_name'] ?? ''}'.trim()
        : json['authorName'] as String? ?? 'Unknown User'; // Fallback to existing field or default
    final authorImageUrl = userData != null
        ? userData['profile_picture_url'] as String? ?? 'assets/images/profile/EmptyUser.png' // Default from user data
        : json['authorImageUrl'] as String? ?? 'assets/images/profile/EmptyUser.png'; // Default from comment data

    return Comment(
      id: (json['id'] ?? 'temp_${DateTime.now().millisecondsSinceEpoch}').toString(), // Ensure ID is string
      text: json['content'] as String? ?? json['text'] as String? ?? '', // Check for 'content' field from API
      authorId: (json['user_id'] ?? json['authorId'] ?? 'unknown').toString(), // Check for 'user_id'
      authorName: authorName,
      authorImageUrl: authorImageUrl.isNotEmpty ? authorImageUrl : 'assets/images/profile/EmptyUser.png', // Final fallback
      authorOccupation: json['authorOccupation'] as String? ?? '',
      timePosted: json['created_at'] != null ? PostModel.formatTimeAgo(DateTime.parse(json['created_at'])) : json['timePosted'] as String? ?? 'Just now', // Use public static method
      likesCount: json['likes_count'] as int? ?? json['likesCount'] as int? ?? 0, // Check for 'likes_count'
      isLiked: json['isLiked'] as bool? ?? false,
      currentReaction: json['currentReaction'] as String?,
      parentId: json['parent_id']?.toString() ?? json['parentId'] as String?, // Check for 'parent_id'
      replies: json['replies'] != null
          ? List<Comment>.from(
              (json['replies'] as List).map(
                (reply) => Comment.fromJson(reply as Map<String, dynamic>),
              ),
            )
          : const [],
    );
  }
}

// Add these extension getters
extension CommentHelpers on Comment {
  String get authorImage => authorImageUrl;
  String? get reaction => currentReaction;
  int get likes => likesCount;
}