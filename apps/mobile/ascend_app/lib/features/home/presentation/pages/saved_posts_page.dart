import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart' as post_events; // Alias PostBloc events
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_bloc.dart';
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_event.dart';
import 'package:ascend_app/features/home/bloc/saved_posts_bloc/saved_posts_state.dart';
import 'package:ascend_app/features/home/presentation/utils/sheet_helpers.dart'; // Import SheetHelpers
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../repositories/post_repository.dart'; // Keep this import
import '../widgets/post/post.dart' as post_widget; // Alias Post widget

import '../../models/post_model.dart'; // Import PostModel

class SavedPostsPage extends StatefulWidget {
  const SavedPostsPage({super.key});

  @override
  State<SavedPostsPage> createState() => _SavedPostsPageState();
}

class _SavedPostsPageState extends State<SavedPostsPage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Setup scroll listener for pagination
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    // Access bloc using context.read within the listener
    final savedPostsBloc = context.read<SavedPostsBloc>();
    // Check if near the bottom and more pages exist
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 300 && // Trigger slightly earlier
        savedPostsBloc.state is SavedPostsLoaded) {
      final currentState = savedPostsBloc.state as SavedPostsLoaded;
      // Check if not already loading and has more pages
      if (currentState.hasMorePages && savedPostsBloc.state is! SavedPostsLoading) {
         debugPrint("📜 Reached end, loading more saved posts...");
        savedPostsBloc.add(const LoadMoreSavedPosts());
      }
    }
  }

  // --- MODIFICATION START ---
  // Function to show post options using the bottom sheet
  void _showPostOptions(BuildContext context, PostModel post) {
     // Access SavedPostsBloc using context.read, as this method is called from the builder context
     final savedPostsBloc = context.read<SavedPostsBloc>();
     // Access PostBloc similarly if needed for other actions like share/report
     final postBloc = context.read<PostBloc>();

     debugPrint("[SavedPostsPage] Showing options for post: ${post.id}");

     SheetHelpers.showPostOptionsSheet(
        context: context,
        ownerName: post.ownerName,
        showSave: false, // Don't show "Save" on this page
        showUnsave: true, // Show "Unsave" on this page
        showShare: true, // Allow sharing from saved posts
        showNotInterested: true, // Allow hiding from saved posts
        showUnfollow: true, // Allow unfollowing from saved posts
        showReport: true, // Allow reporting from saved posts
        showMessage: false, // Assuming no direct message option here

        onUnsave: () {
           debugPrint("[SavedPostsPage] Unsave selected for post ${post.id}");
           // Dispatch event to SavedPostsBloc to handle unsaving
           savedPostsBloc.add(UnsavePostFromSaved(post.id));
           ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Post unsaved'), duration: Duration(seconds: 1)),
           );
        },
        onShare: () {
           debugPrint("[SavedPostsPage] Share selected for post ${post.id}");
           postBloc.add(post_events.SharePost(post.id));
           ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sharing post...')));
        },
        onNotInterested: () {
           debugPrint("[SavedPostsPage] Not Interested selected for post ${post.id}");
           postBloc.add(post_events.HidePost(post.id, "Not interested"));
           // Also remove from saved list immediately
           savedPostsBloc.add(UnsavePostFromSaved(post.id));
           ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Hiding post...')));
        },
        onUnfollow: () {
           debugPrint("[SavedPostsPage] Unfollow selected for user ${post.ownerName}");
           // Add unfollow logic (likely involves a different BLoC)
           // Example: context.read<FollowBloc>().add(UnfollowUser(post.userId));
           ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Unfollow ${post.ownerName} (not implemented)')));
        },
        onReport: () {
           debugPrint("[SavedPostsPage] Report selected for post ${post.id}");
           postBloc.add(post_events.ReportPost(post.id, "Reason from dialog"));
           ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Reporting post...')));
        },
     );
  }
  // --- MODIFICATION END ---

  @override
  Widget build(BuildContext context) {
    // Provide the bloc instance using BlocProvider
    return BlocProvider<SavedPostsBloc>(
      create: (context) {
        // Access dependencies safely within create using context.read
        final postRepository = context.read<PostRepository>();
        final postBloc = context.read<PostBloc>();
        // Create and return the bloc, and load initial data
        return SavedPostsBloc(
          postRepository: postRepository,
          postBloc: postBloc,
        )..add(const LoadSavedPosts()); // Dispatch initial event here
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Saved Posts'),
          elevation: 1, // Simple app bar
        ),
        // Use Builder to get a context below the BlocProvider
        body: Builder(
          builder: (context) {
            // Now this context has SavedPostsBloc available
            return BlocConsumer<SavedPostsBloc, SavedPostsState>(
              listener: (context, state) {
                if (state is SavedPostsError) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error: ${state.message}')),
                    );
                }
              },
              builder: (context, state) {
                // ... (Initial Loading, Error, Empty states remain the same) ...
                if (state is SavedPostsInitial) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (state is SavedPostsLoading && state.posts.isEmpty) {
                   return const Center(child: CircularProgressIndicator());
                }

                List<PostModel> posts = [];
                bool isLoadingMore = false;
                bool hasMore = false;

                if (state is SavedPostsLoaded) {
                   posts = state.posts;
                   hasMore = state.hasMorePages;
                } else if (state is SavedPostsLoading) {
                   posts = state.posts;
                   isLoadingMore = true;
                   hasMore = true;
                }

                if (state is SavedPostsError && posts.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text('Failed to load saved posts.\n${state.message}'),
                    ),
                  );
                }

                if (posts.isEmpty && !isLoadingMore) {
                  if (state is! SavedPostsError) {
                     return const Center(child: Text('You haven\'t saved any posts yet.'));
                  } else {
                     return const SizedBox.shrink();
                  }
                }

                // Loaded State (or Loading More State)
                return RefreshIndicator(
                   onRefresh: () async {
                     context.read<SavedPostsBloc>().add(const LoadSavedPosts());
                     await context.read<SavedPostsBloc>().stream.firstWhere((s) => s is SavedPostsLoaded || s is SavedPostsError);
                   },
                   child: ListView.builder(
                    controller: _scrollController,
                    itemCount: posts.length + (hasMore ? 1 : 0), // Add 1 for loading indicator
                    itemBuilder: (context, index) {
                      // Loading indicator at the bottom
                      if (index >= posts.length) {
                        // ... (Loading indicator logic remains the same) ...
                        return (isLoadingMore || hasMore)
                            ? const Padding(
                                padding: EdgeInsets.symmetric(vertical: 20.0),
                                child: Center(child: CircularProgressIndicator()),
                              )
                            : const SizedBox.shrink();
                      }

                      // Post Item
                      final post = posts[index];
                      // --- MODIFICATION START ---
                      // Wrap Post in a Column and add an options button
                      return Column(
                        children: [
                          Stack( // Use Stack for positioning the button
                            children: [
                              // Provide the specific post ID to the Post widget
                              post_widget.Post(postId: post.id),
                              // Position the options button at the top right
                              Positioned(
                                top: 8, // Adjust as needed
                                right: 8, // Adjust as needed
                                child: IconButton(
                                  icon: const Icon(Icons.more_vert),
                                  tooltip: 'More options',
                                  onPressed: () {
                                    // Call the method to show the bottom sheet
                                    _showPostOptions(context, post);
                                  },
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: 1, thickness: 1), // Keep the divider
                        ],
                      );
                      // --- MODIFICATION END ---
                    },
                  ),
                );
              },
            );
          }
        ),
      ),
    );
  }
}