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
  final Function(Comment parentComment, Comment replyingTo)? onNavigateToReply;
  final Function(String, String?) onAddComment; // Updated to include user info
  final String postId;
  final String currentUserId; // Add this to identify current user
  final String currentUserName;
  final String? currentUserAvatarUrl;

  const PostCommentsSection({
    Key? key,
    required this.comments,
    required this.commentController,
    this.commentFocusNode,
    required this.onCommentsChanged,
    this.onTapCommentArea,
    this.onReaction,
    this.onNavigateToReply,
    required this.onAddComment,
    required this.postId,
    required this.currentUserId,
    required this.currentUserName,
    this.currentUserAvatarUrl,
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
          userName: widget.currentUserName,
          userAvatarUrl: widget.currentUserAvatarUrl,
        ),
        
        const SizedBox(height: 16),
        
        // Comments list
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: widget.comments.length,
          itemBuilder: (context, index) {
            final comment = widget.comments[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: CommentItem(
                comment: comment,
                showReplies: _expandedComments[comment.id] ?? false,
                isCurrentUser: comment.authorId == widget.currentUserId, // Pass this flag
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
            );
          },
        ),
      ],
    );
  }

  void _addComment(BuildContext context, String text) {
    // Pass the text and parent ID (if replying) to the callback
    if (_replyingToCommentId != null) {
      widget.onAddComment(text, _replyingToCommentId);
    } else {
      widget.onAddComment(text, null);
    }
    
    // Clear the form and reset reply state
    widget.commentController.clear();
    
    if (_replyingToCommentId != null) {
      setState(() {
        _replyingToCommentId = null;
        _replyingToAuthor = null;
      });
    }
  }

  void _handleReply(BuildContext context, String commentId, String authorName) {
    // Find the comment we're replying to
    Comment? targetComment;
    Comment? parentComment;
    
    // Find the target comment (could be parent or reply)
    for (final comment in widget.comments) {
      if (comment.id == commentId) {
        targetComment = comment;
        parentComment = comment; // If it's a parent comment, they're the same
        break;
      }
      
      // Check if it's a reply
      for (final reply in comment.replies) {
        if (reply.id == commentId) {
          targetComment = reply;
          parentComment = comment; // The parent of this reply
          break;
        }
      }
      
      if (targetComment != null) break;
    }
    
    // If we found the comments and have a navigation callback, navigate
    if (targetComment != null && parentComment != null && widget.onNavigateToReply != null) {
      widget.onNavigateToReply!(parentComment, targetComment);
      return;
    }
    
    // Fallback to the original behavior
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