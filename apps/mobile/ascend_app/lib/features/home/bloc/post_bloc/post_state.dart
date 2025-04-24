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
  final List<PostModel> posts;
  final bool freshLoad; // Added this parameter
  
  const PostsLoaded(this.posts, {this.freshLoad = false}); // Added default value
  
  @override
  List<Object?> get props => [posts, freshLoad]; // Added to props
  
  // Helper method to find a post by id
  PostModel? getPostById(String id) {
    try {
      return posts.firstWhere((post) => post.id == id);
    } catch (e) {
      return null;
    }
  }
  
  // Include freshLoad in copyWith
  PostsLoaded copyWith({List<PostModel>? posts, bool? freshLoad}) {
    return PostsLoaded(
      posts ?? this.posts,
      freshLoad: freshLoad ?? this.freshLoad,
    );
  }
}

class PostsError extends PostState {
  final String message;
  
  const PostsError(this.message);
  
  @override
  List<Object> get props => [message];
}