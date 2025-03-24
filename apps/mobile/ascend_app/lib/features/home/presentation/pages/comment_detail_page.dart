import 'package:ascend_app/features/home/managers/reaction_manager.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_box.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_form.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_item.dart';
import 'package:ascend_app/features/home/presentation/widgets/common';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';


class CommentDetailPage extends StatefulWidget {
  final Comment parentComment;
  final Function(String, String) onAddReply;
  final Function(String, String)? onReaction;
  final Comment? replyingTo;
  
  const CommentDetailPage({
    Key? key,
    required this.parentComment,
    required this.onAddReply,
    this.onReaction,
    this.replyingTo,
  }) : super(key: key);
  
  @override
  State<CommentDetailPage> createState() => _CommentDetailPageState();
}

class _CommentDetailPageState extends State<CommentDetailPage> {
  final TextEditingController _replyController = TextEditingController();
  final FocusNode _replyFocusNode = FocusNode();
  
  // Keep a local copy of the parent comment that we can update
  late Comment _currentParentComment;
  
  // Track which comment we're replying to
  Comment? _replyingTo;
  
  @override
  void initState() {
    super.initState();
    // Initialize with the passed parent comment
    _currentParentComment = widget.parentComment;
    
    // Initialize replying to state
    _replyingTo = widget.replyingTo;
    
    // Auto-focus if replying to a specific comment
    if (_replyingTo != null) {
      _replyFocusNode.requestFocus();
    }
  }
  
  @override
  void dispose() {
    _replyController.dispose();
    _replyFocusNode.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Comments'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0.5,
      ),
      body: Column(
        children: [
          // Scrollable comment section
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Parent comment using CommentBox
                  _buildParentCommentWithCommentBox(),
                  
                  // Replies list - indented from parent comment
                  if (_currentParentComment.replies.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(left: 40.0, top: 8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: _currentParentComment.replies.map((reply) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: CommentItem(
                              comment: reply,
                              // CHANGED: Just set replying state in current page instead of opening new page
                              onAddReply: (_, __) => _setReplyingTo(reply),
                              onReaction: widget.onReaction != null ? (id, reaction) {
                                // Handle reaction locally and through callback
                                widget.onReaction!(id, reaction);
                                _updateReaction(id, reaction);
                              } : null,
                              parentComment: _currentParentComment,
                              // ADDED: Set isNested flag to true for replies in detail page
                              isNested: true,
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  
                  // Extra space for scrolling past the input field
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
          
          // Comment form at the bottom
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 3,
                  offset: const Offset(0, -1),
                ),
              ],
              border: Border(
                top: BorderSide(color: Colors.grey.shade200),
              ),
            ),
            padding: EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              top: 12.0,
              bottom: MediaQuery.of(context).viewInsets.bottom + 12.0,
            ),
            child: CommentForm(
              controller: _replyController,
              focusNode: _replyFocusNode,
              onSubmit: _submitReply,
              hintText: _replyingTo != null 
                ? 'Reply to ${_replyingTo!.authorName}...'
                : 'Reply to ${_currentParentComment.authorName}...',
            ),
          ),
        ],
      ),
    );
  }
  
  // Submit reply method
  void _submitReply() {
    final text = _replyController.text.trim();
    if (text.isNotEmpty) {
      // Create a new reply comment
      final newReply = Comment(
        id: 'reply_${DateTime.now().millisecondsSinceEpoch}',
        authorName: 'Current User', // Replace with actual user info
        authorImage: 'assets/logo.jpg', // Replace with actual user image
        text: text,
        timePosted: 'Just now',
        isLiked: false,
        likes: 0,
        replies: [], // Replies can't have replies (2-level limitation)
      );
      
      // Add the reply using the callback
      widget.onAddReply(text, _currentParentComment.id);
      
      // Update local state to show the new reply immediately
      setState(() {
        // Create a new list with all existing replies plus the new one
        final updatedReplies = List<Comment>.from(_currentParentComment.replies)..add(newReply);
        
        // Update the local parent comment with the new replies list
        _currentParentComment = Comment(
          id: _currentParentComment.id,
          authorName: _currentParentComment.authorName,
          authorImage: _currentParentComment.authorImage,
          authorOccupation: _currentParentComment.authorOccupation,
          text: _currentParentComment.text,
          timePosted: _currentParentComment.timePosted,
          isLiked: _currentParentComment.isLiked,
          likes: _currentParentComment.likes,
          reaction: _currentParentComment.reaction,
          replies: updatedReplies,
        );
        
        // Reset replying state after submitting
        _replyingTo = null;
      });
      
      _replyController.clear();
    }
  }
  
  // Build the parent comment using CommentBox
  Widget _buildParentCommentWithCommentBox() {
    return CommentBox(
      authorName: _currentParentComment.authorName,
      authorOccupation: _currentParentComment.authorOccupation,
      timePosted: _currentParentComment.timePosted,
      text: _currentParentComment.text,
      avatarImage: _currentParentComment.authorImage,
      isLiked: _currentParentComment.isLiked,
      reaction: _currentParentComment.reaction,
      likeCount: _currentParentComment.likes,
      context: context, // Add the context parameter
      onMenuTap: () {}, // Just an empty callback since SheetHelpers will handle it directly
      // Enable replying to parent comment in detail view
      onReplyTap: () => _setReplyingTo(_currentParentComment),
      onReactionTap: widget.onReaction != null ? () {
        // Toggle like/unlike on tap
        final newReaction = _currentParentComment.isLiked ? 'none' : (_currentParentComment.reaction ?? 'like');
        if (widget.onReaction != null) {
          widget.onReaction!(_currentParentComment.id, newReaction);
          _updateParentReaction(newReaction);
        }
      } : null,
      onReactionLongPress: widget.onReaction != null ? () {
        // Show reaction popup on long press
        _showReactionsPopupAtButton();
      } : null,
    );
  }
  
  // Show reactions popup
  void _showReactionsPopupAtButton() {
    // Get a reference to the current context's render box
    final Size size = MediaQuery.of(context).size;
    
    // Position the popup in a reasonable location relative to the screen
    final Offset popupPosition = Offset(
      size.width * 0.2, // Position at 20% from the left of the screen
      size.height * 0.4, // Position at 40% from the top of the screen
    );
    
    showDialog(
      context: context,
      barrierColor: Colors.transparent,
      builder: (BuildContext dialogContext) {
        return PostReactionsPopup(
          isComment: true,
          reactionIcons: ReactionManager.reactionIcons,
          reactionColors: ReactionManager.reactionColors,
          position: popupPosition,
          onReactionSelected: (reactionType) {
            if (widget.onReaction != null) {
              // Apply the reaction
              widget.onReaction!(_currentParentComment.id, reactionType);
              
              // Update local state
              _updateParentReaction(reactionType);
            }
            Navigator.of(dialogContext).pop();
          },
        );
      },
    );
  }
  
  // Update a reply's reaction in our local state
  void _updateReaction(String replyId, String reactionType) {
    setState(() {
      final updatedReplies = _currentParentComment.replies.map((reply) {
        if (reply.id == replyId) {
          final bool isLiked = reactionType != 'none';
          final int newLikes = isLiked ? 1 : 0; // Simplified likes logic
          
          return Comment(
            id: reply.id,
            authorName: reply.authorName,
            authorImage: reply.authorImage,
            authorOccupation: reply.authorOccupation,
            text: reply.text,
            timePosted: reply.timePosted,
            isLiked: isLiked,
            likes: newLikes,
            reaction: isLiked ? reactionType : null,
            replies: reply.replies,
          );
        }
        return reply;
      }).toList();
      
      _currentParentComment = Comment(
        id: _currentParentComment.id,
        authorName: _currentParentComment.authorName,
        authorImage: _currentParentComment.authorImage,
        authorOccupation: _currentParentComment.authorOccupation,
        text: _currentParentComment.text,
        timePosted: _currentParentComment.timePosted,
        isLiked: _currentParentComment.isLiked,
        likes: _currentParentComment.likes,
        reaction: _currentParentComment.reaction,
        replies: updatedReplies,
      );
    });
  }
  
  // Update the parent comment's reaction
  void _updateParentReaction(String reactionType) {
    setState(() {
      final bool isLiked = reactionType != 'none';
      final int newLikes = isLiked ? 1 : 0; // Simplified likes logic
      
      _currentParentComment = Comment(
        id: _currentParentComment.id,
        authorName: _currentParentComment.authorName,
        authorImage: _currentParentComment.authorImage,
        authorOccupation: _currentParentComment.authorOccupation,
        text: _currentParentComment.text,
        timePosted: _currentParentComment.timePosted,
        isLiked: isLiked,
        likes: newLikes,
        reaction: isLiked ? reactionType : null,
        replies: _currentParentComment.replies,
      );
    });
  }
  
  // Add a helper method to handle setting reply state
  void _setReplyingTo(Comment? comment) {
    setState(() {
      _replyingTo = comment;
    });
    _replyFocusNode.requestFocus();
  }
}