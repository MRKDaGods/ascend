import 'dart:convert';

import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:ascend_app/features/networks/utils/helper_functions.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class MessagingRequestsPage extends StatefulWidget {
  const MessagingRequestsPage({super.key});

  @override
  State<MessagingRequestsPage> createState() => _MessagingRequestsPageState();
}

class _MessagingRequestsPageState extends State<MessagingRequestsPage>
    with SingleTickerProviderStateMixin {
  final ValueNotifier<int> _refreshCounter = ValueNotifier<int>(0);
  bool _isLoading = false;
  int? _currentUserId;
  TabController? _tabController; // Make nullable

  // Fix for TabController initialization
  final _debounceTimer = ValueNotifier<DateTime>(DateTime.now());

  @override
  void initState() {
    super.initState();
    // Initialize TabController immediately in initState
    _tabController = TabController(length: 4, vsync: this);
    _getCurrentUserId();

    // Refresh data only once after the widget is built
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _refreshRequests();
      }
    });
  }

  Future<void> _getCurrentUserId() async {
    // Get current user ID from your auth service or preferences
    try {
      final userId = await SecureStorageHelper.getUserId();
      if (userId != null) {
        _currentUserId = int.tryParse(userId);
      } else {
        debugPrint('User ID not found in secure storage');
      }
    } catch (e) {
      debugPrint('Error getting current user ID: $e');
    }
  }

  @override
  void dispose() {
    _refreshCounter.dispose();
    _tabController?.dispose();
    super.dispose();
  }

  // Force refresh of the requests - Add debounce to prevent multiple rapid refreshes
  void _refreshRequests() {
    final now = DateTime.now();
    // Prevent refreshing more than once every 2 seconds
    if (now.difference(_debounceTimer.value).inSeconds >= 2) {
      _debounceTimer.value = now;
      _refreshCounter.value++;
    }
  }

  @override
  Widget build(BuildContext context) {
    // No need to check for null TabController since it's initialized in initState
    return Scaffold(
      appBar: AppBar(
        title: const Text('Message Requests'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshRequests,
          ),
        ],
        bottom: TabBar(
          controller: _tabController!, // Now we can safely use it
          tabs: const [
            Tab(text: 'Received'),
            Tab(text: 'Sent'),
            Tab(text: 'Accepted'),
            Tab(text: 'Rejected'),
          ],
          labelColor: Theme.of(context).primaryColor,
          unselectedLabelColor: Colors.grey,
          indicatorSize: TabBarIndicatorSize.tab,
        ),
      ),
      body: ValueListenableBuilder<int>(
        valueListenable: _refreshCounter,
        builder: (context, refreshValue, child) {
          return FutureBuilder<List<dynamic>>(
            key: ValueKey('messageRequests-$refreshValue'),
            future: _fetchMessageRequests(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasError) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Error loading message requests',
                        style: TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _refreshRequests,
                        child: const Text('Try Again'),
                      ),
                    ],
                  ),
                );
              }

              final allRequests = snapshot.data ?? [];
              if (allRequests.isEmpty) {
                return const Center(
                  child: Text(
                    'No message requests',
                    style: TextStyle(fontSize: 16),
                  ),
                );
              }

              // Print current user ID and debug all requests
              debugPrint(
                'DEBUG: Current user ID: $_currentUserId (${_currentUserId.runtimeType})',
              );
              for (var request in allRequests) {
                debugPrint(
                  'DEBUG: Request ID: ${request['id']}, '
                  'user_id: ${request['user_id']} (${request['user_id'].runtimeType}), '
                  'status: ${request['status']}',
                );
              }

              // Sort requests by status and direction
              final receivedRequests =
                  allRequests
                      .where(
                        (request) =>
                            request['user_id'] == _currentUserId &&
                            request['status']?.toLowerCase() == 'pending',
                      )
                      .toList();
              debugPrint(
                'DEBUG: Received requests count: ${receivedRequests.length}',
              );

              final sentRequests =
                  allRequests.where((request) {
                    return request['user_id'] != _currentUserId &&
                        request['status']?.toLowerCase() == 'pending';
                  }).toList();
              debugPrint('DEBUG: Sent requests count: ${sentRequests.length}');

              final acceptedRequests =
                  allRequests
                      .where(
                        (request) =>
                            request['status']?.toLowerCase() == 'accepted',
                      )
                      .toList();

              final rejectedRequests =
                  allRequests
                      .where(
                        (request) =>
                            request['status']?.toLowerCase() == 'rejected' ||
                            request['status']?.toLowerCase() == 'declined',
                      )
                      .toList();

              return TabBarView(
                controller: _tabController!, // Add non-null assertion here
                children: [
                  // Received tab
                  _buildRequestList(receivedRequests, isIncoming: true),

                  // Sent tab
                  _buildRequestList(sentRequests, isIncoming: false),

                  // Accepted tab
                  _buildRequestList(acceptedRequests, showStatus: true),

                  // Rejected tab
                  _buildRequestList(rejectedRequests, showStatus: true),
                ],
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildRequestList(
    List<dynamic> requests, {
    bool isIncoming = false,
    bool showStatus = false,
  }) {
    if (requests.isEmpty) {
      return Center(
        child: Text(
          'No requests',
          style: TextStyle(fontSize: 16, color: Colors.grey[600]),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children:
            requests.map((request) {
              if (isIncoming) {
                return _buildIncomingRequestCard(request);
              } else if (showStatus) {
                // For accepted and rejected tabs
                return _buildStatusRequestCard(request);
              } else {
                return _buildOutgoingRequestCard(request);
              }
            }).toList(),
      ),
    );
  }

  // Fetch all message requests
  Future<List<dynamic>> _fetchMessageRequests() async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.get('/connection/message-requests');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return data['data'] ?? [];
        }
      }
      return [];
    } catch (e) {
      debugPrint('Error fetching message requests: $e');
      throw Exception('Failed to load message requests');
    }
  }

  // Build a card for an incoming message request (from another user to me)
  Widget _buildIncomingRequestCard(Map<String, dynamic> request) {
    final String name =
        '${request['first_name'] ?? ''} ${request['last_name'] ?? ''}';
    final String? profilePictureUrl = request['profile_picture_url'];
    final String message = request['message'] ?? 'No message';
    final DateTime? sentAt =
        request['created_at'] != null
            ? DateTime.tryParse(request['created_at'])
            : null;
    final String timeAgo = sentAt != null ? timeDifference(sentAt) : 'Unknown';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage:
                      profilePictureUrl != null
                          ? NetworkImage(profilePictureUrl)
                          : null,
                  child:
                      profilePictureUrl == null
                          ? Text(name.isNotEmpty ? name[0].toUpperCase() : '?')
                          : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        timeAgo,
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(message),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                OutlinedButton(
                  onPressed:
                      _isLoading
                          ? null
                          : () =>
                              _respondToMessageRequest(request['id'], false),
                  child: const Text('Decline'),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed:
                      _isLoading
                          ? null
                          : () => _respondToMessageRequest(request['id'], true),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Accept'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Build a card for an outgoing message request (from me to another user)
  Widget _buildOutgoingRequestCard(Map<String, dynamic> request) {
    final String name =
        '${request['first_name'] ?? ''} ${request['last_name'] ?? ''}';
    final String? profilePictureUrl = request['profile_picture_url'];
    final String message = request['message'] ?? 'No message';
    final DateTime? sentAt =
        request['created_at'] != null
            ? DateTime.tryParse(request['created_at'])
            : null;
    final String timeAgo = sentAt != null ? timeDifference(sentAt) : 'Unknown';
    final String status = request['status'] ?? 'pending';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage:
                      profilePictureUrl != null
                          ? NetworkImage(profilePictureUrl)
                          : null,
                  child:
                      profilePictureUrl == null
                          ? Text(name.isNotEmpty ? name[0].toUpperCase() : '?')
                          : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        timeAgo,
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(status),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    _capitalizeFirst(status),
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(message),
            const SizedBox(height: 16),
            if (status == 'pending')
              Align(
                alignment: Alignment.centerRight,
                child: OutlinedButton(
                  onPressed:
                      _isLoading
                          ? null
                          : () => _cancelMessageRequest(request['id']),
                  style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                  child: const Text('Cancel Request'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // Build a card for accepted or rejected message requests
  Widget _buildStatusRequestCard(Map<String, dynamic> request) {
    final bool isOutgoing = request['user_id'] == _currentUserId;

    // Determine name and profile picture based on direction
    String name;
    String? profilePictureUrl;

    if (isOutgoing) {
      // This is a request I sent to someone else
      name =
          '${request['receiver_first_name'] ?? ''} ${request['receiver_last_name'] ?? ''}';
      profilePictureUrl = request['receiver_profile_picture_url'];
    } else {
      // This is a request someone sent to me
      name = '${request['first_name'] ?? ''} ${request['last_name'] ?? ''}';
      profilePictureUrl = request['profile_picture_url'];
    }

    final String message = request['message'] ?? 'No message';
    final DateTime? sentAt =
        request['created_at'] != null
            ? DateTime.tryParse(request['created_at'])
            : null;
    final String timeAgo = sentAt != null ? timeDifference(sentAt) : 'Unknown';
    final String status = request['status'] ?? 'pending';
    final DateTime? respondedAt =
        request['updated_at'] != null
            ? DateTime.tryParse(request['updated_at'])
            : null;
    final String respondedTimeAgo =
        respondedAt != null ? timeDifference(respondedAt) : '';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage:
                      profilePictureUrl != null
                          ? NetworkImage(profilePictureUrl)
                          : null,
                  child:
                      profilePictureUrl == null
                          ? Text(name.isNotEmpty ? name[0].toUpperCase() : '?')
                          : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        'Request: $timeAgo${respondedTimeAgo.isNotEmpty ? ' • $status: $respondedTimeAgo' : ''}',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(status),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    _capitalizeFirst(status),
                    style: TextStyle(
                      fontSize: 12,
                      color:
                          status.toLowerCase() == 'accepted'
                              ? Colors.green[800]
                              : Colors.red[800],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(message),
            const SizedBox(height: 8),
            Text(
              isOutgoing ? 'You sent this request' : 'Sent to you',
              style: TextStyle(
                fontSize: 12,
                fontStyle: FontStyle.italic,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'accepted':
        return Colors.green[100]!;
      case 'rejected':
        return Colors.red[100]!;
      case 'pending':
      default:
        return Colors.grey[300]!;
    }
  }

  String _capitalizeFirst(String text) {
    if (text.isEmpty) return '';
    return text[0].toUpperCase() + text.substring(1).toLowerCase();
  }

  // Accept or decline an incoming message request
  Future<void> _respondToMessageRequest(int requestId, bool accept) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final apiClient = ApiClient();
      final response = await apiClient.put(
        '/connection/message-request/respond/$requestId',
        data: {'accept': accept},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                accept
                    ? 'Message request accepted'
                    : 'Message request declined',
              ),
            ),
          );
          // Add slight delay before refreshing
          Future.delayed(const Duration(milliseconds: 300), _refreshRequests);
        } else {
          _showError(data['message'] ?? 'Failed to respond to message request');
        }
      } else {
        _showError('Failed to respond to message request');
      }
    } catch (e) {
      _showError('Error: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Cancel an outgoing message request
  Future<void> _cancelMessageRequest(int requestId) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final apiClient = ApiClient();
      final response = await apiClient.delete(
        '/connection/message-request/$requestId',
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Message request cancelled')),
          );
          _refreshRequests();
        } else {
          _showError(data['message'] ?? 'Failed to cancel message request');
        }
      } else {
        _showError('Failed to cancel message request');
      }
    } catch (e) {
      _showError('Error: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }
}
