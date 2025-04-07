import 'package:equatable/equatable.dart';

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
    required String authorImageUrl,
    String authorOccupation = '',
    String? parentId,
  }) {
    return Comment(
      id: 'comment_${DateTime.now().millisecondsSinceEpoch}',
      text: text,
      authorId: authorId,
      authorName: authorName,
      authorImageUrl: authorImageUrl,
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
    return Comment(
      id: json['id'] as String,
      text: json['text'] as String,
      authorId: json['authorId'] as String,
      authorName: json['authorName'] as String,
      authorImageUrl: json['authorImageUrl'] as String,
      authorOccupation: json['authorOccupation'] as String? ?? '',
      timePosted: json['timePosted'] as String,
      likesCount: json['likesCount'] as int? ?? 0,
      isLiked: json['isLiked'] as bool? ?? false,
      currentReaction: json['currentReaction'] as String?,
      parentId: json['parentId'] as String?,
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