import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_state.dart';
import 'package:ascend_app/shared/widgets/app_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  void _debugLog(String message) {
    debugPrint('🔍 [Home] $message');
  }

  @override
  void initState() {
    super.initState();
    
    // Load initial posts through BLoC
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _debugLog('Initial load - dispatching LoadPosts event');
      context.read<PostBloc>().add(const LoadPosts());
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      body: SafeArea(
        child: BlocBuilder<PostBloc, PostState>(
          builder: (context, state) {
            if (state is PostsInitial) {
              return const Center(child: CircularProgressIndicator());
            }
            
            if (state is PostsError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Error: ${state.message}', textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        _debugLog('Manual reload - dispatching LoadPosts event');
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
              
              if (posts.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.info_outline, size: 48, color: Colors.blue),
                      const SizedBox(height: 16),
                      const Text(
                        'No posts found from API.',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'The API returned no posts. Please check your connection or API endpoint.',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          _debugLog('Manual reload - dispatching LoadPosts event');
                          context.read<PostBloc>().add(const LoadPosts());
                        },
                        child: const Text('Reload Data'),
                      ),
                    ],
                  ),
                );
              }
              
              return SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'API Data Debug View',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text('Total Posts: ${posts.length}'),
                    const SizedBox(height: 16),
                    const Text(
                      'Post Data from API:',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    ...posts.map((post) => _buildPostDataCard(post)).toList(),
                    const SizedBox(height: 16),
                    Center(
                      child: ElevatedButton(
                        onPressed: () {
                          _debugLog('Manual reload - dispatching LoadPosts event');
                          context.read<PostBloc>().add(const LoadPosts());
                        },
                        child: const Text('Reload Data'),
                      ),
                    ),
                  ],
                ),
              );
            }
            
            return const Center(child: CircularProgressIndicator());
          },
        ),
      ),
    );
  }

  Widget _buildPostDataCard(post) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Post ID: ${post.id}', 
              style: const TextStyle(fontWeight: FontWeight.bold)),
            const Divider(),
            Text('Title: ${post.title}'),
            const SizedBox(height: 4),
            Text('Description: ${post.description.substring(0, post.description.length > 100 ? 100 : post.description.length)}${post.description.length > 100 ? "..." : ""}'),
            const SizedBox(height: 4),
            Text('Owner: ${post.ownerName} (${post.ownerOccupation})'),
            const SizedBox(height: 4),
            Text('Posted: ${post.timePosted}'),
            const SizedBox(height: 4),
            Text('Images: ${post.images.isNotEmpty ? post.images.join(", ") : "No images"}'),
            const Divider(),
            const Text('Engagement Stats:', 
              style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text('Likes: ${post.likesCount}'),
            Text('Comments: ${post.commentsCount}'),
            Text('Shares: ${post.sharedCount}'),
            Text('Is Liked: ${post.isLiked}'),
            const SizedBox(height: 8),
            if (post.comments.isNotEmpty) ...[
              const Text('First Comment:', 
                style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('${post.comments.first.authorName}: ${post.comments.first.text}'),
            ],
          ],
        ),
      ),
    );
  }
}