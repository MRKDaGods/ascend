import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/managers/reaction_manager.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_reactions_popup.dart';

class CommentItem extends StatelessWidget {
  final Comment comment;
  final Function(String, String?)? onAddReply;
  final Function(String, String)? onReaction; // Updated to pass reaction type
  
  const CommentItem({
    Key? key,
    required this.comment,
    this.onAddReply,
    this.onReaction, // Renamed from onToggleLike
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Main comment
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Author avatar outside the gray box
            CircleAvatar(
              backgroundImage: AssetImage(comment.authorImage),
              radius: 16,
            ),
            
            const SizedBox(width: 8),
            
            // Comment content and actions
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Comment container with gray background
                  Container(
                    padding: const EdgeInsets.all(12.0),
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Author name and position
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Author name
                            Text(
                              comment.authorName,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            
                            // Author occupation if available
                            if (comment.authorOccupation != null && comment.authorOccupation!.isNotEmpty)
                              Text(
                                comment.authorOccupation!,
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 12,
                                ),
                              ),
                          ],
                        ),
                        
                        const SizedBox(height: 8),
                        
                        // Comment text
                        Text(comment.text),
                      ],
                    ),
                  ),
                  
                  // Comment actions row
                  Padding(
                    padding: const EdgeInsets.only(left: 12.0, top: 4.0),
                    child: Row(
                      children: [
                        // Time posted
                        Text(
                          comment.timePosted,
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(width: 16),
                        
                        // Reaction button (supports multiple reaction types)
                        if (onReaction != null)
                          GestureDetector(
                            onTap: () {
                              // Toggle like by default on tap
                              onReaction!(comment.id, comment.isLiked ? 'none' : comment.reaction ?? 'like');
                            },
                            onLongPress: () {
                              // Show reactions popup on long press
                              _showReactionsPopup(context);
                            },
                            child: Row(
                              children: [
                                Icon(
                                  _getReactionIcon(),
                                  size: 14,
                                  color: _getReactionColor(),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  comment.likes > 0 ? '${comment.likes}' : getReactionText(),
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: _getReactionColor(),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        
                        const SizedBox(width: 16),
                        
                        // Reply button
                        if (onAddReply != null)
                          GestureDetector(
                            onTap: () {
                              showModalBottomSheet(
                                context: context,
                                isScrollControlled: true,
                                builder: (context) => Padding(
                                  padding: EdgeInsets.only(
                                    bottom: MediaQuery.of(context).viewInsets.bottom,
                                  ),
                                  child: ReplyForm(
                                    parentId: comment.id,
                                    onSubmit: onAddReply!,
                                  ),
                                ),
                              );
                            },
                            child: Text(
                              'Reply',
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 12,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        
        // Replies section
        if (comment.replies.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(left: 40.0, top: 8.0),
            child: Column(
              children: comment.replies.map((reply) => CommentItem(
                comment: reply,
                onAddReply: onAddReply,
                onReaction: onReaction,
              )).toList(),
            ),
          ),
      ],
    );
  }
  
  // Show reactions popup
  void _showReactionsPopup(BuildContext context) {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final position = renderBox.localToGlobal(Offset.zero);
    
    showDialog(
      context: context,
      barrierColor: Colors.transparent,
      builder: (BuildContext context) {
        return PostReactionsPopup(
          isComment: true,
          reactionIcons: ReactionManager.reactionIcons,
          reactionColors: ReactionManager.reactionColors,
          position: position,
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
  
  // Get reaction icon based on current reaction
  IconData _getReactionIcon() {
    if (!comment.isLiked) {
      return Icons.thumb_up_outlined;
    }
    
    // Use the reaction map from ReactionManager
    final reaction = comment.reaction ?? 'like';
    return ReactionManager.reactionIcons[reaction] ?? Icons.thumb_up;
  }
  
  // Get reaction color based on current reaction
  Color _getReactionColor() {
    if (!comment.isLiked) {
      return Colors.grey;
    }
    
    // Use the reaction color map from ReactionManager
    final reaction = comment.reaction ?? 'like';
    return ReactionManager.reactionColors[reaction] ?? Colors.blue;
  }
  
  // Get reaction text
  String getReactionText() {
    if (!comment.isLiked) {
      return 'Like';
    }
    
    // Capitalize the reaction type
    final reaction = comment.reaction ?? 'like';
    return reaction.substring(0, 1).toUpperCase() + reaction.substring(1);
  }
}

// Helper widget for replying to comments (unchanged)
class ReplyForm extends StatefulWidget {
  final String parentId;
  final Function(String, String?) onSubmit;
  
  const ReplyForm({Key? key, required this.parentId, required this.onSubmit}) : super(key: key);
  
  @override
  State<ReplyForm> createState() => _ReplyFormState();
}

class _ReplyFormState extends State<ReplyForm> {
  final TextEditingController _controller = TextEditingController();
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              autofocus: true,
              decoration: const InputDecoration(
                hintText: 'Write a reply...',
                border: OutlineInputBorder(),
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.send),
            onPressed: () {
              widget.onSubmit(_controller.text, widget.parentId);
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}