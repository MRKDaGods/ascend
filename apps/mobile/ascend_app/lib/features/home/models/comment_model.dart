import 'package:equatable/equatable.dart';
import 'package:uuid/uuid.dart';

class Comment extends Equatable {
  final String id;
  final String authorName;
  final String authorImageUrl;
  final String authorOccupation;
  final String text;
  final String timePosted;
  final String? parentId;
  final List<Comment> replies;
  final int likesCount;
  final bool isLiked;
  final String? currentReaction;
  
  static final Uuid _uuid = Uuid();
  
  const Comment({
    required this.id,
    required this.authorName,
    required this.authorImageUrl,
    this.authorOccupation = '',
    required this.text,
    required this.timePosted,
    this.parentId,
    this.replies = const [],
    this.likesCount = 0,
    this.isLiked = false,
    this.currentReaction,
  });
  
  // Factory method to create a new comment
  static Comment create({
    required String text,
    String? parentId,
    String authorName = 'Current User',
    String authorImageUrl = 'assets/images/profile/current_user.jpg',
    String authorOccupation = 'User',
  }) {
    return Comment(
      id: _uuid.v4(),
      authorName: authorName,
      authorImageUrl: authorImageUrl,
      authorOccupation: authorOccupation,
      text: text,
      timePosted: 'Just now',
      parentId: parentId,
    );
  }
  
  @override
  List<Object?> get props => [
    id, 
    authorName, 
    authorImageUrl, 
    authorOccupation, 
    text,
    timePosted,
    parentId,
    replies,
    likesCount,
    isLiked,
    currentReaction,
  ];
  
  Comment copyWith({
    String? id,
    String? authorName,
    String? authorImageUrl,
    String? authorOccupation,
    String? text,
    String? timePosted,
    String? parentId,
    List<Comment>? replies,
    int? likesCount,
    bool? isLiked,
    String? currentReaction,
  }) {
    return Comment(
      id: id ?? this.id,
      authorName: authorName ?? this.authorName,
      authorImageUrl: authorImageUrl ?? this.authorImageUrl,
      authorOccupation: authorOccupation ?? this.authorOccupation,
      text: text ?? this.text,
      timePosted: timePosted ?? this.timePosted,
      parentId: parentId ?? this.parentId,
      replies: replies ?? this.replies,
      likesCount: likesCount ?? this.likesCount,
      isLiked: isLiked ?? this.isLiked,
      currentReaction: currentReaction ?? this.currentReaction,
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
      'authorName': authorName,
      'authorImageUrl': authorImageUrl,
      'authorOccupation': authorOccupation,
      'text': text,
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
      authorName: json['authorName'] as String,
      authorImageUrl: json['authorImageUrl'] as String,
      authorOccupation: json['authorOccupation'] as String? ?? '',
      text: json['text'] as String,
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