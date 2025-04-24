import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_state.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post.dart' as post_widget;
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
    if (_scrollController.position.pixels >= 
        _scrollController.position.maxScrollExtent - 200 &&
        !_isLoading) {
      _loadMoreItems();
    }
  }
  
  void _loadMoreItems() async {
    if (_isLoading) return;
    
    setState(() {
      _isLoading = true;
    });
    
    // Load more posts through BLoC
    context.read<PostBloc>().add(const LoadMorePosts(count: 5));
    
    // Set _isLoading to false after a delay
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
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
          },
          builder: (context, state) {
            if (state is PostsInitial) {
              return const Center(child: CircularProgressIndicator());
            }
            
            if (state is PostsError) {
              return Center(child: Text('Error: ${state.message}'));
            }
            
            if (state is PostsLoaded) {
              final posts = state.posts;
              
              return CustomScrollView(
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
                        // Show loading indicator at the end
                        if (index == _getDisplayItemCount(posts.length)) {
                          return _isLoading
                              ? const Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child: Center(child: CircularProgressIndicator()),
                                )
                              : const SizedBox.shrink();
                        }

                        String postId;
                        Comment? previewComment;

                        // Check if this position should show a sponsored post
                        if (index == 2 || index == 8 || (index > 10 && (index - 10) % 7 == 0)) {
                          // Get sponsored post ID
                          int sponsoredIndex = ++_sponsoredPostCounter;
                          if (sponsoredIndex > 5) {
                            sponsoredIndex = ((sponsoredIndex - 1) % 5) + 1;
                          }
                          
                          postId = 'sponsored_$sponsoredIndex';
                        } else {
                          // Calculate the actual post index, accounting for sponsored posts
                          int actualPostIndex = _calculateActualPostIndex(index);
                          
                          if (actualPostIndex >= posts.length) {
                            return const SizedBox.shrink();
                          }
                          
                          postId = posts[actualPostIndex].id;
                          
                          // Add preview comment to every 7th regular post
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
                      childCount: _getDisplayItemCount(posts.length) + 1, // +1 for loading indicator
                    ),
                  ),
                ],
              );
            }
            
            return const Center(child: CircularProgressIndicator());
          }
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