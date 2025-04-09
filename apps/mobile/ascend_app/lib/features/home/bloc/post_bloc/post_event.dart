import 'package:equatable/equatable.dart';
import '../../models/post_model.dart';
import '../../models/comment_model.dart';

abstract class PostEvent extends Equatable {
  const PostEvent();

  @override
  List<Object?> get props => [];
}

class LoadPosts extends PostEvent {
  const LoadPosts();
}

class UpdatePost extends PostEvent {
  final PostModel post;
  
  const UpdatePost(this.post);
  
  @override
  List<Object?> get props => [post];
}

class TogglePostReaction extends PostEvent {
  final String postId;
  final String? reactionType;
  
  const TogglePostReaction(this.postId, this.reactionType);
  
  @override
  List<Object?> get props => [postId, reactionType];
}

class ToggleCommentReaction extends PostEvent {
  final String postId;
  final String commentId;
  final String? reactionType;
  
  const ToggleCommentReaction(this.postId, this.commentId, this.reactionType);
  
  @override
  List<Object?> get props => [postId, commentId, reactionType];
}

class AddComment extends PostEvent {
  final String postId;
  final String text;
  final String authorId;
  final String authorName;
  final String authorImageUrl;
  
  AddComment(
    this.postId,
    this.text,
    this.authorId,
    this.authorName,
    this.authorImageUrl,
  );
  
  @override
  List<Object?> get props => [postId, text, authorId, authorName, authorImageUrl];
}

class LoadMorePosts extends PostEvent {
  final int count;
  
  const LoadMorePosts({this.count = 5});
  
  @override
  List<Object?> get props => [count];
}

class UpdatePostComments extends PostEvent {
  final String postId;
  final List<Comment> comments;
  
  const UpdatePostComments(this.postId, this.comments);
  
  @override
  List<Object?> get props => [postId, comments];
}

class HidePost extends PostEvent {
  final String postId;
  final String reason;
  
  const HidePost(this.postId, this.reason);
  
  @override
  List<Object?> get props => [postId, reason];
}

// Add new events
class ShowPostFeedbackOptions extends PostEvent {
  final String postId;
  
  const ShowPostFeedbackOptions(this.postId);
}

class HidePostFeedbackOptions extends PostEvent {
  final String postId;
  
  const HidePostFeedbackOptions(this.postId);
}

class AddCommentReply extends PostEvent {
  final String postId;
  final String parentId;
  final String text;
  final String authorId;
  final String authorName;
  final String authorImageUrl;
  
  AddCommentReply(
    this.postId,
    this.parentId,
    this.text,
    this.authorId,
    this.authorName,
    this.authorImageUrl,
  );
  
  @override
  List<Object?> get props => [postId, parentId, text, authorId, authorName, authorImageUrl];
}