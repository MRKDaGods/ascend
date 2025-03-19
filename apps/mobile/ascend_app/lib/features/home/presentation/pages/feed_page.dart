import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/core/di/service_locator.dart';
import 'package:ascend_app/features/home/domain/repositories/post_repository.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/feed_post_bloc.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/feed_post_event.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/feed_post_state.dart';
import 'package:ascend_app/features/home/presentation/widgets/post.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_feedback_options.dart';
import 'package:ascend_app/features/home/presentation/pages/post_detail_page.dart';

void main() {
  setupServiceLocator();
  runApp(const MyApp());
}

class FeedPage extends StatelessWidget {
  const FeedPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => FeedPostBloc(
        postRepository: serviceLocator<PostRepository>(),
      )..add(const FetchFeedPosts()),
      child: const FeedPageContent(),
    );
  }
}

class FeedPageContent extends StatefulWidget {
  const FeedPageContent({super.key});

  @override
  State<FeedPageContent> createState() => _FeedPageContentState();
}

class _FeedPageContentState extends State<FeedPageContent> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= 
        _scrollController.position.maxScrollExtent - 200 &&
        !_isLoading) {
      _loadMorePosts();
    }
  }

  void _loadMorePosts() {
    if (_isLoading) return;
    
    setState(() {
      _isLoading = true;
    });
    
    // Load more posts via BLoC
    context.read<FeedPostBloc>().add(const LoadMoreFeedPosts());
    
    // Reset loading state after a delay
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Feed'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<FeedPostBloc>().add(const FetchFeedPosts());
            },
          ),
        ],
      ),
      body: BlocConsumer<FeedPostBloc, FeedPostState>(
        listener: (context, state) {
          if (state is FeedPostError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          } else if (state is FeedPostActionSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          if (state is FeedPostsLoading && state is! FeedPostsLoaded) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is FeedPostsLoaded) {
            return _buildPostsList(context, state);
          } else if (state is FeedPostError) {
            return Center(child: Text('Error: ${state.message}'));
          }
          return const Center(child: Text('Loading posts...'));
        },
      ),
    );
  }

  Widget _buildPostsList(BuildContext context, FeedPostsLoaded state) {
    if (state.posts.isEmpty) {
      return const Center(child: Text('No posts available'));
    }

    return RefreshIndicator(
      onRefresh: () async {
        context.read<FeedPostBloc>().add(const FetchFeedPosts());
        return Future.delayed(const Duration(seconds: 1));
      },
      child: ListView.builder(
        controller: _scrollController,
        itemCount: state.posts.length + 1, // +1 for the potential loading indicator
        itemBuilder: (context, index) {
          // Show loading indicator at the end
          if (index == state.posts.length) {
            return _isLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: CircularProgressIndicator(),
                    ),
                  )
                : const SizedBox.shrink();
          }
          
          final post = state.posts[index];
          
          // Check if this post should show feedback options
          if (state.postToShowFeedbackOptions != null && 
              state.postToShowFeedbackOptions!.id == post.id) {
            return PostFeedbackOptions(
              post: post,
            );
          }
          
          return Post(
            post: post,
            onPostTap: () {
              // Mark post as viewed
              context.read<FeedPostBloc>().add(ViewFeedPost(postId: post.id));
              
              // Navigate to detail page
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PostDetailPage(postId: post.id),
                ),
              );
            },
            onImageTap: (index) {
              // Navigate to image gallery or fullscreen image
            },
          );
        },
      ),
    );
  }
}