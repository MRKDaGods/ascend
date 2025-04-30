// filepath: d:\hi\ascend\apps\mobile\ascend_app\lib\features\home\bloc\saved_posts_bloc\saved_posts_bloc.dart
import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart'; // Import PostBloc
import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart' as post_events; // Alias PostBloc events
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/foundation.dart';
import '../../repositories/post_repository.dart';
import '../../models/post_model.dart';
import 'saved_posts_event.dart';
import 'saved_posts_state.dart';

class SavedPostsBloc extends Bloc<SavedPostsEvent, SavedPostsState> {
  final PostRepository _postRepository;
  final PostBloc _postBloc; // Reference to the main PostBloc

  SavedPostsBloc({required PostRepository postRepository, required PostBloc postBloc})
      : _postRepository = postRepository,
        _postBloc = postBloc, // Store PostBloc
        super(SavedPostsInitial()) {
    on<LoadSavedPosts>(_onLoadSavedPosts);
    on<LoadMoreSavedPosts>(_onLoadMoreSavedPosts);
    on<UnsavePostFromSaved>(_onUnsavePostFromSaved);
  }

  Future<void> _onLoadSavedPosts(
      LoadSavedPosts event, Emitter<SavedPostsState> emit) async {
    emit(const SavedPostsLoading()); // Indicate loading start
    try {
      debugPrint('🔄 [SavedPostsBloc] Loading initial saved posts...');
      final result = await _postRepository.fetchSavedPosts(page: 1, limit: 15);
      final posts = result['posts'] as List<PostModel>;
      final currentPage = result['currentPage'] as int;
      final hasMorePages = result['hasMorePages'] as bool;

      debugPrint('✅ [SavedPostsBloc] Initial saved posts loaded: ${posts.length}, HasMore: $hasMorePages');
      emit(SavedPostsLoaded(
        posts: posts,
        currentPage: currentPage,
        hasMorePages: hasMorePages,
      ));
    } catch (e) {
      final errorMessage = 'Failed to load saved posts: $e';
      debugPrint('❌ [SavedPostsBloc] Error loading initial saved posts: $errorMessage');
      emit(SavedPostsError(errorMessage));
    }
  }

  Future<void> _onLoadMoreSavedPosts(
      LoadMoreSavedPosts event, Emitter<SavedPostsState> emit) async {
    // Only load more if the current state is Loaded and has more pages
    if (state is SavedPostsLoaded) {
      final currentState = state as SavedPostsLoaded;

      if (!currentState.hasMorePages) {
        debugPrint(' [SavedPostsBloc] No more saved posts to load.');
        return; // Do nothing if no more pages
      }

      // Emit loading state but keep existing posts
      emit(SavedPostsLoading(posts: currentState.posts));

      try {
        final nextPage = currentState.currentPage + 1;
        debugPrint('🔄 [SavedPostsBloc] Loading more saved posts (page $nextPage)...');
        final result = await _postRepository.fetchSavedPosts(page: nextPage, limit: 15);
        final newPosts = result['posts'] as List<PostModel>;
        final currentPage = result['currentPage'] as int;
        final hasMorePages = result['hasMorePages'] as bool;

        debugPrint('✅ [SavedPostsBloc] More saved posts loaded: ${newPosts.length}, HasMore: $hasMorePages');
        emit(currentState.copyWith(
          posts: List.from(currentState.posts)..addAll(newPosts), // Append new posts
          currentPage: currentPage,
          hasMorePages: hasMorePages,
        ));
      } catch (e) {
         final errorMessage = 'Failed to load more saved posts: $e';
         debugPrint('❌ [SavedPostsBloc] Error loading more saved posts: $errorMessage');
         // Revert to previous loaded state but mark hasMorePages as false to prevent retries
         emit(currentState.copyWith(hasMorePages: false));
         // Optionally emit SavedPostsError state after reverting
         // emit(SavedPostsError(errorMessage));
      }
    } else {
       debugPrint('⚠️ [SavedPostsBloc] LoadMoreSavedPosts called in invalid state: ${state.runtimeType}');
    }
  }

   Future<void> _onUnsavePostFromSaved(
      UnsavePostFromSaved event, Emitter<SavedPostsState> emit) async {
     // Only act if posts are currently loaded
     if (state is SavedPostsLoaded) {
        final currentState = state as SavedPostsLoaded;
        try {
          debugPrint('🔄 [SavedPostsBloc] Handling UnsavePostFromSaved for ${event.postId}.');

          // Optimistically remove the post from the current list
          final updatedPosts = currentState.posts.where((post) => post.id != event.postId).toList();

          // Emit the updated state immediately for responsiveness
          emit(currentState.copyWith(posts: updatedPosts));
          debugPrint('✅ [SavedPostsBloc] Post ${event.postId} removed locally from saved list.');

          // Dispatch the UnsavePost event to the main PostBloc
          // This tells the PostBloc to handle the actual API call and update its own state
          // (e.g., change the bookmark icon on the main feed)
          _postBloc.add(post_events.UnsavePost(event.postId));
          debugPrint('🚀 [SavedPostsBloc] Dispatched UnsavePost event to PostBloc for ${event.postId}.');

          // No need to call _postRepository.unsavePost here, as PostBloc handles it.

        } catch (e) {
           // This catch block might not be strictly necessary if PostBloc handles errors,
           // but good for logging potential issues during state update.
           debugPrint('❌ [SavedPostsBloc] Error during optimistic update/dispatch for unsaving ${event.postId}: $e');
           // Optionally revert the optimistic update if needed, though PostBloc's state should eventually correct it.
           // emit(currentState); // Revert state if optimistic update fails locally
        }
     } else {
        debugPrint('⚠️ [SavedPostsBloc] UnsavePostFromSaved called in invalid state: ${state.runtimeType}');
     }
   }
}