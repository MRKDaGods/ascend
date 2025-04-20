import '../models/post_model.dart';
import '../data/sample_posts.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

// Import for secure storage
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class PostRepository {
  // Define the baseUrl with HTTPS
  final String baseUrl = 'https://api.ascendx.tech';
  
  // For fallback and sponsored content
  final List<PostModel> _posts = [];
  final Map<String, PostModel> _sponsoredPosts = {};
  final http.Client _client;

  PostRepository({http.Client? client}) : _client = client ?? http.Client() {
    // Keep the sponsored posts initialization
    _sponsoredPosts['sponsored_1'] = PostModel(
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
    
    // Keep other sponsored posts
    _sponsoredPosts['sponsored_2'] = PostModel(
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
    
    // Initialize with sample posts (for fallback)
    _posts.addAll(SamplePosts.getDefaultPosts());
  }
  
  // Get all posts from feed API
  Future<List<PostModel>> getPosts({int page = 0, int limit = 15}) async {
    try {
      // Try the API first
      final result = await fetchFeed(page: page, limit: limit);
      final posts = result['posts'] as List<PostModel>;
      
      // If we got posts from the API, return them
      if (posts.isNotEmpty) {
        print('Returning ${posts.length} posts from API');
        return posts;
      }
      
      // Try old API format if needed
      print('API returned no posts, trying legacy endpoint...');
      try {
        final authToken = await SecureStorageHelper.getAuthToken();
        final legacyUri = Uri.parse('$baseUrl/feed?page=$page&limit=$limit');
        final response = await _client.get(
          legacyUri, 
          headers: {
            'Authorization': 'Bearer $authToken',
            'Content-Type': 'application/json',
          }
        );
        print('Legacy API response: ${response.statusCode}');
        // Process legacy response if needed
      } catch (e) {
        print('Legacy API error: $e');
      }
      
      // If all else fails, fall back to sample posts
      print('Falling back to sample posts');
      return SamplePosts.getDefaultPosts();
    } catch (e) {
      print('Error in getPosts: $e');
      return SamplePosts.getDefaultPosts();
    }
  }
  
  // Get a single post by ID
  Future<PostModel?> getPostById(String id) async {
    // Sponsored posts are local
    if (id.startsWith('sponsored_')) {
      return _sponsoredPosts[id];
    }
    
    // For real posts, try to fetch from backend (implement in future)
    try {
      return _posts.firstWhere((post) => post.id == id);
    } catch (e) {
      return null;
    }
  }
  
  // Add a new post
  Future<PostModel> addPost(PostModel post) async {
    // Implement API call later
    await Future.delayed(const Duration(milliseconds: 300));
    _posts.add(post);
    return post;
  }
  
  // Update an existing post
  Future<PostModel> updatePost(PostModel post) async {
    // Implement API call later
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _posts.indexWhere((p) => p.id == post.id);
    if (index >= 0) {
      _posts[index] = post;
    }
    return post;
  }
  
  // Delete a post
  Future<void> deletePost(String id) async {
    // Implement API call later
    await Future.delayed(const Duration(milliseconds: 300));
    _posts.removeWhere((post) => post.id == id);
  }

  // Get more posts for pagination
  Future<List<PostModel>> getMorePosts(int count, {int page = 1}) async {
    try {
      final result = await fetchFeed(page: page, limit: count);
      return result['posts'];
    } catch (e) {
      print('Error fetching more posts: $e');
      
      // Fallback to sample data
      final newPosts = List.generate(count, (index) {
        final id = _posts.length + index + 1;
        return PostModel(
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
      
      _posts.addAll(newPosts);
      return newPosts;
    }
  }

  // Hide post method
  Future<void> hidePost(String id, String reason) async {
    // Implement real API call later
    await Future.delayed(const Duration(milliseconds: 300));
    print('Post $id hidden. Reason: $reason');
    _posts.removeWhere((post) => post.id == id);
    
    if (_sponsoredPosts.containsKey(id)) {
      _sponsoredPosts.remove(id);
    }
  }

  // Update the fetchFeed method with the correct endpoint and add debugging
  Future<Map<String, dynamic>> fetchFeed({int page = 0, int limit = 15}) async {
    try {
      // Get the auth token - make sure it's valid
      final authToken = await SecureStorageHelper.getAuthToken();
      print('Auth token: ${authToken?.substring(0, 10)}...');
      
      // Try with `/post/feed` endpoint as seen in logs
      final uri = Uri.parse('$baseUrl/post/feed?page=$page&limit=$limit');
      print('Making request to: $uri');
      
      final headers = {
        'Authorization': 'Bearer $authToken',
        'Content-Type': 'application/json',
      };
      print('Request headers: $headers');
      
      final response = await _client.get(uri, headers: headers);
      print('API response status: ${response.statusCode}');
      print('API response body: ${response.body}');
      
      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        
        // Parse the posts array into PostModel objects
        final List<dynamic> apiPosts = jsonData['data'] ?? [];
        print('Found ${apiPosts.length} posts from API');
        
        if (apiPosts.isEmpty) {
          // This is happening - API returns empty array
          print('Warning: API returned empty posts array despite pagination showing total:${jsonData['pagination']?['total']}');
          
          // Try direct API call without parameters to see if that works
          print('Trying alternative endpoint...');
          final altUri = Uri.parse('$baseUrl/post/feed');
          final altResponse = await _client.get(altUri, headers: headers);
          print('Alt API status: ${altResponse.statusCode}');
          print('Alt API body: ${altResponse.body}');
          
          // For now, return empty post list
          return {
            'posts': <PostModel>[], 
            'totalPosts': jsonData['pagination']?['total'] ?? 0,
            'currentPage': jsonData['pagination']?['page'] ?? page,
            'hasMorePages': false,
          };
        }
        
        // If we got posts, try to convert them
        try {
          final posts = PostModel.fromApiResponseList(apiPosts);
          print('Successfully converted ${posts.length} API posts to PostModel objects');
          
          // Extract pagination info
          final Map<String, dynamic> pagination = jsonData['pagination'] ?? {};
          
          return {
            'posts': posts,
            'totalPosts': pagination['total'] ?? 0,
            'currentPage': pagination['page'] ?? page,
            'hasMorePages': (pagination['page'] ?? page) * (pagination['limit'] ?? limit) < (pagination['total'] ?? 0),
          };
        } catch (e) {
          print('Error converting API posts to PostModel: $e');
          return {
            'posts': <PostModel>[],
            'totalPosts': 0,
            'currentPage': page,
            'hasMorePages': false,
          };
        }
      } else {
        // Non-200 status code
        print('API error: ${response.statusCode}');
        print('Response body: ${response.body}');
        throw Exception('Failed to load posts: ${response.statusCode}');
      }
    } catch (e) {
      print('Exception in fetchFeed: $e');
      throw Exception('Error fetching posts: $e');
    }
  }
  
  // Clean up resources
  void dispose() {
    _client.close();
  }
}