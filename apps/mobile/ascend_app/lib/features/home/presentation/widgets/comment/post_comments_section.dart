import 'package:flutter/material.dart';
import '../../../models/comment_model.dart';
import 'comment_form.dart';
import 'comment_item.dart';

class PostCommentsSection extends StatefulWidget {
  final List<Comment> comments;
  final TextEditingController commentController;
  final FocusNode? commentFocusNode;
  final Function(List<Comment>) onCommentsChanged;
  final VoidCallback? onTapCommentArea;
  final Function(String, String?)? onReaction;
  final String postId;

  const PostCommentsSection({
    Key? key,
    required this.comments,
    required this.commentController,
    this.commentFocusNode,
    required this.onCommentsChanged,
    this.onTapCommentArea,
    this.onReaction,
    required this.postId,
  }) : super(key: key);

  @override
  State<PostCommentsSection> createState() => _PostCommentsSectionState();
}

class _PostCommentsSectionState extends State<PostCommentsSection> {
  // Track which comments have their replies showing
  final Map<String, bool> _expandedComments = {};
  // Keep track of which comment we're replying to, if any
  String? _replyingToCommentId;
  String? _replyingToAuthor;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Comment count header
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Text(
            "${widget.comments.length} ${widget.comments.length == 1 ? 'Comment' : 'Comments'}",
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ),
        
        // Comment form
        CommentForm(
          controller: widget.commentController,
          focusNode: widget.commentFocusNode,
          replyingTo: _replyingToAuthor,
          onCancelReply: _replyingToAuthor != null ? () {
            setState(() {
              _replyingToCommentId = null;
              _replyingToAuthor = null;
              widget.commentController.clear();
            });
          } : null,
          onSubmit: (text) => _addComment(context, text),
          onTap: widget.onTapCommentArea,
        ),
        
        const SizedBox(height: 16),
        
        // Comments list
        ...widget.comments.map((comment) => Padding(
          padding: const EdgeInsets.only(bottom: 16.0),
          child: CommentItem(
            comment: comment,
            showReplies: _expandedComments[comment.id] ?? false,
            onReaction: widget.onReaction,
            onReply: (commentId) => _handleReply(context, commentId, comment.authorName),
            onMenuAction: (commentId, action) => _handleMenuAction(context, commentId, action),
            onViewRepliesTap: (commentId) {
              setState(() {
                _expandedComments[commentId] = true;
              });
            },
            onHideRepliesTap: (commentId) {
              setState(() {
                _expandedComments[commentId] = false;
              });
            },
          ),
        )).toList(),
      ],
    );
  }

  void _addComment(BuildContext context, String text) {
    if (text.isEmpty) return;
    
    final newComment = Comment(
      id: 'comment_${DateTime.now().millisecondsSinceEpoch}',
      authorName: 'Current User', // Replace with actual user info
      authorImageUrl: 'assets/images/avatar.png', // Replace with actual user avatar
      text: text,
      timePosted: 'Just now',
      parentId: _replyingToCommentId,
    );
    
    // Update comments list - either add a new top-level comment or a reply
    List<Comment> updatedComments;
    
    if (_replyingToCommentId != null) {
      // Add a reply to an existing comment
      updatedComments = widget.comments.map((c) {
        if (c.id == _replyingToCommentId) {
          // Add reply to this comment
          List<Comment> updatedReplies = [...c.replies, newComment];
          return c.copyWith(replies: updatedReplies);
        }
        return c;
      }).toList();
    } else {
      // Add a new top-level comment
      updatedComments = [...widget.comments, newComment];
    }
    
    // Notify parent
    widget.onCommentsChanged(updatedComments);
    
    // Clear the form
    widget.commentController.clear();
    
    // Reset reply state
    if (_replyingToCommentId != null) {
      setState(() {
        _replyingToCommentId = null;
        _replyingToAuthor = null;
      });
    }
  }

  void _handleReply(BuildContext context, String commentId, String authorName) {
    setState(() {
      _replyingToCommentId = commentId;
      _replyingToAuthor = authorName;
    });
    
    // Focus the input
    widget.commentFocusNode?.requestFocus();
  }

  void _handleMenuAction(BuildContext context, String commentId, String action) {
    // Handle menu options
    switch (action) {
      case 'report':
        // Show report dialog
        _showReportDialog(context, commentId);
        break;
      case 'message':
        // Navigate to messaging with author
        // Navigator.of(context).push(...);
        break;
      case 'share':
        // Share comment
        // Share.share(...);
        break;
    }
  }
  
  void _showReportDialog(BuildContext context, String commentId) {
    // Show a dialog to report the comment
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Report Comment'),
        content: const Text('Why are you reporting this comment?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              // Handle report submission
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Comment reported')),
              );
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }
}