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
  final Post post;
  
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
  final String? parentId;
  final String authorName;
  final String authorImageUrl;
  final String authorOccupation;
  
  const AddComment({
    required this.postId,
    required this.text,
    this.parentId,
    required this.authorName,
    required this.authorImageUrl,
    required this.authorOccupation,
  });
  
  @override
  List<Object?> get props => [postId, text, parentId, authorName, authorImageUrl, authorOccupation];
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