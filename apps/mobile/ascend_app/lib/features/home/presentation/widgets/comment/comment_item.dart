import 'package:ascend_app/features/home/presentation/widgets/comment/comment_box.dart';
import 'package:ascend_app/features/home/presentation/widgets/common';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/managers/reaction_manager.dart';
import 'package:ascend_app/features/home/presentation/pages/comment_detail_page.dart';
import 'package:ascend_app/features/home/presentation/utils/sheet_helpers.dart'; // Add this import

class CommentItem extends StatelessWidget {
  final Comment comment;
  final Function(String, String?)? onAddReply;
  final Function(String, String)? onReaction;
  final Comment? parentComment;
  final Function(String, String)? onShareComment;
  final Function(String)? onReport;
  final String hintText;
  // Add a flag to indicate if this is already in a detail page
  final bool isNested;
  
  const CommentItem({
    Key? key,
    required this.comment,
    this.onAddReply,
    this.onReaction,
    this.parentComment,
    this.onShareComment,
    this.onReport,
    this.hintText = 'Add a reply...',
    this.isNested = false,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Use the updated CommentBox with integrated avatar and reactions
        CommentBox(
          context: context, // Add the context parameter
          authorName: comment.authorName,
          authorOccupation: comment.authorOccupation,
          timePosted: comment.timePosted,
          text: comment.text,
          avatarImage: comment.authorImage,
          isLiked: comment.isLiked,
          reaction: comment.reaction,
          likeCount: comment.likes,
          onMenuTap: () => SheetHelpers.showPostOptionsSheet(
            context: context,
            ownerName: comment.authorName,
            showSave: false,
            showNotInterested: false,
            showUnfollow: false,
            showMessage: true, // Enable message option
            reportText: 'Report comment',
            onShare: () {
              Navigator.pop(context);
              if (onShareComment != null) {
                onShareComment!(comment.id, comment.text);
              }
            },
            onMessage: () {
              Navigator.pop(context);
              // Handle messaging the user
              // Navigate to user's chat or profile
            },
            onReport: () {
              Navigator.pop(context);
              if (onReport != null) {
                onReport!(comment.id);
              }
            },
          ),
          // CHANGED: Check if this is nested, if so just use the callback directly
          onReplyTap: onAddReply != null ? () {
            if (isNested) {
              // If nested, just call the callback directly
              onAddReply!(comment.text, comment.id);
            } else {
              // Otherwise navigate to detail page as before
              final commentToShow = parentComment ?? comment;
              
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => CommentDetailPage(
                    parentComment: commentToShow,
                    onAddReply: (text, parentId) {
                      if (onAddReply != null) {
                        // Always use the top-level parent's ID for replies
                        onAddReply!(text, parentComment?.id ?? comment.id);
                      }
                    },
                    onReaction: onReaction,
                    // If this is a reply, highlight which comment was clicked
                    replyingTo: parentComment != null ? comment : null,
                  ),
                ),
              );
            }
          } : null,
          // Fix reaction callbacks
          onReactionTap: onReaction != null ? () {
            // Toggle like by default on tap
            onReaction!(comment.id, comment.isLiked ? 'none' : (comment.reaction ?? 'like'));
          } : null,
          onReactionLongPress: onReaction != null ? () {
            _showReactionsPopup(context);
          } : null,
        ),
        
        // Replies section - Pass the parent comment to each reply
        if (!isNested && comment.replies.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(left: 40.0, top: 8.0),
            child: Column(
              children: comment.replies.map((reply) => CommentItem(
                comment: reply,
                onAddReply: onAddReply,
                onReaction: onReaction,
                parentComment: comment, // Pass this comment as the parent to all replies
                onShareComment: onShareComment,
                onReport: onReport,
              )).toList(),
            ),
          ),
      ],
    );
  }
  
  // Show reactions popup without the LongPressStartDetails parameter
  void _showReactionsPopup(BuildContext context) {
    // Get render information for positioning the popup
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final position = renderBox.localToGlobal(Offset.zero);
    
    // Calculate a reasonable position for the popup
    final Offset popupPosition = Offset(
      position.dx + 50, // Adjust as needed
      position.dy - 40,  // Position above the comment
    );
    
    showDialog(
      context: context,
      barrierColor: Colors.transparent,
      builder: (BuildContext context) {
        return PostReactionsPopup(
          isComment: true,
          reactionIcons: ReactionManager.reactionIcons,
          reactionColors: ReactionManager.reactionColors,
          position: popupPosition,
          onReactionSelected: (reactionType) {
            if (onReaction != null) {
              onReaction!(comment.id, reactionType);
            }
            Navigator.of(context).pop();
          },
        );
      },
    );
  }
}