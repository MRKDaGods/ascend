import 'package:ascend_app/features/admin/Presentation/widgets/reported_post_card.dart';
import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_bloc.dart';
import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_event.dart';
import 'package:ascend_app/features/admin/data/models/posts_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PostsPage extends StatefulWidget {
  const PostsPage({super.key});

  @override
  State<PostsPage> createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
  final Set<String> expandedPosts = {};

  @override
  void initState() {
    super.initState();
    // Fetch reported posts when page loads
    context.read<PostsBloc>().add(FetchReportedPosts(page: 1));
  }

  void _handleDeletePost(BuildContext context, String postId) {
    showDialog(
      context: context,
      builder:
          (dialogContext) => BlocProvider.value(
            value: context.read<PostsBloc>(),
            child: Builder(
              builder:
                  (builderContext) => AlertDialog(
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
                          builderContext.read<PostsBloc>().add(
                            DeletePostEvent(postId: postId),
                          );
                        },
                        child: const Text(
                          'Delete',
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    ],
                  ),
            ),
          ),
    );
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
            },
          ),
        ],
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
            }
          },
          builder: (context, state) {
            final PostsBloc postsBloc = context.read<PostsBloc>();
            final List<ReportedPost> posts;
            bool hasReachedMax;
            int currentPage;

            if (state is ReportedPostsFetchedState) {
              posts = state.reportedPosts;
              hasReachedMax = state.hasReachedMax;
              currentPage = state.currentPage;
            } else {
              posts = postsBloc.posts;
              hasReachedMax = postsBloc.hasReachedMax;
              currentPage = postsBloc.currentPage;
            }

            // Show loading indicator if fetching initial data
            if (state is FetchingReportedPostsState && posts.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }

            // Show empty state if no posts
            if (posts.isEmpty) {
              return const Center(child: Text('No reported posts found'));
            }

            // Show error state if error and no posts
            if (state is PostsErrorState && posts.isEmpty) {
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
                      onPressed:
                          () => postsBloc.add(FetchReportedPosts(page: 1)),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            // Main posts list
            return RefreshIndicator(
              onRefresh: () async {
                postsBloc.add(FetchReportedPosts(page: 1));
              },
              child: NotificationListener<ScrollNotification>(
                onNotification: (scrollInfo) {
                  if (scrollInfo.metrics.pixels ==
                          scrollInfo.metrics.maxScrollExtent &&
                      !hasReachedMax) {
                    postsBloc.add(FetchReportedPosts(page: currentPage + 1));
                  }
                  return true;
                },
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: posts.length + (hasReachedMax ? 0 : 1),
                  itemBuilder: (context, index) {
                    if (index == posts.length) {
                      return const Center(
                        child: Padding(
                          padding: EdgeInsets.all(8.0),
                          child: CircularProgressIndicator(),
                        ),
                      );
                    }

                    final post = posts[index];
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
                      onDelete:
                          () => _handleDeletePost(context, post.id.toString()),
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
