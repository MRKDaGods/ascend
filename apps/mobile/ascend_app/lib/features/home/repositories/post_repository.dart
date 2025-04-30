import '../models/post_model.dart';
import '../models/comment_model.dart';
import '../data/sample_posts.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart'; // For debugPrint
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

  // Fetch Saved Posts
  Future<Map<String, dynamic>> fetchSavedPosts({int page = 1, int limit = 15}) async {
    final uri = Uri.parse('$baseUrl/post/saved?page=$page&limit=$limit');
    debugPrint('🔄 [PostRepository] Fetching saved posts: $uri');

    try {
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint('❌ [PostRepository] Auth token is null. Cannot fetch saved posts.');
        throw Exception('Authentication token not found.');
      }

      final headers = {
        'Authorization': 'Bearer $authToken',
        'Accept': 'application/json',
      };

      final response = await _client.get(uri, headers: headers);
      debugPrint('✅ [PostRepository] Saved Posts API response status: ${response.statusCode}');
      // Limit printing large bodies
      debugPrint(
        '📄 [PostRepository] Saved Posts API response body: ${response.body.length > 500 ? '${response.body.substring(0, 500)}...' : response.body}',
      );


      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        final List<dynamic> apiPosts = jsonData['data'] ?? [];
        final Map<String, dynamic> pagination = jsonData['pagination'] ?? {};
        final int totalPosts = pagination['total'] ?? 0;
        final int currentPage = pagination['page'] ?? page;
        final int currentLimit = pagination['limit'] ?? limit;
        // Calculate hasMorePages based on total, current page, and limit
        final bool hasMorePages = (currentPage * currentLimit) < totalPosts;

        debugPrint(
          '📄 [PostRepository] Saved Posts Pagination: Total=$totalPosts, CurrentPage=$currentPage, Limit=$currentLimit, HasMore=$hasMorePages',
        );

        if (apiPosts.isEmpty) {
           debugPrint('ℹ️ [PostRepository] API returned empty saved posts array for page $page');
          return {
            'posts': <PostModel>[],
            'totalPosts': totalPosts,
            'currentPage': currentPage,
            'hasMorePages': false, // No more pages if current page is empty
          };
        }

        try {
          // Assuming saved posts might not have reaction info, fetch it separately if needed
          // For simplicity, we'll use the standard conversion first.
          final posts = PostModel.fromApiResponseList(apiPosts);
          debugPrint(
            '✅ [PostRepository] Converted ${posts.length} saved API posts to PostModel objects',
          );
          return {
            'posts': posts,
            'totalPosts': totalPosts,
            'currentPage': currentPage,
            'hasMorePages': hasMorePages,
          };
        } catch (e) {
          debugPrint('❌ [PostRepository] Error converting saved API posts: $e');
          // Return empty but with pagination info
           return {
            'posts': <PostModel>[],
            'totalPosts': totalPosts,
            'currentPage': currentPage,
            'hasMorePages': false, // Assume false on conversion error
          };
        }
      } else {
        debugPrint(
          '❌ [PostRepository] Failed to load saved posts. Status: ${response.statusCode}, Body: ${response.body}',
        );
        throw Exception('Failed to load saved posts: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ [PostRepository] Exception fetching saved posts: $e');
      throw Exception('Error fetching saved posts: $e');
    }
  }

  // Get User's Reaction for a Post via API
  Future<String?> getPostReaction(String postId) async {
    final String reactionUrl = '$baseUrl/post/$postId/reactions'; // Endpoint from user image
    debugPrint('❓ Fetching user reaction for post $postId: URL=$reactionUrl');

    try {
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        // Don't throw, just return null as we might not be logged in or allowed to see reactions
        debugPrint('⚠️ Auth token null, cannot fetch reaction for post $postId.');
        return null;
      }

      final headers = {
        'Authorization': 'Bearer $authToken',
        'Accept': 'application/json',
      };

      final response = await _client.get(Uri.parse(reactionUrl), headers: headers);

      debugPrint('Get Reaction Response Status Code: ${response.statusCode}');
      // debugPrint('Get Reaction Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        // *** Adjust parsing based on your actual API response structure ***
        // Assuming response is like: {"data": {"user_reaction": "like"}} or {"data": {"user_reaction": null}}
        final reactionData = responseData['data'];
        if (reactionData is Map<String, dynamic>) {
           final userReaction = reactionData['user_reaction'] as String?;
           debugPrint('✅ Fetched reaction for post $postId: $userReaction');
           return userReaction;
        } else {
           debugPrint('⚠️ Unexpected reaction data format for post $postId: $reactionData');
           return null; // Return null if format is wrong
        }
      } else if (response.statusCode == 404) {
         debugPrint('ℹ️ No specific reaction found for user on post $postId (404).');
         return null; // Treat 404 as no reaction found
      }
      else {
        debugPrint('❌ Failed to fetch reaction for post $postId. Status: ${response.statusCode}, Body: ${response.body}');
        return null; // Return null on other errors, don't block post loading
      }
    } catch (e) {
      debugPrint('❌ Error in getPostReaction for post $postId: $e');
      return null; // Return null on exception
    }
  }

  // Toggle Post Reaction via API
  Future<bool> togglePostReaction(String postId, String? reactionType) async {
    // Use the correct endpoint provided by the user
    final String reactionUrl = '$baseUrl/post/$postId/react';
    debugPrint('🔄 Toggling reaction for post $postId: Type=$reactionType, URL=$reactionUrl');

    try {
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        throw Exception('Authentication token not found.');
      }

      http.Response response;
      final headers = {
        'Authorization': 'Bearer $authToken',
        'Accept': 'application/json',
        'Content-Type': 'application/json', // Needed even for empty body sometimes
      };

      // If reactionType is provided, send it in the body
      if (reactionType != null) {
         debugPrint('  Sending POST with body: {"type": "$reactionType"}');
         response = await _client.post(
           Uri.parse(reactionUrl),
           headers: headers,
           body: jsonEncode({'type': reactionType}),
         );
      } else {
        // If reactionType is null, attempt to remove the reaction.
        // Assuming POST without body or DELETE might work. Let's try POST without body first.
        debugPrint('  Sending POST without body (attempting removal)');
        response = await _client.post(
          Uri.parse(reactionUrl),
          headers: headers,
           // body: jsonEncode({}), // Or send empty JSON object? Test required.
        );
        // Alternative: Try DELETE if POST without body fails
        // debugPrint(' Sending DELETE request for removal');
        // response = await _client.delete(Uri.parse(reactionUrl), headers: headers);
      }


      debugPrint('Toggle Reaction Response Status Code: ${response.statusCode}');
      // debugPrint('Toggle Reaction Response Body: ${response.body}');

      // Check for successful status codes (200 OK, 201 Created, potentially 204 No Content for removal)
      if (response.statusCode == 200 || response.statusCode == 201 || response.statusCode == 204) {
         // Handle empty body for 204 No Content
         final responseBody = response.body;
         final message = (responseBody.isNotEmpty && response.statusCode != 204)
             ? (jsonDecode(responseBody)['data']?['message'] ?? 'Reaction updated')
             : 'Reaction updated/removed'; // Default message for success/204
         debugPrint('✅ Reaction toggled successfully for post $postId. Message: $message');
         return true;
      } else {
        debugPrint('❌ Failed to toggle reaction for post $postId. Status: ${response.statusCode}, Body: ${response.body}');
        throw Exception('Failed to toggle reaction: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ Error in togglePostReaction: $e');
      rethrow;
    }
  }

  /// Adds a comment to a specific post via the API.
  Future<Comment> addComment(
    String postId,
    String text,
    String authorId,
    String authorName,
    String authorImageUrl,
    [String? parentId] // Received here
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
      debugPrint('📬 [PostRepository] addComment called. Received parentId: $parentId'); // Log received parentId


      final Map<String, dynamic> requestBody = {
        'content': text,

      };
      if (parentId != null && parentId.isNotEmpty) {
        // Use 'parentCommentId' to match the API expectation (Postman)
        try {
          final parentIdInt = int.parse(parentId);
          requestBody['parentCommentId'] = parentIdInt; // Use camelCase key
          debugPrint('📬 [PostRepository] Adding reply with parentCommentId (int): $parentIdInt'); // Updated log key
        } catch (e) {
          // If parsing fails, decide if sending as string is acceptable or should error out
          // For now, let's log the error and potentially send as string if API might handle it
          debugPrint('⚠️ [PostRepository] Failed to parse parentId "$parentId" to int. Sending as string (if API supports). Error: $e');
          requestBody['parentCommentId'] = parentId; // Use camelCase key, send as string
          debugPrint('📬 [PostRepository] Adding reply with parentCommentId (String - int parse failed): $parentId'); // Updated log key
        }
      } else {
         debugPrint('📬 [PostRepository] parentId is null or empty. Not adding parentCommentId.'); // Updated log key
      }



      final response = await _client.post(
        url,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $authToken', // Add the authentication token
          // 'x-no-parse-body': 'true', // Temporarily remove this header
        },
        body: jsonEncode(requestBody), // Use the constructed requestBody map
      );

      // Accept both 201 (Created) and 200 (OK) as success codes
      if (response.statusCode == 201 || response.statusCode == 200) {
        // Add logging to see the raw response body
        debugPrint('✅ [PostRepository] Comment add successful (Status: ${response.statusCode}). Raw Body: ${response.body}');
        try {
          final responseBody = jsonDecode(response.body);
          // Check if the API response structure includes a 'success' flag
          if (responseBody['success'] == true && responseBody['data'] != null) {
            debugPrint(
              '✅ [PostRepository] API success flag is true. Data: ${responseBody['data']}',
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
        } catch (e) {
           // Catch JSON decoding errors
           debugPrint('❌ [PostRepository] Failed to decode JSON response: $e. Body: ${response.body}');
           throw Exception('Failed to decode successful API response: $e');
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

  /// Unsaves a post via the API. (Now uses POST to toggle)
  Future<bool> unsavePost(String postId) async {
    final url = Uri.parse(
      '$baseUrl/post/$postId/save',
    ); // Endpoint for saving/unsaving (using POST)
    debugPrint('🔄 [PostRepository] Toggling save state (unsave) for post $postId at $url using POST');

    try {
      final authToken = await SecureStorageHelper.getAuthToken();
      if (authToken == null) {
        debugPrint(
          '❌ [PostRepository] Auth token is null. Cannot unsave post.',
        );
        throw Exception('Authentication token not found.');
      }

      // --- MODIFICATION START ---
      // Use POST method instead of DELETE
      final response = await _client.post(
        url,
        headers: {
          'Authorization': 'Bearer $authToken',
          'Content-Type': 'application/json; charset=UTF-8', // Keep content type if needed by API
        },
        // Add body if the API requires it for unsaving via POST, otherwise remove/empty it
        // body: jsonEncode({}), // Example: Empty body
      );
      // --- MODIFICATION END ---

      // --- MODIFICATION START ---
      // Adjust expected success codes if needed (200/201 are common for POST toggle)
      if (response.statusCode == 200 || response.statusCode == 201) {
      // --- MODIFICATION END ---
        debugPrint('✅ [PostRepository] Post $postId unsaved successfully (toggled via POST).');
        return true;
      } else {
        debugPrint(
          '❌ [PostRepository] Failed to unsave post $postId via POST. Status: ${response.statusCode}, Body: ${response.body}',
        );
        throw Exception('Failed to unsave post: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint(
        '❌ [PostRepository] Exception while unsaving post $postId via POST: $e',
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

  // Fetch comments for a specific post
  Future<List<Comment>> fetchComments(String postId, {int page = 1, int limit = 10}) async {
    final token = await SecureStorageHelper.getAuthToken();
    if (token == null) {
      throw Exception('Authentication token not found.');
    }

    final url = Uri.parse('$baseUrl/post/$postId/comments?page=$page&limit=$limit');
    debugPrint('🔄 [PostRepository] Fetching comments for post $postId from $url');

    try {
      final response = await _client.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      debugPrint('📄 [PostRepository] Comments Response Status: ${response.statusCode}');
      // debugPrint('📄 [PostRepository] Comments Response Body: ${response.body}'); // Optional: Log body

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Assuming the API returns a list of comments directly or under a key like 'comments' or 'data'
        final List<dynamic> commentListJson = data['comments'] ?? data['data'] ?? data;

        final comments = commentListJson
            .map((json) => Comment.fromJson(json as Map<String, dynamic>))
            .toList();
        debugPrint('✅ [PostRepository] Fetched ${comments.length} comments for post $postId.');
        return comments;
      } else {
        debugPrint('❌ [PostRepository] Failed to load comments for post $postId. Status: ${response.statusCode}, Body: ${response.body}');
        throw Exception('Failed to load comments: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ [PostRepository] Error fetching comments for post $postId: $e');
      throw Exception('Error fetching comments: $e');
    }
  }

  // Clean up resources
  void dispose() {
    _client.close();
  }
}
