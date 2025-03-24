import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment_item.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment_form.dart';

class PostCommentsSection extends StatefulWidget {
  final List<Comment> comments;
  final TextEditingController commentController;
  final FocusNode commentFocusNode;
  final VoidCallback onAddComment;
  final Function(String, String?) onAddReply;
  final Function(String, String)? onReaction; // Update the parameter type
  final VoidCallback onTapCommentArea;

  const PostCommentsSection({
    super.key,
    required this.comments,
    required this.commentController,
    required this.commentFocusNode,
    required this.onAddComment,
    required this.onAddReply,
    this.onReaction, // Make it optional for backwards compatibility
    required this.onTapCommentArea,
  });

  @override
  State<PostCommentsSection> createState() => _PostCommentsSectionState();
}

class _PostCommentsSectionState extends State<PostCommentsSection> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 10),
        // Comments list
        GestureDetector(
          onTap: widget.onTapCommentArea,
          behavior: HitTestBehavior.translucent,
          child: Column(
            children: widget.comments.map((comment) => CommentItem(
              comment: comment,
              onAddReply: widget.onAddReply,
              onReaction: widget.onReaction, // Pass the reaction handler
            )).toList(),
          ),
        ),
        
        // Add Comment Form
        CommentForm(
          controller: widget.commentController,
          focusNode: widget.commentFocusNode,
          onSubmit: widget.onAddComment,
        ),
      ],
    );
  }
}

// This should be in a CommentManager class
void toggleReaction(List<Comment> comments, String commentId, String reactionType, Function(List<Comment>) onCommentsChanged) {
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
        // If a reply was updated, update the parent comment with the new replies list
        comments[i] = Comment(
          id: comments[i].id,
          authorName: comments[i].authorName,
          authorImage: comments[i].authorImage,
          authorOccupation: comments[i].authorOccupation,
          text: comments[i].text,
          timePosted: comments[i].timePosted,
          parentId: comments[i].parentId,
          replies: updatedReplies,
          likes: comments[i].likes,
          isLiked: comments[i].isLiked,
          reaction: comments[i].reaction,
        );
        return true;
      }
    }
  }
  return false;
}

// The copyWithReaction method has been moved to the Comment class