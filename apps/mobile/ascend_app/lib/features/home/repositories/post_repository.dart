import '../models/post_model.dart';
import '../models/comment_model.dart';
import '../data/sample_posts.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart'; // For debugPrint

// Import for secure storage
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

// Base URL for the API - replace with your actual API base URL
const String _apiBaseUrl =
    '{{POST_BASE}}'; // Use your Postman variable or actual URL

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
      userId: 'sponsor_user_1', // Add userId
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
      userId: 'sponsor_user_2', // Add userId
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
  }

  // Get all posts from feed API
  Future<List<PostModel>> getPosts({int page = 1, int limit = 15}) async {
    // Changed default page to 1
    try {
      // Try the API
      final result = await fetchFeed(page: page, limit: limit);
      final posts = result['posts'] as List<PostModel>;

      // Return posts from API even if empty
      print('Returning ${posts.length} posts from API');
      return posts;
    } catch (e) {
      print('Error in getPosts: $e');
      // Re-throw the exception so the BLoC can handle it
      rethrow;
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

  // Get more posts for pagination - Updated signature
  Future<Map<String, dynamic>> getMorePosts({
    int page = 1,
    int limit = 5,
  }) async {
    try {
      // Directly call fetchFeed with provided page and limit
      final result = await fetchFeed(page: page, limit: limit);
      return result; // Return the whole map including pagination info
    } catch (e) {
      print('Error fetching more posts: $e');
      // Return empty list and pagination info indicating no more pages
      return {
        'posts': <PostModel>[],
        'totalPosts': 0,
        'currentPage': page,
        'hasMorePages': false,
      };
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
  Future<Map<String, dynamic>> fetchFeed({int page = 1, int limit = 15}) async {
    // Changed default page to 1
    try {
      // Get the auth token - make sure it's valid
      final authToken = await SecureStorageHelper.getAuthToken();
      // Check if the token exists
      if (authToken == null) {
        print('Auth token is null. Cannot make authenticated request.');
        // Throw an specific exception or handle appropriately
        throw Exception('Authentication token not found.');
      }
      print('Auth token: ${authToken.substring(0, 10)}...');

      // Try with `/post/feed` endpoint as seen in logs
      final uri = Uri.parse('$baseUrl/post/feed?page=$page&limit=$limit');
      print('Making request to: $uri');

      final headers = {
        'Authorization': 'Bearer $authToken',
        // Add the custom header here
      };
      print('Request headers: $headers');

      final response = await _client.get(uri, headers: headers);
      print('API response status: ${response.statusCode}');
      // Limit printing large bodies
      print(
        'API response body: ${response.body.length > 500 ? '${response.body.substring(0, 500)}...' : response.body}',
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);

        // Parse the posts array into PostModel objects
        final List<dynamic> apiPosts = jsonData['data'] ?? [];
        print('Found ${apiPosts.length} posts from API for page $page');

        // Extract pagination info
        final Map<String, dynamic> pagination = jsonData['pagination'] ?? {};
        final int totalPosts = pagination['total'] ?? 0;
        final int currentPage = pagination['page'] ?? page;
        final int currentLimit = pagination['limit'] ?? limit;
        final bool hasMorePages = (currentPage * currentLimit) < totalPosts;

        print(
          'Pagination: Total=$totalPosts, CurrentPage=$currentPage, Limit=$currentLimit, HasMore=$hasMorePages',
        );

        if (apiPosts.isEmpty) {
          print('API returned empty posts array for page $page');
          return {
            'posts': <PostModel>[],
            'totalPosts': totalPosts,
            'currentPage': currentPage,
            'hasMorePages': false, // No more pages if the current page is empty
          };
        }

        // If we got posts, try to convert them
        try {
          final posts = PostModel.fromApiResponseList(apiPosts);
          print(
            'Successfully converted ${posts.length} API posts to PostModel objects',
          );

          return {
            'posts': posts,
            'totalPosts': totalPosts,
            'currentPage': currentPage,
            'hasMorePages': hasMorePages,
          };
        } catch (e) {
          print('Error converting API posts to PostModel: $e');
          // Return empty but with pagination info based on what we know
          return {
            'posts': <PostModel>[],
            'totalPosts': totalPosts,
            'currentPage': currentPage,
            'hasMorePages': false, // Assume false on conversion error
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
      // Rethrow specific exception
      throw Exception('Error fetching posts: $e');
    }
  }

  /// Adds a comment to a specific post via the API.
  Future<Comment> addComment(
    String postId,
    String text,
    String authorId,
    String authorName,
    String authorImageUrl,
  ) async {
    // Use the correct baseUrl and endpoint for adding comments
    final url = Uri.parse(
      '$baseUrl/post/$postId/comments',
    ); // Corrected URL using baseUrl
    debugPrint('📬 [PostRepository] Adding comment to post $postId at $url');

    try {
      // Get the auth token
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint(
          '❌ [PostRepository] Auth token is null. Cannot add comment.',
        );
        throw Exception('Authentication token not found.');
      }
      debugPrint('🔑 [PostRepository] Using auth token for adding comment.');

      final response = await _client.post(
        url,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $authToken', // Add the authentication token
        },
        body: jsonEncode(<String, dynamic>{
          'content': text,
          // The backend should associate the comment with the authenticated user via the token.
          // Sending authorId might be redundant if the backend handles it.
          // Adjust based on API requirements.
        }),
      );

      // Accept both 201 (Created) and 200 (OK) as success codes
      if (response.statusCode == 201 || response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        // Check if the API response structure includes a 'success' flag
        if (responseBody['success'] == true && responseBody['data'] != null) {
          debugPrint(
            '✅ [PostRepository] Comment added successfully (Status: ${response.statusCode}): $responseBody',
          );
          final commentData = responseBody['data'];
          if (commentData is Map<String, dynamic>) {
            final createdComment = Comment.fromJson(commentData);
            return createdComment;
          } else {
            debugPrint(
              '❌ [PostRepository] Invalid comment data format in response: $responseBody',
            );
            throw Exception(
              'Failed to parse created comment from API response.',
            );
          }
        } else {
          // Handle cases where status is 200/201 but body indicates failure
          debugPrint(
            '❌ [PostRepository] API indicated failure despite status ${response.statusCode}. Body: ${response.body}',
          );
          throw Exception(
            'API returned success status but indicated failure in body.',
          );
        }
      } else {
        debugPrint(
          '❌ [PostRepository] Failed to add comment. Status: ${response.statusCode}, Body: ${response.body}',
        );
        throw Exception(
          'Failed to add comment. Status code: ${response.statusCode}',
        );
      }
    } catch (e) {
      debugPrint('❌ [PostRepository] Error adding comment: $e');
      // Rethrow a more specific exception if needed, or just the original
      throw Exception('Failed to add comment: $e');
    }
  }

  /// Saves a post via the API.
  Future<bool> savePost(String postId) async {
    final url = Uri.parse('$baseUrl/post/$postId/save'); // Endpoint for saving
    debugPrint('💾 [PostRepository] Saving post $postId at $url');

    try {
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint('❌ [PostRepository] Auth token is null. Cannot save post.');
        throw Exception('Authentication token not found.');
      }

      final response = await _client.post(
        url,
        headers: {
          'Authorization': 'Bearer $authToken',
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('✅ [PostRepository] Post $postId saved successfully.');
        return true;
      } else {
        debugPrint(
          '❌ [PostRepository] Failed to save post $postId. Status: ${response.statusCode}, Body: ${response.body}',
        );
        throw Exception('Failed to save post: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ [PostRepository] Exception while saving post $postId: $e');
      throw Exception('Error saving post: $e');
    }
  }

  /// Unsaves a post via the API.
  Future<bool> unsavePost(String postId) async {
    final url = Uri.parse(
      '$baseUrl/post/$postId/save',
    ); // Endpoint for unsaving (DELETE)
    debugPrint('🗑️ [PostRepository] Unsaving post $postId at $url');

    try {
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint(
          '❌ [PostRepository] Auth token is null. Cannot unsave post.',
        );
        throw Exception('Authentication token not found.');
      }

      final response = await _client.delete(
        // Use DELETE method
        url,
        headers: {'Authorization': 'Bearer $authToken'},
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        // 204 No Content is also common for DELETE success
        debugPrint('✅ [PostRepository] Post $postId unsaved successfully.');
        return true;
      } else {
        debugPrint(
          '❌ [PostRepository] Failed to unsave post $postId. Status: ${response.statusCode}, Body: ${response.body}',
        );
        throw Exception('Failed to unsave post: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint(
        '❌ [PostRepository] Exception while unsaving post $postId: $e',
      );
      throw Exception('Error unsaving post: $e');
    }
  }

  /// Shares a specific post via the API.
  Future<bool> sharePost(String postId) async {
    // Use the correct baseUrl and endpoint for sharing posts
    final url = Uri.parse(
      '$baseUrl/post/$postId/share',
    ); // Corrected URL using baseUrl
    debugPrint('📤 [PostRepository] Sharing post $postId at $url');

    try {
      // Get the auth token
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint('❌ [PostRepository] Auth token is null. Cannot share post.');
        throw Exception('Authentication token not found.');
      }
      debugPrint('🔑 [PostRepository] Using auth token for sharing post.');

      // Define the request body with the privacy setting
      final body = jsonEncode(<String, dynamic>{
        'privacy': 'public', // Default privacy setting. Adjust if needed.
      });
      debugPrint('📤 [PostRepository] Share request body: $body');

      final response = await _client.post(
        url,
        headers: {
          'Content-Type':
              'application/json; charset=UTF-8', // Keep Content-Type for JSON body
          'Authorization': 'Bearer $authToken', // Keep the authentication token
        },
        body: body, // Send the body with the privacy setting
      );

      // Expecting a 200 OK or similar success status
      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        // Check if the API response structure includes a 'success' flag
        if (responseBody['success'] == true) {
          debugPrint(
            '✅ [PostRepository] Post shared successfully (Status: ${response.statusCode}): $responseBody',
          );
          return true; // Indicate success
        } else {
          debugPrint(
            '❌ [PostRepository] API indicated failure despite status ${response.statusCode}. Body: ${response.body}',
          );
          throw Exception(
            'API returned success status but indicated failure in body.',
          );
        }
      } else {
        debugPrint(
          '❌ [PostRepository] Failed to share post. Status: ${response.statusCode}, Body: ${response.body}',
        );
        throw Exception(
          'Failed to share post. Status code: ${response.statusCode}',
        );
      }
    } catch (e) {
      debugPrint('❌ [PostRepository] Error sharing post: $e');
      throw Exception('Failed to share post: $e');
    }
  }

  /// Reports a specific post via the API.
  Future<bool> reportPost(String postId, String reason) async {
    final url = Uri.parse(
      '$baseUrl/post/$postId/report',
    ); // Endpoint for reporting
    debugPrint(
      '🚩 [PostRepository] Starting reportPost for postId: $postId, reason: $reason',
    );
    debugPrint('🚩 [PostRepository] Reporting post at URL: $url');

    try {
      debugPrint(
        '🔑 [PostRepository] Attempting to get auth token for reporting...',
      );
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint(
          '❌ [PostRepository] Auth token is null. Cannot report post.',
        );
        throw Exception('Authentication token not found.');
      }
      debugPrint('🔑 [PostRepository] Auth token retrieved successfully.');

      final headers = {
        'Authorization': 'Bearer $authToken',
        'Content-Type': 'application/json; charset=UTF-8',
      };
      final body = jsonEncode(<String, String>{
        'reason': reason, // Send the reason in the body
      });

      debugPrint('🚩 [PostRepository] Making POST request to $url');
      debugPrint('🚩 [PostRepository] Headers: $headers');
      debugPrint('🚩 [PostRepository] Body: $body');

      final response = await _client.post(url, headers: headers, body: body);

      debugPrint(
        '🚩 [PostRepository] Report API response status: ${response.statusCode}',
      );
      debugPrint(
        '🚩 [PostRepository] Report API response body: ${response.body}',
      );

      // Accept 200, 201 (Created), or 202 (Accepted) as success
      if (response.statusCode == 200 ||
          response.statusCode == 201 ||
          response.statusCode == 202) {
        debugPrint(
          '✅ [PostRepository] Post $postId reported successfully via API.',
        );
        // Optionally parse response body if it contains useful info
        // final responseBody = jsonDecode(response.body);
        return true;
      } else {
        debugPrint(
          '❌ [PostRepository] Failed to report post $postId. API returned status: ${response.statusCode}',
        );
        // Throw an exception to indicate failure based on status code
        throw Exception(
          'Failed to report post: ${response.statusCode}, Body: ${response.body}',
        );
      }
    } catch (e) {
      debugPrint(
        '❌ [PostRepository] Exception caught while reporting post $postId: $e',
      );
      // Rethrow the exception so the BLoC can handle it
      throw Exception('Error reporting post: $e');
    }
  }

  // Clean up resources
  void dispose() {
    _client.close();
  }
}
