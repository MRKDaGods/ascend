import 'package:ascend_app/features/home/models/post_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/foundation.dart'; // Import for debugPrint
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
    on<AddComment>((event, emit) async {
      final currentState = state;
      if (currentState is PostsLoaded) {
        try {
          final newComment = Comment.create(
            text: event.text,
            authorId: event.authorId,
            authorName: event.authorName,
            authorImageUrl: event.authorImageUrl,
          );
          
          final updatedPosts = currentState.posts.map((post) {
            if (post.id == event.postId) {
              return post.copyWith(
                comments: [...post.comments, newComment],
              );
            }
            return post;
          }).toList();
          
          emit(PostsLoaded(updatedPosts));
        } catch (e) {
          emit(PostsError("Failed to add comment: ${e.toString()}"));
        }
      }
    });
    on<ToggleCommentReaction>(_onToggleCommentReaction);
    on<UpdatePostComments>(_onUpdatePostComments);
    on<HidePost>(_onHidePost);
    on<ShowPostFeedbackOptions>(_onShowPostFeedbackOptions);
    on<HidePostFeedbackOptions>(_onHidePostFeedbackOptions);
    on<AddCommentReply>((event, emit) async {
      final currentState = state;
      if (currentState is PostsLoaded) {
        try {
          final newReply = Comment.create(
            text: event.text,
            authorId: event.authorId,
            authorName: event.authorName,
            authorImageUrl: event.authorImageUrl,
            parentId: event.parentId,
          );
          
          final updatedPosts = currentState.posts.map((post) {
            if (post.id == event.postId) {
              final updatedComments = post.comments.map((comment) {
                if (comment.id == event.parentId) {
                  return comment.copyWith(
                    replies: [...comment.replies, newReply],
                  );
                }
                return comment;
              }).toList();
              
              return post.copyWith(comments: updatedComments);
            }
            return post;
          }).toList();
          
          emit(PostsLoaded(updatedPosts));
        } catch (e) {
          emit(PostsError("Failed to add reply: ${e.toString()}"));
        }
      }
    });
    // Register other events here
  }
  
  Future<void> _onLoadPosts(LoadPosts event, Emitter<PostState> emit) async {
    emit(PostsLoading());
    try {
      debugPrint('🔄 [PostBloc] Attempting to load initial posts (page 1)...');
      // Fetch page 1 explicitly
      final result = await _postRepository.fetchFeed(page: 1, limit: 15);
      final posts = result['posts'] as List<PostModel>;
      final currentPage = result['currentPage'] as int;
      final hasMorePages = result['hasMorePages'] as bool;

      debugPrint('✅ [PostBloc] Initial posts loaded: ${posts.length} posts. Page: $currentPage, HasMore: $hasMorePages');
      emit(PostsLoaded(
        posts,
        freshLoad: true,
        currentPage: currentPage,
        hasMorePages: hasMorePages,
      ));
    } catch (e, stackTrace) { // Catch stack trace
      debugPrint('❌ [PostBloc] Error caught in _onLoadPosts: $e\n$stackTrace');
      emit(PostsError('Failed to load posts: $e'));
    }
  }
  
  Future<void> _onLoadMorePosts(LoadMorePosts event, Emitter<PostState> emit) async {
    if (state is PostsLoaded) {
      final currentState = state as PostsLoaded;

      // Only load more if hasMorePages is true
      if (!currentState.hasMorePages) {
        debugPrint(' [PostBloc] No more pages to load.');
        return;
      }

      try {
        final nextPage = currentState.currentPage + 1;
        debugPrint('🔄 [PostBloc] Attempting to load more posts (page $nextPage)...');

        // Load more posts using the next page number
        final result = await _postRepository.getMorePosts(page: nextPage, limit: event.count);
        final newPosts = result['posts'] as List<PostModel>;
        final currentPage = result['currentPage'] as int;
        final hasMorePages = result['hasMorePages'] as bool;

        debugPrint('✅ [PostBloc] More posts loaded: ${newPosts.length} posts. Page: $currentPage, HasMore: $hasMorePages');

        // Combine with existing posts, ensuring no duplicates if API behaves unexpectedly
        final combinedPosts = List<PostModel>.from(currentState.posts);
        final existingPostIds = currentState.posts.map((p) => p.id).toSet();
        for (var newPost in newPosts) {
          if (!existingPostIds.contains(newPost.id)) {
            combinedPosts.add(newPost);
            existingPostIds.add(newPost.id); // Add new ID to set
          } else {
             debugPrint(' [PostBloc] Duplicate post ID found and skipped: ${newPost.id}');
          }
        }


        // Emit updated state
        emit(currentState.copyWith(
          posts: combinedPosts,
          freshLoad: false, // Not a fresh load
          currentPage: currentPage,
          hasMorePages: hasMorePages,
        ));
      } catch (e) {
        debugPrint('❌ [PostBloc] Error caught in _onLoadMorePosts: $e');
        // Optionally emit an error state or just keep the current one
        emit(PostsError('Failed to load more posts: $e'));
        // Re-emit current state without changes on error? Or maybe just update hasMorePages?
        // emit(currentState.copyWith(hasMorePages: false)); // Assume no more pages on error
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