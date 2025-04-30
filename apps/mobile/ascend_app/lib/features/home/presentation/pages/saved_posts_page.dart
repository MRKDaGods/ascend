import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart' as post_events; // Alias PostBloc events
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_bloc.dart';
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_event.dart';
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_state.dart';
import 'package:ascend_app/features/home/presentation/utils/sheet_helpers.dart'; // If needed for options
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../repositories/post_repository.dart';
import '../widgets/post/post.dart' as post_widget; // Alias Post widget

import '../../models/post_model.dart'; // Import PostModel

class SavedPostsPage extends StatefulWidget {
  const SavedPostsPage({super.key});

  @override
  State<SavedPostsPage> createState() => _SavedPostsPageState();
}

class _SavedPostsPageState extends State<SavedPostsPage> {
  final ScrollController _scrollController = ScrollController();
  late SavedPostsBloc _savedPostsBloc;

  @override
  void initState() {
    super.initState();
    // Access dependencies using context.read (safer in initState)
    // This still assumes the providers are ancestors in the widget tree.
    final postBloc = context.read<PostBloc>();
    final postRepository = context.read<PostRepository>(); // Use context.read

    // Create SavedPostsBloc, injecting dependencies
    _savedPostsBloc = SavedPostsBloc(
      postRepository: postRepository,
      postBloc: postBloc, // Provide PostBloc for coordination
    );

    // Load initial posts
    _savedPostsBloc.add(const LoadSavedPosts());

    // Setup scroll listener for pagination
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _savedPostsBloc.close(); // Close the bloc when the page is disposed
    super.dispose();
  }

  void _onScroll() {
    // Check if near the bottom and more pages exist
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 300 && // Trigger slightly earlier
        _savedPostsBloc.state is SavedPostsLoaded) {
      final currentState = _savedPostsBloc.state as SavedPostsLoaded;
      // Check if not already loading and has more pages
      if (currentState.hasMorePages && _savedPostsBloc.state is! SavedPostsLoading) {
         debugPrint("📜 Reached end, loading more saved posts...");
        _savedPostsBloc.add(const LoadMoreSavedPosts());
      }
    }
  }

  // Optional: Function to show post options (can be adapted from home page)
  // void _showPostOptions(BuildContext context, PostModel post) {
  //    SheetHelpers.showPostOptionsSheet(
  //       context: context,
  //       ownerName: post.ownerName,
  //       showSave: false, // Don't show "Save"
  //       showUnsave: true, // Show "Unsave"
  //       showShare: true,
  //       showNotInterested: true,
  //       showUnfollow: true, // Add logic if needed
  //       showReport: true,
  //       showMessage: false, // Add logic if needed
  //       onUnsave: () {
  //          _savedPostsBloc.add(UnsavePostFromSaved(post.id));
  //          ScaffoldMessenger.of(context).showSnackBar(
  //             const SnackBar(content: Text('Post unsaved'), duration: Duration(seconds: 1)),
  //          );
  //       },
  //       onShare: () {
  //          context.read<PostBloc>().add(post_events.SharePost(post.id));
  //          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sharing post...')));
  //       },
  //       onNotInterested: () {
  //          context.read<PostBloc>().add(post_events.HidePost(post.id, "Not interested"));
  //          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Hiding post...')));
  //       },
  //       onUnfollow: () {
  //          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Unfollow ${post.ownerName} (not implemented)')));
  //       },
  //       onReport: () {
  //          context.read<PostBloc>().add(post_events.ReportPost(post.id, "Reason from dialog"));
  //          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Reporting post...')));
  //       },
  //    );
  // }


  @override
  Widget build(BuildContext context) {
    // Provide the bloc instance to the subtree
    return BlocProvider.value(
      value: _savedPostsBloc,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Saved Posts'),
          elevation: 1, // Simple app bar
        ),
        body: BlocConsumer<SavedPostsBloc, SavedPostsState>( // Use BlocConsumer for listening to errors etc.
          listener: (context, state) {
            if (state is SavedPostsError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error: ${state.message}')),
                );
            }
          },
          builder: (context, state) {
            // Initial Loading State
            if (state is SavedPostsInitial) {
              return const Center(child: CircularProgressIndicator());
            }
            // Also show loading if SavedPostsLoading is emitted without any posts yet
            if (state is SavedPostsLoading && state.posts.isEmpty) {
               return const Center(child: CircularProgressIndicator());
            }


            // Determine posts list and loading status *safely* from state
            List<PostModel> posts = [];
            bool isLoadingMore = false;
            bool hasMore = false;

            if (state is SavedPostsLoaded) {
               posts = state.posts; // Safe access
               hasMore = state.hasMorePages;
            } else if (state is SavedPostsLoading) {
               // If loading more, show existing posts
               posts = state.posts; // Safe access
               isLoadingMore = true;
               hasMore = true; // Assume more pages while loading
            }
            // Note: If state is SavedPostsError, 'posts' remains empty here.
            // The listener already shows a SnackBar for the error.

            // Error State (Only show full error screen if initial load failed)
            if (state is SavedPostsError && posts.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text('Failed to load saved posts.\n${state.message}'),
                ),
              );
            }

            // Empty State (Only show if not loading and posts list is empty)
            if (posts.isEmpty && !isLoadingMore) {
              // Added check for SavedPostsError to avoid showing empty state briefly after an error snackbar
              if (state is! SavedPostsError) {
                 return const Center(child: Text('You haven\'t saved any posts yet.'));
              } else {
                 // If it's an error state but we decided not to show the full error screen (e.g., error during load more),
                 // we might just show nothing or keep the previous list (requires more complex state).
                 // For now, returning an empty container if error occurred after posts were loaded.
                 return const SizedBox.shrink();
              }
            }

            // Loaded State (or Loading More State)
            return RefreshIndicator(
               onRefresh: () async {
                 _savedPostsBloc.add(const LoadSavedPosts());
                 // Wait for the state to update after refresh
                 await _savedPostsBloc.stream.firstWhere((s) => s is SavedPostsLoaded || s is SavedPostsError);
               },
               child: ListView.builder(
                controller: _scrollController,
                itemCount: posts.length + (hasMore ? 1 : 0), // Add 1 for loading indicator
                itemBuilder: (context, index) {
                  // Loading indicator at the bottom
                  if (index >= posts.length) {
                    // Show loading indicator only if actually loading more or if hasMore is true but not currently loading
                    // This prevents showing indicator briefly if hasMore was true but load failed
                    return (isLoadingMore || hasMore)
                        ? const Padding(
                            padding: EdgeInsets.symmetric(vertical: 20.0),
                            child: Center(child: CircularProgressIndicator()),
                          )
                        : const SizedBox.shrink(); // No indicator if no more pages or load failed
                  }

                  // Post Item
                  final post = posts[index];
                  // Use the aliased Post widget.
                  // Actions within Post widget (like, comment) will use the globally provided PostBloc.
                  return Column(
                    children: [
                       // Provide the specific post ID to the Post widget
                       post_widget.Post(postId: post.id),
                       // Add an Unsave button below each post
                       Padding(
                         padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 0), // Reduced vertical padding
                         child: Align(
                           alignment: Alignment.centerRight,
                           child: TextButton.icon(
                              style: TextButton.styleFrom(
                                 visualDensity: VisualDensity.compact, // Make button smaller
                                 tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              icon: Icon(Icons.bookmark_remove_outlined, size: 20, color: Theme.of(context).colorScheme.primary),
                              label: Text('Unsave', style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                              onPressed: () {
                                 _savedPostsBloc.add(UnsavePostFromSaved(post.id));
                                 // Optional: Show immediate feedback
                                 // ScaffoldMessenger.of(context).showSnackBar(
                                 //    const SnackBar(content: Text('Post unsaved'), duration: Duration(seconds: 1)),
                                 // );
                              },
                           ),
                         ),
                       ),
                       const Divider(height: 1, thickness: 1), // Thinner divider
                    ],
                  );
                },
              ),
            );
          },
        ),
      ),
    );
  }
}