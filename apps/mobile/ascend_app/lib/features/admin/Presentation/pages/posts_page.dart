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

  @override
  void initState() {
    super.initState();
    // Fetch reported posts when page loads
    context.read<PostsBloc>().add(FetchReportedPosts(page: 1));
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
                const SnackBar(content: Text('You have reached the end of posts')),
              );
            }
          },
          builder: (context, state) {
            if (state is FetchingReportedPostsState && 
                (context.read<PostsBloc>().posts.isEmpty)) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is ReportedPostsFetchedState) {
              final reportedPosts = state.reportedPosts;
              final currentPage = state.currentPage;
              final hasReachedMax = state.hasReachedMax;

              if (reportedPosts.isEmpty) {
                return const Center(child: Text('No reported posts found'));
              }

              return RefreshIndicator(
                onRefresh: () async {
                  context.read<PostsBloc>().add(FetchReportedPosts(page: 1));
                },
                child: NotificationListener<ScrollNotification>(
                  onNotification: (scrollInfo) {
                    if (scrollInfo.metrics.pixels == scrollInfo.metrics.maxScrollExtent &&
                        !hasReachedMax) {
                      context.read<PostsBloc>().add(
                        FetchReportedPosts(page: currentPage + 1),
                      );
                    }
                    return true;
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: reportedPosts.length + (hasReachedMax ? 0 : 1),
                    itemBuilder: (context, index) {
                      // Log each item being rendered with its index and the current page
                      debugPrint('Rendering post at index: $index in page: ${state.currentPage}');
                      
                      if (index == reportedPosts.length) {
                        // Show loading indicator at the bottom
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(8.0),
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
                  ),
                ),
              );
            } else if (state is PostsErrorState) {
              // Show error UI only if there are no posts loaded
              if (context.read<PostsBloc>().posts.isEmpty) {
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
                          context.read<PostsBloc>().add(FetchReportedPosts(page: 1));
                        },
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                );
              }
              
              // Otherwise, show the last successful state
              final postBloc = context.read<PostsBloc>();
              return RefreshIndicator(
                onRefresh: () async {
                  context.read<PostsBloc>().add(FetchReportedPosts(page: 1));
                },
                child: NotificationListener<ScrollNotification>(
                  onNotification: (scrollInfo) {
                    if (scrollInfo.metrics.pixels == scrollInfo.metrics.maxScrollExtent &&
                        !postBloc.hasReachedMax) {
                      postBloc.add(FetchReportedPosts(page: postBloc.currentPage + 1));
                    }
                    return true;
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: postBloc.posts.length + (postBloc.hasReachedMax ? 0 : 1),
                    itemBuilder: (context, index) {
                      if (index == postBloc.posts.length) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(8.0),
                            child: CircularProgressIndicator(),
                          ),
                        );
                      }

                      final post = postBloc.posts[index];
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
                  ),
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
