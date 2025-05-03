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

  @override
  void initState() {
    super.initState();
    // Fetch reported posts when page loads
    context.read<PostsBloc>().add(FetchReportedPosts());
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

  void _handleUpdateReportStatus(String reportId, String status) {
    context.read<PostsBloc>().add(
      UpdatePostReportStatus(reportId: reportId, status: status),
    );
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
            // Handle loading state
            if (state is FetchingReportedPostsState &&
                context.read<PostsBloc>().posts.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }

            final posts = context.read<PostsBloc>().posts;
            final hasReachedMax = context.read<PostsBloc>().hasReachedMax;
            final currentPage = context.read<PostsBloc>().currentPage;

            // Handle empty state
            if (posts.isEmpty) {
              return const Center(child: Text('No reported posts found'));
            }

            // Show posts list with infinite scroll
            return RefreshIndicator(
              onRefresh: () async {
                context.read<PostsBloc>().add(
                  FetchReportedPosts(isRefresh: true),
                );
              },
              child: NotificationListener<ScrollNotification>(
                onNotification: (scrollInfo) {
                  if (scrollInfo.metrics.pixels ==
                          scrollInfo.metrics.maxScrollExtent &&
                      !hasReachedMax) {
                    context.read<PostsBloc>().add(
                      FetchReportedPosts(page: currentPage + 1),
                    );
                  }
                  return true;
                },
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: posts.length + (hasReachedMax ? 0 : 1),
                  itemBuilder: (context, index) {
                    // Show loading indicator at the bottom while more posts are loading
                    if (index == posts.length) {
                      return const Center(
                        child: Padding(
                          padding: EdgeInsets.all(8.0),
                          child: CircularProgressIndicator(),
                        ),
                      );
                    }

                    final post = posts[index];
                    final isExpanded = expandedPosts.contains(post.id);
                    final showReports = postsWithExpandedReports.contains(
                      post.id,
                    );

                    return ReportedPostCard(
                      post: post,
                      isExpanded: isExpanded,
                      showReports: showReports,
                      onToggleExpand: () => _togglePostExpansion(post.id),
                      onToggleReports: () => _toggleReportsVisibility(post.id),
                      onDelete: () => _handleDeletePost(context, post.id),
                    );
                  },
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
