import 'package:ascend_app/features/admin/Presentation/widgets/reported_post_card.dart';
import 'package:ascend_app/features/admin/Presentation/pages/post_search.dart';
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
    // Dispatch the event to fetch reported posts when the page loads
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
              // You can pass the fetched posts to the search delegate
            },
          ),
        ],
      ),
      body: BlocBuilder<PostsBloc, PostsState>(
        builder: (context, state) {
          if (state is FetchingReportedPostsState) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ReportedPostsFetchedState) {
            final reportedPosts = state.reportedPosts;
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: reportedPosts.length,
              itemBuilder: (context, index) {
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
                    style: const TextStyle(color: Colors.red) ,
                  ),
                  ElevatedButton(
                    onPressed: () {
                      // Retry fetching posts
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
    );
  }
}
