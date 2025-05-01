import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart'; // Alias PostBloc events needed
import 'package:ascend_app/features/home/bloc/post_bloc/post_state.dart';
// Remove SavedPostsBloc imports if no longer needed
// import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_bloc.dart';
// import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_event.dart';
// import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_state.dart';
import 'package:ascend_app/features/home/presentation/utils/sheet_helpers.dart'; // Keep for potential future use?
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../repositories/post_repository.dart'; // Keep this import
import '../widgets/post/post.dart' as post_widget; // Alias Post widget
import '../../models/post_model.dart'; // Import PostModel
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart'; // Import CustomSliverAppBar
import 'package:ascend_app/shared/widgets/app_scaffold.dart'; // Import AppScaffold if needed, or just Scaffold

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
    // Initial load is handled by PostBloc if already loaded,
    // otherwise, consider dispatching LoadPosts if needed specifically for saved posts.
    // For now, assume PostBloc is already populated or will be.
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    // Access PostBloc using context.read
    final postBloc = context.read<PostBloc>();
    final currentState = postBloc.state;

    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 300 &&
        !_isLoadingMore && // Use local loading flag
        currentState is PostsLoaded &&
        currentState.hasMorePages) {
      debugPrint("📜 [SavedPostsPage] Reached end, loading more posts...");
      setState(() {
        _isLoadingMore = true; // Set local loading flag
      });
      postBloc.add(const LoadMorePosts()); // Dispatch event to PostBloc
    }
  }
  @override
  Widget build(BuildContext context) {
    // No need for BlocProvider here if PostBloc is provided higher up the tree
    return Scaffold(
      // Use Scaffold directly or AppScaffold if it provides necessary structure
      appBar: AppBar(
        title: const Text('Saved Posts'),
        elevation: 1,
      ),
      body: BlocConsumer<PostBloc, PostState>(
        listener: (context, state) {
          debugPrint('👂 [SavedPostsPage] Listener received state: ${state.runtimeType}');
          if (state is PostsLoaded) {
             // Reset local loading flag when loading completes
             if (_isLoadingMore) {
               setState(() {
                 _isLoadingMore = false;
               });
             }
             debugPrint('✅ [SavedPostsPage] Loaded state received: ${state.posts.length} total posts, HasMore: ${state.hasMorePages}');
          } else if (state is PostsError) {
            // Reset local loading flag on error
            if (_isLoadingMore) {
               setState(() {
                 _isLoadingMore = false;
               });
             }
            debugPrint('❌ [SavedPostsPage] Error state received: ${state.message}');
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error: ${state.message}')),
            );
          } else if (state is PostsLoading && !_isLoadingMore) {
             // This might indicate a refresh loading, not pagination
             debugPrint('🔄 [SavedPostsPage] Loading state (refresh?) received.');
          }
        },
        builder: (context, state) {
          debugPrint('🏗️ [SavedPostsPage] Builder rebuilding with state: ${state.runtimeType}');

          if (state is PostsInitial || (state is PostsLoading && !_isLoadingMore)) {
            // Show loading indicator for initial load or refresh
            debugPrint('⏳ [SavedPostsPage] Showing Initial/Refresh Loading UI');
            return const Center(child: CircularProgressIndicator());
          }

          if (state is PostsError && state is! PostsLoaded) {
             // Show error only if there are no posts loaded previously
             debugPrint('📊 [SavedPostsPage] Builder showing Error state UI');
             return Center(
               child: Padding(
                 padding: const EdgeInsets.all(16.0),
                 child: Text('Failed to load posts.\n${state.message}'),
               ),
             );
          }

          // Handle PostsLoaded state (including when loading more)
          if (state is PostsLoaded) {
            // Filter posts to show only saved ones
            final savedPosts = state.posts.where((post) => post.isSaved).toList();
            final hasMorePages = state.hasMorePages; // Get pagination status from PostBloc state

            debugPrint('📊 [SavedPostsPage] Builder using Loaded state: ${savedPosts.length} saved posts found, HasMore: $hasMorePages');

            if (savedPosts.isEmpty && !_isLoadingMore) {
              debugPrint('ℹ️ [SavedPostsPage] Showing Empty state UI');
              return RefreshIndicator( // Allow refresh even when empty
                 onRefresh: () async {
                   debugPrint('🔄 [SavedPostsPage] Refresh triggered. Adding LoadPosts.');
                   context.read<PostBloc>().add(const LoadPosts());
                   await context.read<PostBloc>().stream.firstWhere((s) => s is! PostsLoading);
                   debugPrint('🏁 [SavedPostsPage] Refresh completed.');
                 },
                 child: LayoutBuilder( // Ensure RefreshIndicator works with SingleChildScrollView
                   builder: (context, constraints) {
                     return SingleChildScrollView(
                       physics: const AlwaysScrollableScrollPhysics(),
                       child: ConstrainedBox(
                         constraints: BoxConstraints(minHeight: constraints.maxHeight),
                         child: const Center(child: Text('You haven\'t saved any posts yet.')),
                       ),
                     );
                   }
                 ),
              );
            }

            // Build the list view
            debugPrint('🧱 [SavedPostsPage] Building RefreshIndicator and CustomScrollView...');
            return RefreshIndicator(
              onRefresh: () async {
                debugPrint('🔄 [SavedPostsPage] Refresh triggered. Adding LoadPosts.');
                context.read<PostBloc>().add(const LoadPosts());
                // Wait for the state to settle after refresh
                await context.read<PostBloc>().stream.firstWhere((s) => s is! PostsLoading);
                debugPrint('🏁 [SavedPostsPage] Refresh completed.');
              },
              child: CustomScrollView( // Use CustomScrollView like in home.dart
                controller: _scrollController,
                slivers: [
                  // Add other slivers if needed (like a custom app bar)
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        // Loading indicator at the bottom
                        if (index >= savedPosts.length) {
                          // Show indicator if loading more OR if there are more pages potentially available
                          if (_isLoadingMore || hasMorePages) {
                            debugPrint('🔄 [SavedPostsPage] Displaying loading indicator at bottom.');
                            return const Padding(
                              padding: EdgeInsets.symmetric(vertical: 20.0),
                              child: Center(child: CircularProgressIndicator()),
                            );
                          } else {
                            debugPrint('🛑 [SavedPostsPage] Reached end, no more pages or not loading.');
                            return const SizedBox.shrink(); // No more pages and not loading
                          }
                        }

                        // Saved Post Item
                        final post = savedPosts[index];
                        // Use the standard Post widget. It will handle its own options menu.
                        return Column(
                          children: [
                            post_widget.Post(postId: post.id),
                            const Divider(height: 1, thickness: 1),
                          ],
                        );
                      },
                      // Adjust childCount based on whether loading indicator might be shown
                      childCount: savedPosts.length + (_isLoadingMore || hasMorePages ? 1 : 0),
                    ),
                  ),
                ],
              ),
            );
          }

          // Fallback for unexpected states
          return const Center(child: Text('An unexpected error occurred.'));
        },
      ),
    );
  }
}