import 'package:ascend_app/features/admin/Presentation/widgets/reported_post_card.dart';
import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_bloc.dart';
import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_event.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PostsPage extends StatefulWidget {
  const PostsPage({super.key});

  @override
  State<PostsPage> createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
  final Set<String> expandedPosts = {};
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // Dispatch the event to fetch reported posts when the page loads
    context.read<PostsBloc>().add(FetchReportedPosts(page: 1));

    // Add scroll listener for pagination
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_isLoading) return;

    // Get the current state
    final state = context.read<PostsBloc>().state;

    // Check if we've reached max before loading more
    if (state is ReportedPostsFetchedState && state.hasReachedMax) {
      return; // Don't load more if we've reached max
    }

    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      setState(() {
        _isLoading = true;
      });

      _currentPage++;
      print('Loading more posts, page: $_currentPage');
      context.read<PostsBloc>().add(FetchReportedPosts(page: _currentPage));

      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Manage Reported Posts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Implement search functionality here
              // You can pass the fetched posts to the search delegate
            },
          ),
        ],
      ),
      body: SafeArea(
        child: BlocBuilder<PostsBloc, PostsState>(
          builder: (context, state) {
            if (state is FetchingReportedPostsState && _currentPage == 1) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is ReportedPostsFetchedState) {
              final reportedPosts = state.reportedPosts;
              final totalEstimatedPosts = state.totalPages * 20;

              // Debug print to verify the post count
              debugPrint(
                "Fetched posts count: ${reportedPosts.length} out of total estimate: $totalEstimatedPosts",
              );

              return ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount:
                    reportedPosts.length +
                    (state.currentPage < state.totalPages ? 1 : 0),
                itemBuilder: (context, index) {
                  // Log each item being rendered
                  print('Rendering post at index: $index');

                  // Show loading indicator at the bottom when more items are being loaded
                  if (index == reportedPosts.length) {
                    return const Center(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }

                  final post = reportedPosts[index];
                  return ReportedPostCard(
                    post: post,
                    isExpanded: expandedPosts.contains(post.id),
                    onToggleExpand: () {
                      setState(() {
                        if (expandedPosts.contains(post.id)) {
                          expandedPosts.remove(post.id);
                        } else {
                          expandedPosts.add(post.id);
                        }
                      });
                    },
                  );
                },
              );
            } else if (state is PostsErrorState) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Error: ${state.errorMessage}',
                      style: const TextStyle(color: Colors.red),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // Reset current page and retry fetching posts
                        _currentPage = 1;
                        context.read<PostsBloc>().add(
                          FetchReportedPosts(page: 1),
                        );
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }
            return const Center(child: Text('No data available.'));
          },
        ),
      ),
    );
  }
}
