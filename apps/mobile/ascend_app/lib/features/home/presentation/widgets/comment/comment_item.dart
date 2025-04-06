import 'package:flutter/material.dart';
import '../../../models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_box.dart';
import 'package:ascend_app/features/home/presentation/utils/reaction_utils.dart';

class CommentItem extends StatelessWidget {
  final Comment comment;
  final Function(String, String?)? onReaction;
  final Function(String)? onReply;
  final Function(String, String)? onMenuAction;
  final bool showReplies;
  final Function(String)? onViewRepliesTap;
  final Function(String)? onHideRepliesTap;

  const CommentItem({
    Key? key,
    required this.comment,
    this.onReaction,
    this.onReply,
    this.onMenuAction,
    this.showReplies = false,
    this.onViewRepliesTap,
    this.onHideRepliesTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommentBox(
          authorName: comment.authorName,
          authorOccupation: comment.authorOccupation,
          timePosted: comment.timePosted,
          text: comment.text,
          avatarImage: comment.authorImageUrl,
          isLiked: comment.isLiked,
          reaction: comment.currentReaction,
          likeCount: comment.likesCount,
          onReplyTap: onReply != null ? () => onReply!(comment.id) : null,
          onReactionTap: onReaction != null ? () {
            // Toggle like on tap
            final newReactionType = comment.isLiked ? null : 'like';
            onReaction!(comment.id, newReactionType);
          } : null,
          onReactionLongPress: onReaction != null ? () {
            // Use the ReactionUtils to show the reactions popup
            final RenderBox renderBox = context.findRenderObject() as RenderBox;
            final position = renderBox.localToGlobal(Offset.zero);
            
            ReactionUtils.showReactionsPopup(
              context: context,
              position: Offset(position.dx + 40, position.dy - 40),
              itemId: comment.id,
              onReactionSelected: onReaction!,
              isComment: true,
            );
          } : null,
          onMenuOptionSelected: (option) {
            if (onMenuAction != null) {
              onMenuAction!(comment.id, option);
            }
          },
        ),

        // Show replies count or replies based on showReplies
        if (comment.replies.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(left: 40.0, top: 4.0),
            child: showReplies
                ? _buildReplies(context)
                : _buildViewRepliesButton(context),
          ),
      ],
    );
  }

  Widget _buildViewRepliesButton(BuildContext context) {
    return TextButton.icon(
      onPressed: onViewRepliesTap != null ? () => onViewRepliesTap!(comment.id) : null,
      icon: const Icon(Icons.chat_bubble_outline, size: 16),
      label: Text(
        "View ${comment.replies.length} ${comment.replies.length == 1 ? 'reply' : 'replies'}",
        style: const TextStyle(fontWeight: FontWeight.w500),
      ),
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        minimumSize: const Size(0, 32),
      ),
    );
  }

  Widget _buildReplies(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Show all replies
        ...comment.replies.map((reply) => Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: CommentItem(
            comment: reply,
            onReaction: onReaction,
            onReply: onReply,
            onMenuAction: onMenuAction,
          ),
        )).toList(),
        
        // Hide replies button
        if (onHideRepliesTap != null)
          TextButton.icon(
            onPressed: () => onHideRepliesTap!(comment.id),
            icon: const Icon(Icons.keyboard_arrow_up, size: 16),
            label: const Text(
              "Hide replies",
              style: TextStyle(fontWeight: FontWeight.w500),
            ),
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              minimumSize: const Size(0, 32),
            ),
          ),
      ],
    );
  }
}