import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../widgets/reported_post_card.dart';
import '../../bloc/posts/bloc/posts_bloc.dart';
import '../../bloc/posts/bloc/posts_event.dart';
import '../../data/models/posts_model.dart';

class PostsPage extends StatefulWidget {
  const PostsPage({super.key});

  @override
  State<PostsPage> createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
  // Track expanded posts and posts with expanded reports separately
  final Set<String> expandedPosts = {};
  final Set<String> postsWithExpandedReports = {};
  late ScrollController _scrollController;
  int _currentPage = 1;
  // Add a flag to track if a request is in progress
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    // Initialize the controller first
    _scrollController = ScrollController();
    // Add the listener after initialization
    _scrollController.addListener(_onScroll);
    // Fetch reported posts when page loads
    context.read<PostsBloc>().add(FetchReportedPosts(page: _currentPage));
  }

  @override
  void dispose() {
    // Remove listener and dispose properly
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  // Update _onScroll method to check this flag
  void _onScroll() {
    if (_isBottom && !context.read<PostsBloc>().hasReachedMax && !_isLoadingMore) {
      setState(() {
        _isLoadingMore = true;
      });
      
      _currentPage++;
      context.read<PostsBloc>().add(FetchReportedPosts(page: _currentPage));
      
      // Reset the flag after a reasonable delay even if the request fails
      Future.delayed(const Duration(seconds: 20), () {
        if (mounted) {
          setState(() {
            _isLoadingMore = false;
          });
        }
      });
    }
  }

  // Helper method to check if we're at the bottom of the scroll
  bool get _isBottom {
    if (!_scrollController.hasClients) return false;

    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.offset;
    final delta = 200.0; // Load more when within 200 pixels of the bottom
    return maxScroll - currentScroll <= delta;
  }

  void _handleDeletePost(BuildContext context, String postId) {
    showDialog(
      context: context,
      builder:
          (dialogContext) => AlertDialog(
            title: const Text('Delete Post'),
            content: const Text(
              'Are you sure you want to delete this reported post?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(dialogContext);
                  context.read<PostsBloc>().add(
                    DeletePostEvent(postId: postId),
                  );
                },
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Delete'),
              ),
            ],
          ),
    );
  }

  void _togglePostExpansion(String postId) {
    setState(() {
      if (expandedPosts.contains(postId)) {
        expandedPosts.remove(postId);
      } else {
        expandedPosts.add(postId);
      }
    });
  }

  void _toggleReportsVisibility(String postId) {
    setState(() {
      if (postsWithExpandedReports.contains(postId)) {
        postsWithExpandedReports.remove(postId);
      } else {
        postsWithExpandedReports.add(postId);
        // Fetch reports when showing them for the first time
        context.read<PostsBloc>().add(FetchPostReports(postId: postId));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Manage Reported Posts'),
      ),
      body: SafeArea(
        child: BlocConsumer<PostsBloc, PostsState>(
          listener: (context, state) {
            // Reset loading flag when any terminal state is reached
            if (state is ReportedPostsFetchedState || 
                state is PostsErrorState ||
                state is EndOfPostsReachedState) {
              setState(() {
                _isLoadingMore = false;
              });
            }
            
            if (state is PostsErrorState) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Error: ${state.errorMessage}'),
                  backgroundColor: Colors.red,
                ),
              );
            } else if (state is EndOfPostsReachedState) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('You have reached the end of posts'),
                ),
              );
            } else if (state is PostDeletedState) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Post deleted successfully'),
                  backgroundColor: Colors.green,
                ),
              );
            } else if (state is PostReportStatusUpdatedState) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Report status updated to ${state.status}'),
                  backgroundColor: Colors.green,
                ),
              );
            }
          },
          builder: (context, state) {
            if (state is PostsInitial ||
                (state is FetchingReportedPostsState &&
                    context.read<PostsBloc>().posts.isEmpty)) {
              return const Center(child: CircularProgressIndicator());
            }

            if (state is PostsErrorState) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Error: ${state.errorMessage}'),
                    ElevatedButton(
                      onPressed: () {
                        context.read<PostsBloc>().add(
                          FetchReportedPosts(page: 1),
                        );
                      },
                      child: const Text('Try Again'),
                    ),
                  ],
                ),
              );
            }

            final List<ReportedPost> posts;
            bool isLoadingMore = false;

            if (state is FetchingMorePostsState) {
              posts = state.currentPosts;
              isLoadingMore = true;
            } else if (state is ReportedPostsFetchedState) {
              posts = state.reportedPosts;
            } else {
              posts = context.read<PostsBloc>().posts;
            }

            if (posts.isEmpty) {
              return const Center(child: Text('No reported posts found'));
            }

            return ListView.builder(
              controller: _scrollController,
              itemCount:
                  posts.length +
                  (isLoadingMore || !context.read<PostsBloc>().hasReachedMax
                      ? 1
                      : 0),
              itemBuilder: (context, index) {
                if (index >= posts.length) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }

                final post = posts[index];
                final isExpanded = expandedPosts.contains(post.id);
                final showReports = postsWithExpandedReports.contains(post.id);

                return ReportedPostCard(
                  post: post,
                  isExpanded: isExpanded,
                  showReports: showReports,
                  onToggleExpand: () => _togglePostExpansion(post.id),
                  onToggleReports: () => _toggleReportsVisibility(post.id),
                  onDelete: () => _handleDeletePost(context, post.id),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
