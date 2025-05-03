import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_state.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post.dart'
    as post_widget;
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';
import 'package:ascend_app/shared/widgets/app_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  int _sponsoredPostCounter = 0;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);

    // Load initial posts through BLoC
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PostBloc>().add(const LoadPosts());
    });
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    // Check if we are near the bottom and not already loading
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoading) {
      // Check the state via BlocProvider.of before calling _loadMoreItems
      final currentState = context.read<PostBloc>().state;
      // Only load more if the state is PostsLoaded AND hasMorePages is true
      if (currentState is PostsLoaded && currentState.hasMorePages) {
        _loadMoreItems();
      } else if (currentState is PostsLoaded && !currentState.hasMorePages) {
        // Optional: Log that we reached the end
        debugPrint("Reached end of feed, no more pages.");
      }
    }
  }

  void _loadMoreItems() async {
    // Double check isLoading flag
    if (_isLoading) return;

    // Check state again before dispatching, in case it changed rapidly
    final currentState = context.read<PostBloc>().state;
    // Only dispatch if state is PostsLoaded AND hasMorePages is true
    if (currentState is! PostsLoaded || !currentState.hasMorePages) {
      debugPrint(
        "LoadMoreItems called but no more pages or not in loaded state.",
      );
      return; // Don't dispatch if no more pages or not loaded
    }

    setState(() {
      _isLoading = true;
    });
    debugPrint("Dispatching LoadMorePosts event..."); // Debug debugPrint

    // Load more posts through BLoC
    context.read<PostBloc>().add(
      const LoadMorePosts(count: 15),
    ); // Use consistent limit
  }

  void _resetSponsoredCounter() {
    setState(() {
      _sponsoredPostCounter = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      body: SafeArea(
        child: BlocConsumer<PostBloc, PostState>(
          listener: (context, state) {
            if (state is PostsLoaded && state.freshLoad) {
              _resetSponsoredCounter();
            }
            if (state is PostsLoaded || state is PostsError) {
              if (_isLoading) {
                setState(() {
                  _isLoading = false;
                });
              }
            }
          },
          builder: (context, state) {
            if (state is PostsInitial) {
              return const Center(child: CircularProgressIndicator());
            }

            if (state is PostsError) {
              // Show error message and a retry button for initial load errors
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Error loading posts: ${state.message}'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // Dispatch LoadPosts event again on retry
                        context.read<PostBloc>().add(const LoadPosts());
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            if (state is PostsLoaded) {
              final posts = state.posts;

              return RefreshIndicator(
                onRefresh: () async {
                  context.read<PostBloc>().add(const LoadPosts());
                  return Future<void>.value();
                },
                child: CustomScrollView(
                  controller: _scrollController,
                  slivers: [
                    const CustomSliverAppBar(
                      pinned: false,
                      floating: true,
                      addpost: true,
                    ),
                    SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          // Show loading indicator at the end only if loading AND there might be more pages
                          if (index == _getDisplayItemCount(posts.length)) {
                            // Check hasMorePages from state as well
                            return _isLoading && state.hasMorePages
                                ? const Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child: Center(
                                    child: CircularProgressIndicator(),
                                  ),
                                )
                                : const SizedBox.shrink(); // Show nothing if not loading or no more pages
                          }

                          String postId;
                          Comment? previewComment;

                          // Check if this position should show a sponsored post
                          if (index == 2 ||
                              index == 8 ||
                              (index > 10 && (index - 10) % 7 == 0)) {
                            // Get sponsored post ID
                            int sponsoredIndex = ++_sponsoredPostCounter;
                            if (sponsoredIndex > 5) {
                              sponsoredIndex = ((sponsoredIndex - 1) % 5) + 1;
                            }

                            postId = 'sponsored_$sponsoredIndex';
                          } else {
                            // Calculate the actual post index, accounting for sponsored posts
                            int actualPostIndex = _calculateActualPostIndex(
                              index,
                            );

                            if (actualPostIndex >= posts.length) {
                              // This should ideally not happen if childCount is correct
                              return const SizedBox.shrink();
                            }

                            postId = posts[actualPostIndex].id;

                            // Add preview comment logic remains the same
                            if (actualPostIndex % 7 == 6) {
                              final currentPost = posts[actualPostIndex];
                              if (currentPost.comments.isNotEmpty) {
                                previewComment = currentPost.comments.first;
                              }
                            }
                          }

                          // Return the post widget
                          return post_widget.Post(
                            postId: postId,
                            previewComment: previewComment,
                          );
                        },
                        // Adjust childCount: posts + sponsored + potential loading/error indicator
                        childCount: _getDisplayItemCount(posts.length) + 1, // Always add 1 for the potential indicator slot
                      ),
                    ),
                  ],
                ),
              );
            }

            // Fallback loading indicator
            return const Center(child: CircularProgressIndicator());
          },
        ),
      ),
    );
  }

  int _calculateActualPostIndex(int displayIndex) {
    int actualPostIndex = displayIndex;

    if (displayIndex > 2) actualPostIndex--;
    if (displayIndex > 8) actualPostIndex--;
    if (displayIndex > 10) {
      int sponsoredCount = ((displayIndex - 10) / 7).floor();
      actualPostIndex -= sponsoredCount;
    }

    return actualPostIndex;
  }

  int _getDisplayItemCount(int regularPostsCount) {
    int sponsoredCount = 0;
    if (regularPostsCount > 2) sponsoredCount++;
    if (regularPostsCount > 8) sponsoredCount++;
    if (regularPostsCount > 10) {
      sponsoredCount += ((regularPostsCount - 10) / 7).ceil();
    }

    return regularPostsCount + sponsoredCount;
  }
}
