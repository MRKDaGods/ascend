import 'package:flutter_bloc/flutter_bloc.dart';
import '../../models/comment_model.dart';
import '../../repositories/post_repository.dart';
import 'post_event.dart';
import 'post_state.dart';

class PostBloc extends Bloc<PostEvent, PostState> {
  final PostRepository _postRepository;
  
  PostBloc(this._postRepository) : super(PostsLoading()) {
    on<LoadPosts>(_onLoadPosts);
    on<LoadMorePosts>(_onLoadMorePosts);
    on<TogglePostReaction>(_onTogglePostReaction);
    on<AddComment>(_onAddComment);
    on<ToggleCommentReaction>(_onToggleCommentReaction);
    on<UpdatePostComments>(_onUpdatePostComments);
    on<HidePost>(_onHidePost);
    on<ShowPostFeedbackOptions>(_onShowPostFeedbackOptions);
    on<HidePostFeedbackOptions>(_onHidePostFeedbackOptions);
    // Register other events here
  }
  
  Future<void> _onLoadPosts(LoadPosts event, Emitter<PostState> emit) async {
    try {
      emit(PostsLoading());
      final posts = await _postRepository.getPosts();
      
      // Add freshLoad: true when emitting a fresh load
      emit(PostsLoaded(posts, freshLoad: true));
    } catch (e) {
      emit(PostsError('Failed to load posts: $e'));
    }
  }
  
  Future<void> _onLoadMorePosts(LoadMorePosts event, Emitter<PostState> emit) async {
    if (state is PostsLoaded) {
      final currentState = state as PostsLoaded;
      try {
        // Load more posts
        final newPosts = await _postRepository.getMorePosts(event.count);
        
        // Combine with existing posts
        final updatedPosts = [...currentState.posts, ...newPosts];
        
        // Emit with freshLoad: false since we're appending
        emit(PostsLoaded(updatedPosts, freshLoad: false));
      } catch (e) {
        emit(PostsError('Failed to load more posts: $e'));
        emit(currentState); // Restore previous state on error
      }
    }
  }
  
  Future<void> _onTogglePostReaction(
    TogglePostReaction event, 
    Emitter<PostState> emit
  ) async {
    if (state is PostsLoaded) {
      final currentState = state as PostsLoaded;
      try {
        // Find post by ID
        final post = currentState.getPostById(event.postId);
        if (post == null) return;
        
        // Toggle reaction
        final updatedPost = post.toggleReaction(event.reactionType);
        
        // Update repository
        await _postRepository.updatePost(updatedPost);
        
        // Update state with new post
        final posts = currentState.posts.map((p) => 
          p.id == updatedPost.id ? updatedPost : p
        ).toList();
        
        emit(PostsLoaded(posts));
      } catch (e) {
        emit(PostsError('Failed to update reaction: $e'));
        emit(currentState); // Revert to previous state
      }
    }
  }
  
  Future<void> _onAddComment(AddComment event, Emitter<PostState> emit) async {
    if (state is PostsLoaded) {
      final currentState = state as PostsLoaded;
      try {
        final post = currentState.getPostById(event.postId);
        if (post == null) return;
        
        // Create new comment
        final newComment = Comment.create(
          text: event.text,
          parentId: event.parentId,
          authorName: event.authorName,
          authorImageUrl: event.authorImageUrl,
          authorOccupation: event.authorOccupation,
        );
        
        // Add comment to post
        final updatedPost = post.addComment(newComment);
        
        // Update repository
        await _postRepository.updatePost(updatedPost);
        
        // Update state
        final posts = currentState.posts.map((p) => 
          p.id == updatedPost.id ? updatedPost : p
        ).toList();
        
        emit(PostsLoaded(posts));
      } catch (e) {
        emit(PostsError('Failed to add comment: $e'));
        emit(currentState);
      }
    }
  }
  
  Future<void> _onToggleCommentReaction(
    ToggleCommentReaction event, 
    Emitter<PostState> emit
  ) async {
    if (state is PostsLoaded) {
      final currentState = state as PostsLoaded;
      try {
        final post = currentState.getPostById(event.postId);
        if (post == null) return;
        
        // Update the comment's reaction
        final updatedPost = post.toggleCommentReaction(
          event.commentId, 
          event.reactionType
        );
        
        // Update repository
        await _postRepository.updatePost(updatedPost);
        
        // Update state
        final posts = currentState.posts.map((p) => 
          p.id == updatedPost.id ? updatedPost : p
        ).toList();
        
        emit(PostsLoaded(posts));
      } catch (e) {
        emit(PostsError('Failed to update comment reaction: $e'));
        emit(currentState);
      }
    }
  }
  
  Future<void> _onUpdatePostComments(
    UpdatePostComments event, 
    Emitter<PostState> emit
  ) async {
    if (state is PostsLoaded) {
      final currentState = state as PostsLoaded;
      try {
        final post = currentState.getPostById(event.postId);
        if (post == null) return;
        
        // Update the post's comments
        final updatedPost = post.copyWith(comments: event.comments);
        
        // Update repository
        await _postRepository.updatePost(updatedPost);
        
        // Update state
        final posts = currentState.posts.map((p) => 
          p.id == updatedPost.id ? updatedPost : p
        ).toList();
        
        emit(PostsLoaded(posts));
      } catch (e) {
        emit(PostsError('Failed to update comments: $e'));
        emit(currentState);
      }
    }
  }
  
  Future<void> _onHidePost(HidePost event, Emitter<PostState> emit) async {
    if (state is PostsLoaded) {
      final currentState = state as PostsLoaded;
      try {
        // Update repository - mark post as hidden with reason
        await _postRepository.hidePost(event.postId, event.reason);
        
        // Remove post from state
        final posts = currentState.posts
            .where((post) => post.id != event.postId)
            .toList();
        
        emit(PostsLoaded(posts));
      } catch (e) {
        emit(PostsError('Failed to hide post: $e'));
        emit(currentState);
      }
    }
  }

  void _onShowPostFeedbackOptions(ShowPostFeedbackOptions event, Emitter<PostState> emit) {
    final currentState = state as PostsLoaded;
    final posts = currentState.posts.map((post) {
      if (post.id == event.postId) {
        return post.copyWith(showFeedbackOptions: true);
      }
      return post;
    }).toList();
    
    emit(PostsLoaded(posts));
  }

  void _onHidePostFeedbackOptions(HidePostFeedbackOptions event, Emitter<PostState> emit) {
    final currentState = state as PostsLoaded;
    final posts = currentState.posts.map((post) {
      if (post.id == event.postId) {
        return post.copyWith(showFeedbackOptions: false);
      }
      return post;
    }).toList();
    
    emit(PostsLoaded(posts));
  }
}