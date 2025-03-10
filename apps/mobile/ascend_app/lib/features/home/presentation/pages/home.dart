import 'package:ascend_app/features/home/presentation/widgets/post.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/post_model.dart';

import '../../../../shared/widgets/custom_sliver_appbar.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<PostModel> _posts = [];
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  
  // Sponsored post content
  final PostModel _sponsoredPost = PostModel(
    title: '✨ Sponsored: Premium Content',
    description: 'Check out our featured products and services tailored just for you! Our premium offerings provide exceptional value and quality.',
    images: [
      "assets/images_posts/Screenshot 2024-05-01 174349.png",
      "assets/images_posts/Screenshot 2024-09-20 152333.png",
      "assets/images_posts/Screenshot 2024-10-04 102509.png",
    ],
    isSponsored: true,
    useCarousel: true, // Use carousel layout for sponsored post
  );

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadInitialItems();
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll); // Remove listener first
    _scrollController.dispose();
    super.dispose();
  }

  void _loadInitialItems() {
    // Load initial batch of items
    final initialPosts = List.generate(
      10, // Start with 10 regular items initially
      (index) => PostModel(
        title: 'Title $index',
        description: 'Description of Title $index',
        images: [
          "assets/images_posts/Screenshot 2023-08-06 150447.png",
          "assets/images_posts/Screenshot 2023-12-31 100011.png",
          "assets/images_posts/Screenshot 2024-05-01 174349.png",
          "assets/images_posts/Screenshot 2024-09-20 152333.png",
          "assets/images_posts/Screenshot 2024-10-04 102509.png",
        ],
        // Explicitly set these values to avoid null errors
        isSponsored: false,
        useCarousel: false,
      ),
    );

    // Set state with initial posts
    _posts = initialPosts;
  }

  void _onScroll() {
    // Check if we're at the bottom of the list
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoading) {
      _loadMoreItems();
    }
  }

  void _loadMoreItems() async {
    if (_isLoading) return; // Prevent multiple simultaneous loads

    if (!mounted) return; // Check if widget is still mounted

    setState(() {
      _isLoading = true;
    });

    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));

    // Check again after the delay if widget is still mounted
    if (!mounted) return;

    // Generate more items - now loading 10 instead of 5
    final currentLength = _posts.length;
    final moreItems = List.generate(
      10, // Load 10 more items at a time
      (index) {
        final newIndex = currentLength + index;
        return PostModel(
          title: 'Title $newIndex',
          description: '''Description of Title $newIndex
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque suscipit porta ex id tincidunt. Pellentesque vitae tellus lacinia, mattis magna vitae, scelerisque dolor. Quisque lacinia nulla lectus, eu fermentum quam tristique in. Vestibulum convallis id mauris nec pretium. Vestibulum in erat neque. Phasellus vel justo sagittis, vehicula dolor eu, accumsan nulla. Mauris ligula velit, euismod eu turpis non, ultricies fringilla nunc. Donec tincidunt efficitur pulvinar. Praesent vehicula mattis ligula congue ultrices.''',
          images: [
            "assets/images_posts/Screenshot 2023-08-06 150447.png",
            "assets/images_posts/Screenshot 2023-12-31 100011.png",
            "assets/images_posts/Screenshot 2024-09-20 152333.png",
            "assets/images_posts/Screenshot 2024-10-04 102509.png",
          ],
          // Explicitly set these values to avoid null errors  
          isSponsored: false,
          useCarousel: false,
        );
      },
    );

    // Check again before final setState
    if (!mounted) return;

    setState(() {
      _posts.addAll(moreItems);
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        controller: _scrollController,
        slivers: [
          const CustomSliverAppBar(
            pinned: false,
            floating: false,
            addpost: true,
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate((context, index) {
              // If we've reached the end of the list, show a loading indicator
              if (index == _getDisplayItemCount()) {
                return _isLoading
                    ? const Center(
                      child: Padding(
                        padding: EdgeInsets.all(8.0),
                        child: CircularProgressIndicator(),
                      ),
                    )
                    : const SizedBox.shrink();
              }

              // Determine if this is a position for a sponsored post (every 10 posts)
              final isPositionForSponsoredPost = 
                  index > 0 && (index % 11 == 0 || index == 5); // First at index 5, then every 11 positions
              
              if (isPositionForSponsoredPost) {
                // Show sponsored post
                return Post(
                  title: _sponsoredPost.title,
                  description: _sponsoredPost.description,
                  images: _sponsoredPost.images,
                  useCarousel: _sponsoredPost.useCarousel,
                );
              } else {
                // Calculate the actual post index accounting for sponsored posts
                final actualPostIndex = index - (index ~/ 11) - (index > 5 ? 1 : 0);
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
                );
              }
            }, childCount: _getDisplayItemCount() + 1), // +1 for loading indicator
          ),
        ],
      ),
    );
  }
  
  // Calculate total display count (including regular and sponsored posts)
  int _getDisplayItemCount() {
    final regularPostsCount = _posts.length;
    final sponsoredPostsCount = (regularPostsCount / 10).floor();
    return regularPostsCount + sponsoredPostsCount;
  }
}
