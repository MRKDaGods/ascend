import '../models/post_model.dart';
import '../data/sample_posts.dart';

class PostRepository {
  // For now, we'll use in-memory storage
  final List<Post> _posts = [];
  
  // Add a map for sponsored posts
  final Map<String, Post> _sponsoredPosts = {};

  PostRepository() {
    // Initialize with sample posts
    _posts.addAll(SamplePosts.getDefaultPosts());
    
    // Initialize sponsored posts
    _sponsoredPosts['sponsored_1'] = Post(
      id: 'sponsored_1',
      title: 'Sponsored: Premium Subscription',
      description: 'Get 50% off our premium plan today!',
      ownerName: 'Ascend Premium',
      ownerImageUrl: 'assets/images/profile/sponsor1.jpg',
      ownerOccupation: 'Sponsored',
      timePosted: '2h ago',
      isSponsored: true,
      likesCount: 142,
      commentsCount: 23,
      followers: 5250,
      images: ['assets/images/posts/sponsor1.jpg'],
    );
    
    _sponsoredPosts['sponsored_2'] = Post(
      id: 'sponsored_2',
      title: 'Sponsored: Learn New Skills',
      description: 'Join our workshop to learn the latest tech skills!',
      ownerName: 'Tech Academy',
      ownerImageUrl: 'assets/images/profile/sponsor2.jpg',
      ownerOccupation: 'Sponsored',
      timePosted: '3h ago',
      isSponsored: true,
      likesCount: 89,
      commentsCount: 12,
      followers: 3890,
      images: ['assets/images/posts/sponsor2.jpg'],
    );
    
    // Add more sponsored posts as needed
  }
  
  // Get all posts
  Future<List<Post>> getPosts() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 300));
    return _posts;
  }
  
  // Get a single post by ID
  Future<Post?> getPostById(String id) async {
    // Check if it's a sponsored post
    if (id.startsWith('sponsored_')) {
      return _sponsoredPosts[id];
    }
    
    // Otherwise look in regular posts
    try {
      return _posts.firstWhere((post) => post.id == id);
    } catch (e) {
      return null;
    }
  }
  
  // Add a new post
  Future<Post> addPost(Post post) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 300));
    _posts.add(post);
    return post;
  }
  
  // Update an existing post
  Future<Post> updatePost(Post post) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _posts.indexWhere((p) => p.id == post.id);
    if (index >= 0) {
      _posts[index] = post;
    }
    return post;
  }
  
  // Delete a post
  Future<void> deletePost(String id) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 300));
    _posts.removeWhere((post) => post.id == id);
  }

  // Add this method
  Future<List<Post>> getMorePosts(int count) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 800));
    
    // Generate some more sample posts
    final newPosts = List.generate(count, (index) {
      final id = _posts.length + index + 1;
      return Post(
        id: 'post_$id',
        title: 'New Post $id',
        description: 'This is a dynamically loaded post #$id',
        ownerName: 'User $id',
        ownerImageUrl: 'assets/images/profile/user$id.jpg',
        timePosted: 'Just now',
        likesCount: 0,
        commentsCount: 0,
        followers: 100 + index,
        images: index % 3 == 0 ? ['assets/images/posts/sample_$index.jpg'] : [],
      );
    });
    
    // Add to our in-memory store
    _posts.addAll(newPosts);
    
    return newPosts;
  }

  // Add this method to your PostRepository class
  Future<void> hidePost(String id, String reason) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 300));
    
    // Log the hide action (in a real app, this would go to analytics/backend)
    print('Post $id hidden. Reason: $reason');
    
    // Remove from posts list
    _posts.removeWhere((post) => post.id == id);
    
    // Also check sponsored posts
    if (_sponsoredPosts.containsKey(id)) {
      _sponsoredPosts.remove(id);
    }
  }
}