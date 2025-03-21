import 'package:ascend_app/features/home/presentation/models/comment_model.dart';

class CommentManager {
  final List<Comment> comments;
  final Function(List<Comment>) onCommentsChanged;
  
  CommentManager({
    required this.comments,
    required this.onCommentsChanged,
  });
  
  void addComment(String text, {String? authorName, String? authorImage}) {
    if (text.isEmpty) return;
    
    final newComment = Comment(
      id: DateTime.now().toString(),
      authorName: authorName ?? 'You',
      authorImage: authorImage ?? 'assets/logo.jpg',
      text: text,
      timePosted: 'Just now',
    );
    
    final updatedComments = [...comments, newComment];
    onCommentsChanged(updatedComments);
  }
  
  void addReply(String text, String parentId, {String? authorName, String? authorImage}) {
    if (text.isEmpty) return;
    
    final newReply = Comment(
      id: DateTime.now().toString(),
      authorName: authorName ?? 'You',
      authorImage: authorImage ?? 'assets/logo.jpg',
      text: text,
      timePosted: 'Just now',
      parentId: parentId,
    );
    
    final updatedComments = List<Comment>.from(comments);
    findAndAddReply(updatedComments, parentId, newReply);
    onCommentsChanged(updatedComments);
  }
  
  bool findAndAddReply(List<Comment> comments, String parentId, Comment reply) {
    for (int i = 0; i < comments.length; i++) {
      if (comments[i].id == parentId) {
        comments[i] = comments[i].copyWithNewReply(reply);
        return true;
      }
      
      if (comments[i].replies.isNotEmpty) {
        if (findAndAddReply(comments[i].replies, parentId, reply)) {
          return true;
        }
      }
    }
    return false;
  }

  // Toggle like on a comment
  void toggleLike(String commentId) {
    final updatedComments = List<Comment>.from(comments);
    findAndToggleLike(updatedComments, commentId);
    onCommentsChanged(updatedComments);
  }
  
  // Helper method to find the comment and toggle its like status
  bool findAndToggleLike(List<Comment> comments, String commentId) {
    for (int i = 0; i < comments.length; i++) {
      if (comments[i].id == commentId) {
        comments[i] = comments[i].copyWithLikeToggled();
        return true;
      }
      
      // Check replies recursively
      if (comments[i].replies.isNotEmpty) {
        List<Comment> updatedReplies = List<Comment>.from(comments[i].replies);
        if (findAndToggleLike(updatedReplies, commentId)) {
          // If a reply was updated, update the parent comment with the new replies list
          comments[i] = Comment(
            id: comments[i].id,
            authorName: comments[i].authorName,
            authorImage: comments[i].authorImage,
            text: comments[i].text,
            timePosted: comments[i].timePosted,
            parentId: comments[i].parentId,
            replies: updatedReplies,
            likes: comments[i].likes,
            isLiked: comments[i].isLiked,
          );
          return true;
        }
      }
    }
    return false;
  }
}