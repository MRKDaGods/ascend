import '../models/post_model.dart';
import '../models/comment_model.dart';

class PostManager {
  // Toggle reaction on a post
  static PostModel toggleReaction(PostModel post, String? reactionType) {
    if (post.isLiked && reactionType == post.currentReaction) {
      // Remove reaction
      return post.copyWith(
        isLiked: false,
        currentReaction: null,
        likesCount: post.likesCount > 0 ? post.likesCount - 1 : 0,
      );
    } else {
      // Add or change reaction
      final newLikesCount = !post.isLiked ? post.likesCount + 1 : post.likesCount;
      return post.copyWith(
        isLiked: true,
        currentReaction: reactionType,
        likesCount: newLikesCount,
      );
    }
  }

  // Add a comment to a post
  static PostModel addComment(PostModel post, Comment comment) {
    final updatedComments = [...post.comments, comment];
    return post.copyWith(
      comments: updatedComments,
      commentsCount: post.commentsCount + 1,
    );
  }

  // Toggle reaction on a specific comment within a post
  static PostModel toggleCommentReaction(PostModel post, String commentId, String? reactionType) {
    // Find the comment and its index
    int commentIndex = -1;
    Comment? targetComment;
    
    // Check top-level comments
    for (int i = 0; i < post.comments.length; i++) {
      if (post.comments[i].id == commentId) {
        commentIndex = i;
        targetComment = post.comments[i];
        break;
      }
      
      // Check replies
      for (final reply in post.comments[i].replies) {
        if (reply.id == commentId) {
          targetComment = reply;
          // Handle nested comment - find parent and update its replies
          final parent = post.comments[i];
          final updatedReplies = parent.replies.map((reply) {
            if (reply.id == commentId) {
              return reply.toggleReaction(reactionType);
            }
            return reply;
          }).toList();
          
          final updatedParent = parent.copyWith(replies: updatedReplies);
          
          // Create copy of comments with updated parent
          final updatedComments = List<Comment>.from(post.comments);
          updatedComments[i] = updatedParent;
          
          return post.copyWith(comments: updatedComments);
        }
      }
    }
    
    // Handle top-level comment
    if (commentIndex >= 0 && targetComment != null) {
      final updatedComment = targetComment.toggleReaction(reactionType);
      final updatedComments = List<Comment>.from(post.comments);
      updatedComments[commentIndex] = updatedComment;
      
      return post.copyWith(comments: updatedComments);
    }
    
    // Comment not found, return unchanged
    return post;
  }

  // Update all comments on a post
  static PostModel updateComments(PostModel post, List<Comment> newComments) {
    return post.copyWith(
      comments: newComments,
      commentsCount: newComments.length,
    );
  }
}