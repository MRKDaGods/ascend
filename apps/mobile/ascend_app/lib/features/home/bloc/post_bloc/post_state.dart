import 'package:equatable/equatable.dart';
import '../../models/post_model.dart';

abstract class PostState extends Equatable {
  const PostState();
  
  @override
  List<Object?> get props => [];
}

class PostsInitial extends PostState {}

class PostsLoading extends PostState {}

class PostsLoaded extends PostState {
  final List<Post> posts;
  final bool freshLoad;  // Add this property
  
  // Update the constructor to include freshLoad parameter
  const PostsLoaded(this.posts, {this.freshLoad = false});
  
  // Add method to get post by ID if you don't have it already
  Post? getPostById(String id) {
    try {
      return posts.firstWhere((post) => post.id == id);
    } catch (_) {
      return null;
    }
  }
  
  // Make sure to include freshLoad in props
  @override
  List<Object> get props => [posts, freshLoad];
  
  // Create a copy with an updated post
  PostsLoaded copyWith({List<Post>? posts}) {
    return PostsLoaded(posts ?? this.posts);
  }
}

class PostsError extends PostState {
  final String message;
  
  const PostsError(this.message);
  
  @override
  List<Object> get props => [message];
}