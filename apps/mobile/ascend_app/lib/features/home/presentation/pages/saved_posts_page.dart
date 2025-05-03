import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_bloc.dart';
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_event.dart';
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_state.dart';
import 'package:ascend_app/features/home/models/post_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../widgets/post/post.dart' as post_widget; // Alias Post widget

class SavedPostsPage extends StatefulWidget {
  const SavedPostsPage({super.key});

  @override
  State<SavedPostsPage> createState() => _SavedPostsPageState();
}

class _SavedPostsPageState extends State<SavedPostsPage> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoadingMore = false; // Track loading state locally

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    // Initial load is handled by SavedPostsBloc
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        debugPrint('🔄 [SavedPostsPage] Dispatching initial LoadSavedPosts.');
        context.read<SavedPostsBloc>().add(const LoadSavedPosts());
      }
    });
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    final savedPostsBloc = context.read<SavedPostsBloc>();
    final currentState = savedPostsBloc.state;

    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 300 &&
        !_isLoadingMore && // Use local loading flag
        currentState is SavedPostsLoaded &&
        currentState.hasMorePages) {
      debugPrint("📜 [SavedPostsPage] Reached end, loading more saved posts...");
      setState(() {
        _isLoadingMore = true; // Set local loading flag
      });
      savedPostsBloc.add(const LoadMoreSavedPosts());
    }
  }
  @override
  Widget build(BuildContext context) {
    // Ensure SavedPostsBloc is provided higher up the tree (e.g., in main.dart or a route generator)
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Posts'), elevation: 1),
      // --- MODIFICATION START: Use SavedPostsBloc ---
      body: BlocConsumer<SavedPostsBloc, SavedPostsState>(
      // --- MODIFICATION END ---
        listener: (context, state) {
          debugPrint(
            '👂 [SavedPostsPage] Listener received state: ${state.runtimeType}',
          );
          // --- MODIFICATION START: Check SavedPostsLoaded/Error states ---
          if (state is SavedPostsLoaded) {
          // --- MODIFICATION END ---
            // Reset local loading flag when loading completes
            if (_isLoadingMore) {
              setState(() {
                _isLoadingMore = false;
              });
            }
            debugPrint(
              // --- MODIFICATION START: Log SavedPostsLoaded details ---
              '✅ [SavedPostsPage] Loaded state received: ${state.posts.length} saved posts, HasMore: ${state.hasMorePages}',
              // --- MODIFICATION END ---
            );
          // --- MODIFICATION START: Check SavedPostsError state ---
          } else if (state is SavedPostsError) {
          // --- MODIFICATION END ---
            // Reset local loading flag on error
            if (_isLoadingMore) {
              setState(() {
                _isLoadingMore = false;
              });
            }
            debugPrint(
              '❌ [SavedPostsPage] Error state received: ${state.message}',
            );
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text('Error: ${state.message}')));
          // --- MODIFICATION START: Check SavedPostsLoading state ---
          } else if (state is SavedPostsLoading && !_isLoadingMore) {
          // --- MODIFICATION END ---
            // This might indicate a refresh loading, not pagination
            debugPrint(
              '🔄 [SavedPostsPage] Loading state (refresh?) received.',
            );
          }
        },
        builder: (context, state) {
          debugPrint(
            '🏗️ [SavedPostsPage] Builder rebuilding with state: ${state.runtimeType}',
          );

          // --- MODIFICATION START: Check SavedPostsInitial/Loading states ---
          if (state is SavedPostsInitial ||
              (state is SavedPostsLoading && state.posts.isEmpty && !_isLoadingMore)) {
          // --- MODIFICATION END ---
            // Show loading indicator for initial load or refresh when list is empty
            debugPrint('⏳ [SavedPostsPage] Showing Initial/Refresh Loading UI');
            return const Center(child: CircularProgressIndicator());
          }

          // --- MODIFICATION START: Check SavedPostsError state ---
          if (state is SavedPostsError && state is! SavedPostsLoaded) {
          // --- MODIFICATION END ---
            // Show error only if there are no posts loaded previously
            debugPrint('📊 [SavedPostsPage] Builder showing Error state UI');
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text('Failed to load posts.\n${state.message}'),
              ),
            );
          }

          // --- MODIFICATION START: Handle SavedPostsLoaded and SavedPostsLoading (for pagination) ---
          List<PostModel> savedPosts = [];
          bool hasMorePages = false;
          bool isCurrentlyLoading = false; // Track if the state itself is loading

          if (state is SavedPostsLoaded) {
            savedPosts = state.posts;
            hasMorePages = state.hasMorePages;
            isCurrentlyLoading = false;
          } else if (state is SavedPostsLoading) {
            // If loading more, show existing posts + indicator
            savedPosts = state.posts;
            hasMorePages = true; // Assume more pages while loading
            isCurrentlyLoading = true;
          }
          // --- MODIFICATION END ---

          debugPrint(
            // --- MODIFICATION START: Log details from SavedPostsBloc state ---
            '📊 [SavedPostsPage] Builder using state: ${savedPosts.length} saved posts found, HasMore: $hasMorePages, IsLoading: $isCurrentlyLoading',
            // --- MODIFICATION END ---
          );

          // --- MODIFICATION START: Check for empty list based on SavedPostsBloc state ---
          if (savedPosts.isEmpty && !isCurrentlyLoading && !_isLoadingMore) {
          // --- MODIFICATION END ---
            debugPrint('ℹ️ [SavedPostsPage] Showing Empty state UI');
            return RefreshIndicator(
              onRefresh: () async {
                debugPrint(
                  '🔄 [SavedPostsPage] Refresh triggered. Adding LoadSavedPosts.',
                );
                // --- MODIFICATION START: Dispatch LoadSavedPosts ---
                context.read<SavedPostsBloc>().add(const LoadSavedPosts());
                await context.read<SavedPostsBloc>().stream.firstWhere(
                      (s) => s is! SavedPostsLoading, // Wait for loading to finish
                    );
                // --- MODIFICATION END ---
                debugPrint('🏁 [SavedPostsPage] Refresh completed.');
              },
              child: LayoutBuilder(
                builder: (context, constraints) {
                  return SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minHeight: constraints.maxHeight,
                      ),
                      child: const Center(
                        child: Text('You haven\'t saved any posts yet.'),
                      ),
                    ),
                  );
                },
              ),
            );
          }

          // Build the list view
          debugPrint(
            '🧱 [SavedPostsPage] Building RefreshIndicator and CustomScrollView...',
          );
          return RefreshIndicator(
            onRefresh: () async {
              debugPrint(
                '🔄 [SavedPostsPage] Refresh triggered. Adding LoadSavedPosts.',
              );
              // --- MODIFICATION START: Dispatch LoadSavedPosts ---
              context.read<SavedPostsBloc>().add(const LoadSavedPosts());
              await context.read<SavedPostsBloc>().stream.firstWhere(
                    (s) => s is! SavedPostsLoading, // Wait for loading to finish
                  );
              // --- MODIFICATION END ---
              debugPrint('🏁 [SavedPostsPage] Refresh completed.');
            },
            child: CustomScrollView(
              controller: _scrollController,
              slivers: [
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      // Loading indicator at the bottom
                      if (index >= savedPosts.length) {
                        // --- MODIFICATION START: Show indicator if loading more OR if state is loading ---
                        if (_isLoadingMore || isCurrentlyLoading) {
                        // --- MODIFICATION END ---
                          debugPrint(
                            '🔄 [SavedPostsPage] Displaying loading indicator at bottom.',
                          );
                          return const Padding(
                            padding: EdgeInsets.symmetric(vertical: 20.0),
                            child: Center(child: CircularProgressIndicator()),
                          );
                        } else {
                          debugPrint(
                            '🛑 [SavedPostsPage] Reached end, no more pages or not loading.',
                          );
                          return const SizedBox.shrink(); // No more pages and not loading
                        }
                      }

                      // Saved Post Item
                      final post = savedPosts[index];
                      // --- MODIFICATION START: Use Post widget, but ensure it gets updates from PostBloc if needed ---
                      // The Post widget itself relies on PostBloc for reactions, etc.
                      // This might require providing PostBloc higher up if not already done.
                      // The SavedPostsBloc only provides the list of *which* posts are saved.
                      // The Post widget needs the postId to fetch its full details from PostBloc's state.
                      return Column(
                        children: [
                          // Ensure PostBloc is available to the Post widget
                          post_widget.Post(postId: post.id),
                          const Divider(height: 1, thickness: 1),
                        ],
                      );
                      // --- MODIFICATION END ---
                    },
                    // --- MODIFICATION START: Adjust childCount based on loading state ---
                    childCount: savedPosts.length + ((_isLoadingMore || isCurrentlyLoading) ? 1 : 0),
                    // --- MODIFICATION END ---
                  ),
                ),
              ],
            ),
          );
          // --- REMOVED Fallback for unexpected states, handled by BlocConsumer ---
          // return const Center(child: Text('An unexpected error occurred.'));
        },
      ),
    );
  }
}
