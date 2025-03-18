import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment_form.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment_item.dart';


class CommentsSection extends StatefulWidget {
  final List<Comment> initialComments;
  
  const CommentsSection({super.key, required this.initialComments});
  
  @override
  State<CommentsSection> createState() => _CommentsSectionState();
}

class _CommentsSectionState extends State<CommentsSection> {
  late List<Comment> _comments;
  final TextEditingController _commentController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _comments = widget.initialComments;
  }
  
  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }
  
  void _addComment(String text) {
    if (text.isEmpty) return;
    
    setState(() {
      _comments.add(Comment(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        authorName: 'Current User',
        authorImage: 'assets/logo.jpg',
        text: text,
        timePosted: 'Just now',
      ));
    });
    _commentController.clear();
  }
  
  void _addReply(String text, String? parentId) {
    if (text.isEmpty || parentId == null) return;
    
    final newReply = Comment(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      authorName: 'Current User',
      authorImage: 'assets/logo.jpg',
      text: text,
      timePosted: 'Just now',
      parentId: parentId,
    );
    
    setState(() {
      // Find the parent comment and add the reply
      _findAndAddReply(_comments, parentId, newReply);
    });
  }
  
  // Recursive function to find parent comment and add reply
  bool _findAndAddReply(List<Comment> comments, String parentId, Comment reply) {
    for (int i = 0; i < comments.length; i++) {
      if (comments[i].id == parentId) {
        comments[i] = comments[i].copyWithNewReply(reply);
        return true;
      }
      
      // Check in nested replies
      if (comments[i].replies.isNotEmpty) {
        if (_findAndAddReply(comments[i].replies, parentId, reply)) {
          return true;
        }
      }
    }
    return false;
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Comments list
        ListView.builder(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemCount: _comments.length,
          itemBuilder: (context, index) {
            return CommentItem(
              comment: _comments[index],
              onAddReply: _addReply,
            );
          },
        ),
        
        // Add new comment form
        CommentForm(
          controller: _commentController,
          onSubmit: () => _addComment(_commentController.text),
        ),
      ],
    );
  }
}