import 'package:ascend_app/features/home/presentation/data/sample_posts.dart';
import 'package:ascend_app/features/home/presentation/models/post_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/post.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart'; // Add this import
import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<PostModel> _posts = [];
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  int _sponsoredPostCounter = 0;
  
  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadInitialItems();
  }
  
  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }
  
  void _loadInitialItems() {
    // Load initial batch of regular posts
    setState(() {
      _posts = SamplePosts.generateMixedPosts(10);
    });
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
    
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    if (mounted) {
      setState(() {
        // Add 5 more posts
        _posts.addAll(SamplePosts.generateMixedPosts(5));
        _isLoading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // Replace SliverAppBar with your CustomSliverAppBar
          const CustomSliverAppBar(
            pinned: false,
            floating: true,
            addpost: true,   // Show the post button
            ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                // Show loading indicator at the end
                if (index == _getDisplayItemCount()) {
                  return _isLoading
                      ? const Center(
                          child: Padding(
                            padding: EdgeInsets.all(16.0),
                            child: CircularProgressIndicator(),
                          ),
                        )
                      : const SizedBox.shrink();
                }
              
                // Check if this position should show a sponsored post
                // Show sponsored posts at positions 2, 8, 15, etc.
                if (index == 2 || index == 8 || (index > 10 && (index - 10) % 7 == 0)) {
                  _sponsoredPostCounter++;
                  final sponsoredPost = SamplePosts.getNextSponsoredPost(_sponsoredPostCounter - 1);
                  
                  return Post(
                    title: sponsoredPost.title,
                    description: sponsoredPost.description,
                    images: sponsoredPost.images,
                    useCarousel: sponsoredPost.useCarousel,
                    isSponsored: sponsoredPost.isSponsored,
                    ownerName: sponsoredPost.ownerName,
                    ownerImageUrl: sponsoredPost.ownerImageUrl,
                    ownerOccupation: sponsoredPost.ownerOccupation,
                    timePosted: sponsoredPost.timePosted,
                    initialLikes: sponsoredPost.initialLikes,
                    initialComments: sponsoredPost.initialComments,
                    followers: sponsoredPost.followers,
                  );
                }
                
                // Calculate the actual post index, accounting for sponsored posts
                int actualPostIndex = index;
                if (index > 2) actualPostIndex--;
                if (index > 8) actualPostIndex--;
                if (index > 10) {
                  actualPostIndex -= ((index - 10) / 7).floor();
                }
                
                if (actualPostIndex >= _posts.length) {
                  return const SizedBox.shrink();
                }
                
                final post = _posts[actualPostIndex];
                
                return Post(
                  title: post.title,
                  description: post.description,
                  images: post.images,
                  useCarousel: post.useCarousel,
                  isSponsored: post.isSponsored,
                  ownerName: post.ownerName,
                  ownerImageUrl: post.ownerImageUrl,
                  ownerOccupation: post.ownerOccupation,
                  timePosted: post.timePosted,
                  initialLikes: post.initialLikes,
                  initialComments: post.initialComments,
                  followers: post.followers,
                );
              },
              childCount: _getDisplayItemCount() + 1, // +1 for loading indicator
            ),
          ),
        ],
      ),
    );
  }
  
  int _getDisplayItemCount() {
    // Calculate total items including sponsored posts
    final regularPostsCount = _posts.length;
    
    // Add sponsored posts: one after first 2 posts, another after 8 posts,
    // then every 7 posts after the first 10
    int sponsoredCount = 0;
    if (regularPostsCount > 2) sponsoredCount++;
    if (regularPostsCount > 8) sponsoredCount++;
    if (regularPostsCount > 10) {
      sponsoredCount += ((regularPostsCount - 10) / 7).ceil();
    }
    
    return regularPostsCount + sponsoredCount;
  }
}
