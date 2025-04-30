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
    on<SavePost>(_onSavePost);
    on<UnsavePost>(_onUnsavePost);
    on<ReportPost>(_onReportPost);
    on<AddNewPost>(_onAddNewPost);
    on<LoadComments>(_onLoadComments); // Register the new handler
  }

  Future<void> _onLoadPosts(LoadPosts event, Emitter<PostState> emit) async {
    emit(PostsLoading());
    try {
      debugPrint('🔄 [PostBloc] Attempting to load initial posts (page 1)...');
      // Fetch page 1 explicitly
      final result = await _postRepository.fetchFeed(page: 1, limit: 15);
      final rawPosts = result['posts'] as List<PostModel>; // Renamed to rawPosts
      final currentPage = result['currentPage'] as int;
      final hasMorePages = result['hasMorePages'] as bool;

      debugPrint('✅ [PostBloc] Initial raw posts loaded: ${rawPosts.length}. Fetching reactions...');

      // Fetch reactions for all posts in parallel
      final reactionFutures = rawPosts.map((post) => _postRepository.getPostReaction(post.id)).toList();
      final reactions = await Future.wait(reactionFutures);

      // Update posts with fetched reactions
      final postsWithReactions = <PostModel>[];
      for (int i = 0; i < rawPosts.length; i++) {
        // Assuming PostModel has copyWith and currentReaction field
        postsWithReactions.add(rawPosts[i].copyWith(currentReaction: reactions[i]));
      }
      debugPrint('✅ [PostBloc] Reactions fetched. Updated ${postsWithReactions.length} posts.');


      emit(PostsLoaded(
        postsWithReactions, // Emit posts with updated reactions
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
        final newRawPosts = result['posts'] as List<PostModel>; // Renamed to newRawPosts
        final currentPage = result['currentPage'] as int;
        final hasMorePages = result['hasMorePages'] as bool;

        debugPrint('✅ [PostBloc] More raw posts loaded: ${newRawPosts.length}. Fetching reactions...');

        // Fetch reactions for the new posts in parallel
        final reactionFutures = newRawPosts.map((post) => _postRepository.getPostReaction(post.id)).toList();
        final reactions = await Future.wait(reactionFutures);

        // Update new posts with fetched reactions
        final newPostsWithReactions = <PostModel>[];
        for (int i = 0; i < newRawPosts.length; i++) {
          newPostsWithReactions.add(newRawPosts[i].copyWith(currentReaction: reactions[i]));
        }
        debugPrint('✅ [PostBloc] Reactions fetched for new posts. Updated ${newPostsWithReactions.length} posts.');


        // Combine with existing posts, ensuring no duplicates
        final combinedPosts = List<PostModel>.from(currentState.posts);
        final existingPostIds = currentState.posts.map((p) => p.id).toSet();
        for (var newPost in newPostsWithReactions) { // Use posts with reactions
          if (!existingPostIds.contains(newPost.id)) {
            combinedPosts.add(newPost);
            existingPostIds.add(newPost.id);
          } else {
            debugPrint(' [PostBloc] Duplicate post ID found and skipped: ${newPost.id}');
          }
        }

        // Add a 1-second delay before emitting the new state (optional, kept from previous code)
        // await Future.delayed(const Duration(seconds: 1)); // Removed delay for faster loading

        // Emit updated state
        emit(currentState.copyWith(
          posts: combinedPosts, // Emit combined list with updated reactions
          freshLoad: false,
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
    final currentState = state;
    if (currentState is PostsLoaded) {
      // Store the original state before optimistic update
      final originalPosts = List<PostModel>.from(currentState.posts);
      final originalState = currentState.copyWith(posts: originalPosts); // Keep a copy

      // Optimistic UI update first
      final postIndex = currentState.posts.indexWhere((p) => p.id == event.postId);
      if (postIndex == -1) {
        debugPrint('⚠️ [PostBloc] Post ${event.postId} not found for reaction toggle.');
         return; // Post not found
      }
      final originalPost = currentState.posts[postIndex];
      // Use the PostModel's logic to get the updated state
      final optimisticallyUpdatedPost = originalPost.toggleReaction(event.reactionType);
      final optimisticPosts = List<PostModel>.from(currentState.posts);
      optimisticPosts[postIndex] = optimisticallyUpdatedPost;
      // Emit the optimistic state immediately
      emit(currentState.copyWith(posts: optimisticPosts, freshLoad: false));
      debugPrint('🔄 [PostBloc] Optimistically updated reaction for post ${event.postId} to ${event.reactionType}');


      try {
        // Call the repository to update the backend
        debugPrint('📡 [PostBloc] Calling repository togglePostReaction for post ${event.postId}, type: ${event.reactionType}');
        final success = await _postRepository.togglePostReaction(event.postId, event.reactionType);

        if (success) {
          debugPrint('✅ [PostBloc] API call successful for togglePostReaction post ${event.postId}. State already updated optimistically.');
          // State is already updated optimistically. No need to emit again unless API returns different data.
        } else {
          // This case might not be reached if repository throws on failure
          debugPrint('⚠️ [PostBloc] API call togglePostReaction returned false for post ${event.postId}. Reverting optimistic update.');
          // Revert the optimistic update by emitting the original state
          emit(originalState);
        }
      } catch (e) {
        debugPrint('❌ [PostBloc] Error during togglePostReaction API call for post ${event.postId}: $e. Reverting optimistic update.');
        // Revert the optimistic update on error
        emit(originalState); // Emit the original state before the optimistic update
        // Optionally emit a specific error state *after* reverting, maybe with a delay
        // emit(PostsError('Failed to update reaction: $e'));
        // await Future.delayed(const Duration(milliseconds: 50));
        // emit(originalState); // Re-emit original state again if needed after error display
      }
    } else {
       debugPrint('⚠️ [PostBloc] TogglePostReaction event received but state is not PostsLoaded.');
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
        debugPrint('🔄 [PostBloc] Handling AddCommentReply. Parent Comment ID from event: ${event.parentCommentId}');
        // Call the repository to add the reply via API
        final newReply = await _postRepository.addComment(
          event.postId,
          event.text,
          event.authorId,
          event.authorName,
          event.authorImageUrl,
          event.parentCommentId,
        );
        debugPrint('✅ [PostBloc] Reply added via API: ${newReply.id}, Text: ${newReply.text}');

        // Find the index of the post to update
        final postIndex = currentState.posts.indexWhere((p) => p.id == event.postId);
        if (postIndex == -1) {
          debugPrint('⚠️ [PostBloc] Post ${event.postId} not found in current state after adding reply.');
          return; // Post not found
        }

        final originalPost = currentState.posts[postIndex];
        debugPrint('📝 [PostBloc] Original post comments count: ${originalPost.commentsCount}, comments list size: ${originalPost.comments.length}');
        debugPrint('📝 [PostBloc] Original top-level comments: ${originalPost.comments.map((c) => 'ID: ${c.id}, Replies: ${c.replies.length}').join(', ')}');


        // Recursively find the parent comment and add the reply
        final List<Comment> updatedComments = originalPost.comments.map((comment) {
           debugPrint('🗺️ [PostBloc] Mapping top-level comment ${comment.id}...');
           final updatedComment = _findAndUpdateParentComment(comment, event.parentCommentId, newReply);
           // Log whether the comment object instance changed after the helper call
           debugPrint('🗺️ [PostBloc] Comment ${comment.id} processed. Instance changed: ${!identical(updatedComment, comment)}');
           return updatedComment;
        }).toList();

        // Log the state of updatedComments *after* the map operation
        debugPrint('📝 [PostBloc] Resulting updatedComments list size: ${updatedComments.length}');
        debugPrint('📝 [PostBloc] Resulting updatedComments content: ${updatedComments.map((c) => 'ID: ${c.id}, Replies: ${c.replies.length}').join(', ')}');


        // Create the updated post
        final updatedPost = originalPost.copyWith(
          comments: updatedComments, // Use the result from the map
          commentsCount: (originalPost.commentsCount ?? 0) + 1,
        );
        debugPrint('📝 [PostBloc] Updated post comments count: ${updatedPost.commentsCount}, comments list size: ${updatedPost.comments.length}');
        final updatedPosts = List<PostModel>.from(currentState.posts);
        updatedPosts[postIndex] = updatedPost;
        debugPrint('➡️ [PostBloc] Emitting updated state with new reply.');
        emit(currentState.copyWith(posts: updatedPosts, freshLoad: false)); // Use copyWith to maintain pagination state
        debugPrint('✅ [PostBloc] State emitted with updated reply list for post ${event.postId}.');

      } catch (e) {
        debugPrint('❌ [PostBloc] Failed to add reply via API: $e');
        emit(PostsError("Failed to add reply: ${e.toString()}"));
        // Optionally re-emit the current state to avoid UI freeze on error
        await Future.delayed(const Duration(milliseconds: 50)); // Short delay before reverting
        emit(currentState);
      }
    } else {
      debugPrint('⚠️ [PostBloc] AddCommentReply event received but state is not PostsLoaded. Current state: $state');
    }
  }

  // Helper function to recursively find and update the parent comment for replies
  Comment _findAndUpdateParentComment(Comment currentComment, String parentCommentId, Comment newReply, {int depth = 0}) { // Add depth for logging
    String indent = '  ' * depth;
    debugPrint('$indent🔍 [Helper] Checking comment ${currentComment.id} against parentId $parentCommentId');

    if (currentComment.id == parentCommentId) {
      debugPrint('$indent✅ [Helper] Found direct parent ${currentComment.id}. Adding reply ${newReply.id}.');
      // Found the direct parent, add the reply
      final updatedComment = currentComment.copyWith(
        replies: [...currentComment.replies, newReply],
      );
      debugPrint('$indent  [Helper] Parent ${currentComment.id} now has ${updatedComment.replies.length} replies.');
      return updatedComment; // Return the NEW object
    } else if (currentComment.replies.isNotEmpty) {
      debugPrint('$indent➡️ [Helper] Comment ${currentComment.id} is not parent. Checking its ${currentComment.replies.length} replies...');
      // Check within the replies of the current comment
      bool replyAddedDeep = false; // Renamed to avoid confusion
      final updatedNestedReplies = currentComment.replies.map((nestedReply) {
        final updatedReplyResult = _findAndUpdateParentComment(nestedReply, parentCommentId, newReply, depth: depth + 1); // Recursive call
        // Check if the recursive call returned a *new* object instance
        if (identical(updatedReplyResult, nestedReply)) {
           // No change deeper down this path
        } else {
           debugPrint('$indent  [Helper] Reply ${nestedReply.id} was updated in recursive call.');
           replyAddedDeep = true; // Mark if a reply was added deeper in the tree
        }
        return updatedReplyResult; // Use the result from the recursive call
      }).toList();

      if (replyAddedDeep) {
        debugPrint('$indent⬆️ [Helper] Reply was added deeper. Updating replies for comment ${currentComment.id}.');
        // If a reply was added in the nested structure, update this comment's replies
        return currentComment.copyWith(replies: updatedNestedReplies); // Return the NEW object with updated nested replies
      } else {
         debugPrint('$indent🤷 [Helper] Reply not found deeper in comment ${currentComment.id}\'s replies.');
         // If no change happened deeper, return the original comment
         return currentComment;
      }
    }
    // If not found in this branch (not the parent and no replies to check), return the comment unchanged
    debugPrint('$indent❌ [Helper] Comment ${currentComment.id} is not parent and has no replies. Returning unchanged.');
    return currentComment;
  }

  // Handler for SavePost event (with Optimistic Update)
  Future<void> _onSavePost(SavePost event, Emitter<PostState> emit) async {
    final currentState = state;
    if (currentState is PostsLoaded) {
      // Store the original state before optimistic update
      final originalState = currentState; // Keep a reference

      // Optimistic UI update first
      final postIndex = currentState.posts.indexWhere((p) => p.id == event.postId);
      if (postIndex == -1) {
        debugPrint('⚠️ [PostBloc] Post ${event.postId} not found for saving.');
         return; // Post not found
      }

      // Create updated post list with isSaved = true
      final optimisticPosts = List<PostModel>.from(currentState.posts);
      // Ensure the post exists before trying to update
      if (postIndex < optimisticPosts.length) {
         optimisticPosts[postIndex] = optimisticPosts[postIndex].copyWith(isSaved: true);
      } else {
         debugPrint('Error: Post index out of bounds during optimistic save.');
         return; // Avoid index error
      }


      // Emit the optimistic state immediately
      // Use copyWith on the original state to preserve pagination etc.
      emit(originalState.copyWith(posts: optimisticPosts, freshLoad: false));
      debugPrint('🔄 [PostBloc] Optimistically marked post ${event.postId} as saved.');

      try {
        // Call the repository to update the backend
        debugPrint('📡 [PostBloc] Calling repository savePost for post ${event.postId}');
        final success = await _postRepository.savePost(event.postId);

        if (success) {
          debugPrint('✅ [PostBloc] API call successful for savePost ${event.postId}. State already updated optimistically.');
          // State is already updated optimistically. No need to emit again.
        } else {
          // This case might not be reached if repository throws on failure
          debugPrint('❌ [PostBloc] API call savePost returned false for post ${event.postId}. Reverting optimistic update.');
          // Revert the optimistic update by emitting the original state
          emit(originalState);
        }
      } catch (e) {
        debugPrint('❌ [PostBloc] Error during savePost API call for post ${event.postId}: $e. Reverting optimistic update.');
        // Revert the optimistic update on error
        emit(originalState); // Emit the original state before the optimistic update
        // Optionally emit a specific error state *after* reverting
        // emit(PostsError('Failed to save post: $e'));
      }
    } else {
       debugPrint('⚠️ [PostBloc] SavePost event received but state is not PostsLoaded.');
    }
  }

  // Handler for UnsavePost event (with Optimistic Update)
  Future<void> _onUnsavePost(UnsavePost event, Emitter<PostState> emit) async {
    final currentState = state;
    if (currentState is PostsLoaded) {
      // Store the original state before optimistic update
      final originalState = currentState; // Keep a reference

      // Optimistic UI update first
      final postIndex = currentState.posts.indexWhere((p) => p.id == event.postId);
      if (postIndex == -1) {
        debugPrint('⚠️ [PostBloc] Post ${event.postId} not found for unsaving.');
         return; // Post not found
      }

      // Create updated post list with isSaved = false
      final optimisticPosts = List<PostModel>.from(currentState.posts);
       // Ensure the post exists before trying to update
      if (postIndex < optimisticPosts.length) {
         optimisticPosts[postIndex] = optimisticPosts[postIndex].copyWith(isSaved: false);
      } else {
         debugPrint('Error: Post index out of bounds during optimistic unsave.');
         return; // Avoid index error
      }


      // Emit the optimistic state immediately
      // Use copyWith on the original state to preserve pagination etc.
      emit(originalState.copyWith(posts: optimisticPosts, freshLoad: false));
      debugPrint('🔄 [PostBloc] Optimistically marked post ${event.postId} as unsaved.');

      try {
        // Call the repository to update the backend
        debugPrint('📡 [PostBloc] Calling repository unsavePost for post ${event.postId}');
        final success = await _postRepository.unsavePost(event.postId);

        if (success) {
          debugPrint('✅ [PostBloc] API call successful for unsavePost ${event.postId}. State already updated optimistically.');
          // State is already updated optimistically. No need to emit again.
        } else {
          // This case might not be reached if repository throws on failure
          debugPrint('❌ [PostBloc] API call unsavePost returned false for post ${event.postId}. Reverting optimistic update.');
          // Revert the optimistic update by emitting the original state
          emit(originalState);
        }
      } catch (e) {
        debugPrint('❌ [PostBloc] Error during unsavePost API call for post ${event.postId}: $e. Reverting optimistic update.');
        // Revert the optimistic update on error
        emit(originalState); // Emit the original state before the optimistic update
        // Optionally emit a specific error state *after* reverting
        // emit(PostsError('Failed to unsave post: $e'));
      }
    } else {
       debugPrint('⚠️ [PostBloc] UnsavePost event received but state is not PostsLoaded.');
    }
  }

  // Handler for ReportPost event
  Future<void> _onReportPost(ReportPost event, Emitter<PostState> emit) async {
    final currentState = state;
    // No need to check for PostsLoaded specifically, as reporting doesn't modify the list directly here
    try {
      debugPrint('🔄 [PostBloc] Attempting to report post ${event.postId} via API with reason: ${event.reason}');
      final success = await _postRepository.reportPost(event.postId, event.reason);

      if (success) {
        debugPrint('✅ [PostBloc] Post ${event.postId} reported successfully via API.');
        // Optionally emit a success state if needed for UI feedback beyond the SnackBar
        // emit(PostActionSuccess(currentState.posts, 'Post reported successfully.', currentState.currentPage, currentState.hasMorePages));
      } else {
        // This case might not be reachable if repository throws on failure
        debugPrint('⚠️ [PostBloc] Report API call returned false for post ${event.postId}.');
        // Optionally emit an error state
        if (currentState is PostsLoaded) {
          emit(PostsError("Failed to report post (API returned false)"));
          await Future.delayed(const Duration(milliseconds: 50));
           emit(currentState); // Revert
        }
      }
    } catch (e) {
      debugPrint('❌ [PostBloc] Failed to report post ${event.postId} via API: $e');
      // Emit an error state
      if (currentState is PostsLoaded) {
        emit(PostsError("Failed to report post: ${e.toString()}"));
        await Future.delayed(const Duration(milliseconds: 50));
         emit(currentState); // Revert state on error
      } else {
         // If not PostsLoaded, emit a general error
        emit(PostsError("Failed to report post: ${e.toString()}"));
      }
    }
  }

  // Handler for AddNewPost event
  void _onAddNewPost(AddNewPost event, Emitter<PostState> emit) {
    final currentState = state;
    if (currentState is PostsLoaded) {
      debugPrint('🔄 [PostBloc] Adding newly created post ${event.newPost.id} to the state.');
      // Prepend the new post to the list
      final updatedPosts = [event.newPost, ...currentState.posts];
      // Emit the updated state, preserving pagination info
      emit(currentState.copyWith(
        posts: updatedPosts,
        freshLoad: false, // Indicate it's not a full refresh
      ));
      debugPrint('✅ [PostBloc] State updated with new post prepended.');
    } else {
      // If posts are not loaded yet, maybe trigger a load? Or ignore?
      debugPrint('⚠️ [PostBloc] AddNewPost received but state is not PostsLoaded. Ignoring.');
    }
  }

  Future<void> _onLoadComments(LoadComments event, Emitter<PostState> emit) async {
    final currentState = state;
    if (currentState is PostsLoaded) {
      try {
        debugPrint('🔄 [PostBloc] Attempting to load ALL comments and replies for post ${event.postId}');
        // Fetch ALL comments and replies from the repository
        final List<Comment> allComments = await _postRepository.fetchComments(
          event.postId,
        );
        debugPrint('✅ [PostBloc] Fetched ${allComments.length} total comments/replies for post ${event.postId}. Structuring...');

        // --- Structure comments into hierarchy ---
        final Map<String, Comment> commentMap = {}; // For quick lookup
        final List<Comment> topLevelComments = []; // Only comments without a parentId

        // First pass: Populate map and identify top-level comments
        for (final comment in allComments) {
          commentMap[comment.id] = comment.copyWith(replies: []); // Initialize replies list
          if (comment.parentId == null || comment.parentId!.isEmpty) {
            topLevelComments.add(commentMap[comment.id]!); // Add the mutable copy
          }
        }

        // Second pass: Assign replies to their parents
        for (final comment in allComments) {
          if (comment.parentId != null && comment.parentId!.isNotEmpty) {
            final parentComment = commentMap[comment.parentId!];
            if (parentComment != null) {
              // Add the current comment (which is a reply) to its parent's replies list
              // Ensure we are modifying the comment object within the map
              final replyToAdd = commentMap[comment.id]!;
              final updatedReplies = List<Comment>.from(parentComment.replies)..add(replyToAdd);
               // Update the parent comment in the map with the new replies list
              commentMap[comment.parentId!] = parentComment.copyWith(replies: updatedReplies);

              // Important: If a top-level comment was initially added and later found
              // to be a parent, we need to ensure the topLevelComments list
              // references the *updated* parent from the map.
              final indexInTopLevel = topLevelComments.indexWhere((c) => c.id == parentComment.id);
              if (indexInTopLevel != -1) {
                  topLevelComments[indexInTopLevel] = commentMap[parentComment.id]!;
              }
              // We also need to handle nested replies updating their parents which might not be top-level
              // This recursive update isn't fully handled here, assuming _findAndUpdateParentComment logic handles deeper nesting if needed elsewhere.
              // For load comments, we rebuild the structure directly.

            } else {
              debugPrint('⚠️ [PostBloc] Parent comment ${comment.parentId} not found for reply ${comment.id}. Adding as top-level.');
              // Fallback: If parent isn't found (e.g., deleted), add as a top-level comment.
              // This might indicate data inconsistency.
              if (!topLevelComments.any((c) => c.id == comment.id)) {
                 topLevelComments.add(commentMap[comment.id]!);
              }
            }
          }
        }
        // Optional: Sort top-level comments and replies if needed (e.g., by timestamp)
        // topLevelComments.sort((a, b) => a.createdAt.compareTo(b.createdAt));
        // commentMap.values.forEach((comment) {
        //   comment.replies.sort((a, b) => a.createdAt.compareTo(b.createdAt));
        // });
        // --- End structuring ---


        debugPrint('✅ [PostBloc] Structured comments. Top-level: ${topLevelComments.length}');

        // Find the index of the post to update
        final postIndex = currentState.posts.indexWhere((p) => p.id == event.postId);
        if (postIndex == -1) {
          debugPrint('⚠️ [PostBloc] Post ${event.postId} not found in state while loading comments.');
          return; // Post not found
        }

        final originalPost = currentState.posts[postIndex];

        // Replace the comments list with the structured top-level comments
        final List<Comment> updatedCommentList = topLevelComments;
        debugPrint('📝 [PostBloc] Replacing comments for post ${event.postId}. New top-level count: ${updatedCommentList.length}, Total count remains: ${allComments.length}');


        // Create the updated post
        // Update the comments list with the structured list.
        // Keep commentsCount as the total number of comments and replies fetched.
        final updatedPost = originalPost.copyWith(
          comments: updatedCommentList, // Use the structured list
          commentsCount: allComments.length, // Reflect total count including replies
        );

        // Create a new list of posts with the updated post
        final updatedPosts = List<PostModel>.from(currentState.posts);
        updatedPosts[postIndex] = updatedPost;

        debugPrint('➡️ [PostBloc] Emitting state with structured comments for post ${event.postId}.');
        // Emit the new state, preserving pagination etc.
        emit(currentState.copyWith(posts: updatedPosts, freshLoad: false));
        debugPrint('✅ [PostBloc] State emitted with structured comments for post ${event.postId}.');

      } catch (e, stackTrace) { // Catch stack trace for better debugging
        debugPrint('❌ [PostBloc] Failed to load or structure comments for post ${event.postId}: $e\n$stackTrace');
        // Optionally emit an error state, but keep the existing posts
        emit(PostsError("Failed to load comments: ${e.toString()}"));
        await Future.delayed(const Duration(milliseconds: 50)); // Brief delay
        emit(currentState); // Re-emit current state
      }
    } else {
      debugPrint('⚠️ [PostBloc] LoadComments event received but state is not PostsLoaded.');
      // Optionally load initial posts if state is not loaded?
      // add(const LoadPosts());
    }
  }
}

extension PostsLoadedExtension on PostsLoaded {
  PostModel? getPostById(String id) {
    try {
      return posts.firstWhere((post) => post.id == id);
    } catch (e) {
      return null;
    }
  }
}