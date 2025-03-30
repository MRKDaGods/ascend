import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/profile/models/user_profile_model.dart';
import 'package:flutter/material.dart';

class CommentManager {
  final List<Comment> comments;
  final Function(List<Comment>) onCommentsChanged;
  final UserProfileModel? userProfile;
  
  CommentManager({
    required this.comments,
    required this.onCommentsChanged,
    this.userProfile,
  });
  
  void addComment(String text, {String? authorName, String? authorImage, String? authorOccupation}) {
    if (text.isEmpty) return;
    
    // Use current user's data from UserProfileModel if available
    final newComment = Comment(
      id: DateTime.now().toString(),
      authorName: authorName ?? userProfile?.name ?? 'You',
      authorImageUrl: authorImage ?? userProfile?.avatarUrl ?? 'assets/logo.jpg',
      authorOccupation: authorOccupation ?? userProfile?.position ?? '',
      text: text,
      timePosted: 'Just now',
    );
    
    final updatedComments = [...comments, newComment];
    onCommentsChanged(updatedComments);
  }
  
  void addReply(String text, String parentId, {String? authorName, String? authorImage, String? authorOccupation}) {
    if (text.isEmpty) return;
    
    final newReply = Comment(
      id: DateTime.now().toString(),
      authorName: authorName ?? userProfile?.name ?? 'You',
      authorImageUrl: authorImage ?? userProfile?.avatarUrl ?? 'assets/logo.jpg',
      authorOccupation: authorOccupation ?? userProfile?.position ?? '',
      text: text,
      timePosted: 'Just now',
      parentId: parentId,
    );
    
    final updatedComments = List<Comment>.from(comments);
    findAndAddReply(updatedComments, parentId, newReply);
    onCommentsChanged(updatedComments);
  }
  
  bool findAndAddReply(List<Comment> comments, String parentId, Comment reply) {
    for (int i = 0; i < comments.length; i++) {
      if (comments[i].id == parentId) {
        comments[i] = comments[i].copyWithNewReply(reply);
        return true;
      }
      
      if (comments[i].replies.isNotEmpty) {
        List<Comment> updatedReplies = List<Comment>.from(comments[i].replies);
        if (findAndAddReply(updatedReplies, parentId, reply)) {
          comments[i] = comments[i].copyWith(replies: updatedReplies);
          return true;
        }
      }
    }
    return false;
  }

  // Toggle like on a comment
  void toggleLike(String commentId) {
    final updatedComments = List<Comment>.from(comments);
    findAndToggleLike(updatedComments, commentId);
    onCommentsChanged(updatedComments);
  }
  
  // Helper method to find the comment and toggle its like status
  bool findAndToggleLike(List<Comment> comments, String commentId) {
    for (int i = 0; i < comments.length; i++) {
      if (comments[i].id == commentId) {
        comments[i] = comments[i].copyWithLikeToggled();
        return true;
      }
      
      // Check replies recursively
      if (comments[i].replies.isNotEmpty) {
        List<Comment> updatedReplies = List<Comment>.from(comments[i].replies);
        if (findAndToggleLike(updatedReplies, commentId)) {
          comments[i] = comments[i].copyWith(replies: updatedReplies);
          return true;
        }
      }
    }
    return false;
  }

  // Add this method to handle different reaction types
  void toggleReaction(String commentId, String reactionType) {
    final updatedComments = List<Comment>.from(comments);
    findAndUpdateReaction(updatedComments, commentId, reactionType);
    onCommentsChanged(updatedComments);
  }

  // Helper method to find the comment and update its reaction
  bool findAndUpdateReaction(List<Comment> comments, String commentId, String reactionType) {
    for (int i = 0; i < comments.length; i++) {
      if (comments[i].id == commentId) {
        comments[i] = comments[i].copyWithReaction(reactionType);
        return true;
      }
      
      // Check in nested replies
      if (comments[i].replies.isNotEmpty) {
        List<Comment> updatedReplies = List<Comment>.from(comments[i].replies);
        if (findAndUpdateReaction(updatedReplies, commentId, reactionType)) {
          comments[i] = comments[i].copyWith(replies: updatedReplies);
          return true;
        }
      }
    }
    return false;
  }
}

// Extension methods to support existing code that might reference different field names
extension CommentExtension on Comment {
  // Keep existing method
  Comment copyWithLikeToggled() {
    return copyWith(
      likesCount: isLiked ? likesCount - 1 : likesCount + 1,
      isLiked: !isLiked,
    );
  }
  
  // Add method to handle reactions
  Comment copyWithReaction(String reactionType) {
    if (isLiked && reactionType == 'none') {
      // Remove reaction
      return copyWith(
        likesCount: likesCount > 0 ? likesCount - 1 : 0,
        isLiked: false,
        currentReaction: null,
      );
    } else {
      // Add or change reaction 
      return copyWith(
        likesCount: isLiked ? likesCount : likesCount + 1,
        isLiked: true,
        currentReaction: reactionType,
      );
    }
  }
}

extension ScaffoldStateExtension on ScaffoldState {
  // Store a reference to the current user profile
  static UserProfileModel? _currentUserProfile;
  
  // Setter for current user profile
  static void setCurrentUserProfile(UserProfileModel profile) {
    _currentUserProfile = profile;
  }
  
  // Getter for current user profile
  static UserProfileModel? getCurrentUserProfile() {
    return _currentUserProfile;
  }

  void openDrawerWithAnimation({
    Duration duration = const Duration(milliseconds: 250),
    Curve curve = Curves.easeInOut,
    UserProfileModel? userProfile,
  }) {
    if (!isDrawerOpen && widget.drawer != null) {
      // If a profile is provided for this specific drawer opening,
      // update the current profile
      if (userProfile != null) {
        _currentUserProfile = userProfile;
      }
      
      openDrawer();
    }
  }

  void closeDrawerWithAnimation({
    Duration duration = const Duration(milliseconds: 200),
    Curve curve = Curves.easeIn,
  }) {
    if (isDrawerOpen) {
      Navigator.of(context).pop();
    }
  }
}