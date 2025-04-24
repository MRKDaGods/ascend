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
<<<<<<< HEAD
  final bool freshLoad; // Added this parameter
  
  const PostsLoaded(this.posts, {this.freshLoad = false}); // Added default value
  
  @override
  List<Object?> get props => [posts, freshLoad]; // Added to props
  
  // Helper method to find a post by id
=======
  final bool freshLoad; // Indicates if this is a fresh load vs. pagination
  final int currentPage;
  final bool hasMorePages;

  const PostsLoaded(
    this.posts, {
    this.freshLoad = false,
    this.currentPage = 1, // Default to page 1
    this.hasMorePages = true, // Assume more pages initially
  });

  @override
  List<Object?> get props => [posts, freshLoad, currentPage, hasMorePages];

  // Helper to get post by ID
>>>>>>> Cross
  PostModel? getPostById(String id) {
    try {
      return posts.firstWhere((post) => post.id == id);
    } catch (e) {
<<<<<<< HEAD
      return null;
    }
  }
  
  // Include freshLoad in copyWith
  PostsLoaded copyWith({List<PostModel>? posts, bool? freshLoad}) {
    return PostsLoaded(
      posts ?? this.posts,
      freshLoad: freshLoad ?? this.freshLoad,
=======
      return null; // Return null if not found
    }
  }

  PostsLoaded copyWith({
    List<PostModel>? posts,
    bool? freshLoad,
    int? currentPage,
    bool? hasMorePages,
  }) {
    return PostsLoaded(
      posts ?? this.posts,
      freshLoad: freshLoad ?? this.freshLoad,
      currentPage: currentPage ?? this.currentPage,
      hasMorePages: hasMorePages ?? this.hasMorePages,
>>>>>>> Cross
    );
  }
}

class PostsError extends PostState {
  final String message;
  
  const PostsError(this.message);
  
  @override
  List<Object> get props => [message];
}