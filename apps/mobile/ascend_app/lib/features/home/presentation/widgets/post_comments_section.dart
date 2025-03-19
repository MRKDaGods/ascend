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
  final VoidCallback onTapCommentArea;

  const PostCommentsSection({
    super.key,
    required this.comments,
    required this.commentController,
    required this.commentFocusNode,
    required this.onAddComment,
    required this.onAddReply,
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