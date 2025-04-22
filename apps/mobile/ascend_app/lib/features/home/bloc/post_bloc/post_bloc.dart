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
    on<AddComment>(_onAddComment);
    on<SharePost>(_onSharePost); // Register the new handler
    on<ToggleCommentReaction>(_onToggleCommentReaction);
    on<UpdatePostComments>(_onUpdatePostComments);
    on<HidePost>(_onHidePost);
    on<ShowPostFeedbackOptions>(_onShowPostFeedbackOptions);
    on<HidePostFeedbackOptions>(_onHidePostFeedbackOptions);
    on<AddCommentReply>(_onAddCommentReply);
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

  Future<void> _onAddComment(AddComment event, Emitter<PostState> emit) async {
    final currentState = state;
    if (currentState is PostsLoaded) {
      try {
        debugPrint('🔄 [PostBloc] Attempting to add comment via API for post ${event.postId}');
        // Call the repository to add the comment via API
        final newComment = await _postRepository.addComment(
          event.postId,
          event.text,
          event.authorId,
          event.authorName,
          event.authorImageUrl, // Pass necessary info
        );
        debugPrint('✅ [PostBloc] Comment added via API: ${newComment.id}, Text: ${newComment.text}');

        // Find the index of the post to update
        final postIndex = currentState.posts.indexWhere((p) => p.id == event.postId);
        if (postIndex == -1) {
          debugPrint('⚠️ [PostBloc] Post ${event.postId} not found in current state after adding comment.');
          return; // Post not found, maybe it was removed?
        }

        final originalPost = currentState.posts[postIndex];
        debugPrint('📝 [PostBloc] Original post comments count: ${originalPost.commentsCount}, comments list size: ${originalPost.comments.length}');

        // Create the updated post with the new comment
        final updatedPost = originalPost.copyWith(
          comments: [...originalPost.comments, newComment], // Add the comment returned by the API
          commentsCount: (originalPost.commentsCount ?? 0) + 1, // Increment count
        );
        debugPrint('📝 [PostBloc] Updated post comments count: ${updatedPost.commentsCount}, comments list size: ${updatedPost.comments.length}');

        // Create a new list of posts with the updated post
        final updatedPosts = List<PostModel>.from(currentState.posts); // Create a mutable copy
        updatedPosts[postIndex] = updatedPost; // Replace the old post with the updated one

        debugPrint('➡️ [PostBloc] Emitting updated state. New total posts: ${updatedPosts.length}');
        // Emit the new state with the updated list
        emit(currentState.copyWith(posts: updatedPosts, freshLoad: false)); // Use copyWith to maintain pagination state
        debugPrint('✅ [PostBloc] State emitted with updated comment list for post ${event.postId}.');

      } catch (e) {
        debugPrint('❌ [PostBloc] Failed to add comment via API: $e');
        // Emit an error state or handle it appropriately
        // Consider emitting the original state if you want the UI to revert
        emit(PostsError("Failed to add comment: ${e.toString()}"));
         // Optionally re-emit the current state to avoid UI freeze on error
        await Future.delayed(const Duration(milliseconds: 50)); // Short delay before reverting
        emit(currentState);
      }
    } else {
       debugPrint('⚠️ [PostBloc] AddComment event received but state is not PostsLoaded. Current state: $state');
    }
  }

  Future<void> _onSharePost(SharePost event, Emitter<PostState> emit) async {
    final currentState = state;
    if (currentState is PostsLoaded) {
      try {
        debugPrint('🔄 [PostBloc] Attempting to share post ${event.postId} via API');
        final success = await _postRepository.sharePost(event.postId);

        if (success) {
          debugPrint('✅ [PostBloc] Post ${event.postId} shared successfully via API.');

          // Find the index of the post to update
          final postIndex = currentState.posts.indexWhere((p) => p.id == event.postId);
          if (postIndex == -1) {
            debugPrint('⚠️ [PostBloc] Post ${event.postId} not found in current state after sharing.');
            return; // Post not found
          }

          final originalPost = currentState.posts[postIndex];
          debugPrint('📝 [PostBloc] Original post share count: ${originalPost.sharedCount}');

          // Create the updated post with incremented share count
          final updatedPost = originalPost.copyWith(
            sharedCount: (originalPost.sharedCount ?? 0) + 1,
          );
          debugPrint('📝 [PostBloc] Updated post share count: ${updatedPost.sharedCount}');

          // Create a new list of posts with the updated post
          final updatedPosts = List<PostModel>.from(currentState.posts);
          updatedPosts[postIndex] = updatedPost;

          debugPrint('➡️ [PostBloc] Emitting updated state for share count.');
          // Use copyWith to maintain pagination state
          emit(currentState.copyWith(posts: updatedPosts, freshLoad: false));
          debugPrint('✅ [PostBloc] State emitted with updated share count for post ${event.postId}.');

        } else {
           // This case might not be reachable if repository throws on failure, but included for completeness
           debugPrint('⚠️ [PostBloc] Share API call returned false for post ${event.postId}.');
           // Optionally emit an error or just log
        }

      } catch (e) {
        debugPrint('❌ [PostBloc] Failed to share post ${event.postId} via API: $e');
        // Optionally emit an error state
        emit(PostsError("Failed to share post: ${e.toString()}"));
        // Revert to previous state after showing error briefly
        await Future.delayed(const Duration(milliseconds: 50));
        emit(currentState);
      }
    } else {
       debugPrint('⚠️ [PostBloc] SharePost event received but state is not PostsLoaded. Current state: $state');
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

  Future<void> _onAddCommentReply(AddCommentReply event, Emitter<PostState> emit) async {
    final currentState = state;
    if (currentState is PostsLoaded) {
      try {
        // TODO: Implement API call for adding a reply similar to addComment
        // For now, keeping the local update logic
        debugPrint('📝 [PostBloc] Adding reply locally for comment ${event.parentId} on post ${event.postId}');
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
              // Find the parent comment and add the reply
              Comment updatedComment = _findAndUpdateParentComment(comment, event.parentId, newReply);
              return updatedComment;
            }).toList();

            // Also update the main commentsCount for the post
            return post.copyWith(
              comments: updatedComments,
              commentsCount: (post.commentsCount ?? 0) + 1, // Increment count for the reply
            );
          }
          return post;
        }).toList();

        emit(currentState.copyWith(posts: updatedPosts, freshLoad: false)); // Use copyWith

      } catch (e) {
        debugPrint('❌ [PostBloc] Failed to add reply locally: $e');
        emit(PostsError("Failed to add reply: ${e.toString()}"));
        emit(currentState); // Revert on error
      }
    }
  }

  // Helper function to recursively find and update the parent comment for replies
  Comment _findAndUpdateParentComment(Comment currentComment, String parentId, Comment newReply) {
    if (currentComment.id == parentId) {
      // Found the direct parent, add the reply
      return currentComment.copyWith(
        replies: [...currentComment.replies, newReply],
      );
    } else if (currentComment.replies.isNotEmpty) {
      // Check within the replies of the current comment
      bool replyAdded = false;
      final updatedNestedReplies = currentComment.replies.map((nestedReply) {
        final updatedReply = _findAndUpdateParentComment(nestedReply, parentId, newReply);
        if (updatedReply != nestedReply) {
          replyAdded = true; // Mark if a reply was added deeper in the tree
        }
        return updatedReply;
      }).toList();

      if (replyAdded) {
        // If a reply was added in the nested structure, update this comment's replies
        return currentComment.copyWith(replies: updatedNestedReplies);
      }
    }
    // If not found in this branch, return the comment unchanged
    return currentComment;
  }
}