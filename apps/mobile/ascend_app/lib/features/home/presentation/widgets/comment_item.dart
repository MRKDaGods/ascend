import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment_form.dart';

class CommentItem extends StatefulWidget {
  final Comment comment;
  final Function(String, String?) onAddReply; // Callback for adding a reply (text, parentId)
  final int level; // Nesting level for indentation

  const CommentItem({
    super.key,
    required this.comment,
    required this.onAddReply,
    this.level = 0,
  });

  @override
  State<CommentItem> createState() => _CommentItemState();
}

class _CommentItemState extends State<CommentItem> {
  bool _showReplyForm = false;
  final TextEditingController _replyController = TextEditingController();
  final FocusNode _replyFocusNode = FocusNode();

  @override
  void dispose() {
    _replyController.dispose();
    _replyFocusNode.dispose();
    super.dispose();
  }

  void _toggleReplyForm() {
    setState(() {
      _showReplyForm = !_showReplyForm;
      if (_showReplyForm) {
        // Schedule focus for the next frame
        Future.delayed(Duration.zero, () {
          _replyFocusNode.requestFocus();
        });
      }
    });
  }

  void _submitReply() {
    if (_replyController.text.isNotEmpty) {
      widget.onAddReply(_replyController.text, widget.comment.id);
      _replyController.clear();
      setState(() {
        _showReplyForm = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Calculate left padding based on nesting level (max 3 levels)
    final leftPadding = widget.level > 0 
        ? 24.0 + (widget.level - 1) * 12.0
        : 0.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(bottom: 8.0, left: leftPadding),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                backgroundImage: AssetImage(widget.comment.authorImage),
                radius: 16,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.comment.authorName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          const SizedBox(height: 2),
                          Text(widget.comment.text),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 2.0, left: 8.0),
                      child: Row(
                        children: [
                          Text(
                            widget.comment.timePosted,
                            style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                          ),
                          const SizedBox(width: 16),
                          Text(
                            'Like',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(width: 16),
                          GestureDetector(
                            onTap: _toggleReplyForm,
                            child: Text(
                              'Reply',
                              style: TextStyle(
                                fontSize: 10, 
                                fontWeight: FontWeight.bold,
                                color: _showReplyForm ? Theme.of(context).primaryColor : null,
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
        ),
        
        // Reply form (conditionally visible)
        if (_showReplyForm)
          Padding(
            padding: EdgeInsets.only(bottom: 8.0, left: leftPadding + 24.0),
            child: CommentForm(
              controller: _replyController,
              onSubmit: _submitReply,
              focusNode: _replyFocusNode,
            ),
          ),
        
        // Nested replies
        if (widget.comment.replies.isNotEmpty)
          ...widget.comment.replies.map(
            (reply) => CommentItem(
              comment: reply,
              onAddReply: widget.onAddReply,
              level: widget.level + 1 > 3 ? 3 : widget.level + 1, // Limit nesting to 3 levels
            ),
          ),
      ],
    );
  }
}

