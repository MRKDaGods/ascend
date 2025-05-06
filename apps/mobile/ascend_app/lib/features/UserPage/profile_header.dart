// ignore_for_file: use_build_context_synchronously

import 'dart:convert';

import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'profile_header_links.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';

class ProfileHeader extends StatefulWidget {
  const ProfileHeader({
    super.key,
    required this.name,
    required this.bio,
    required this.location,
    required this.latestEducation,
    required this.connections,
    required this.isconnect,
    required this.isPending,
    this.mutualConnections = const [],
    this.links = const [],
    this.verified = false,
    this.degree = '1st',
    this.isMyProfile = false,
    this.namePronunciation = false,
    this.showSchool = true,
    this.showCurrentCompany = true,
    this.currentPosition = '',
    this.userId,
  });

  final String name;
  final bool namePronunciation;
  final String bio;
  final String location;
  final String latestEducation;
  final int connections;
  final bool isconnect;
  final bool isPending;
  final List<String> mutualConnections;
  final List<Map<String, String>> links;
  final bool showSchool;
  final bool showCurrentCompany;
  final String currentPosition;
  final bool verified;
  final String degree;
  final bool isMyProfile;
  final String? userId;

  @override
  State<ProfileHeader> createState() => _ProfileHeaderState();
}

class _ProfileHeaderState extends State<ProfileHeader> {
  // Key for refreshing connection status
  final GlobalKey _connectionKey = GlobalKey();

  // Use ValueNotifier to track refresh state
  final ValueNotifier<int> _refreshCounter = ValueNotifier<int>(0);

  // Force a refresh of connection data
  void _refreshConnectionStatus() {
    _refreshCounter.value++;
  }

  @override
  void dispose() {
    _refreshCounter.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.name.isNotEmpty) _buildNameSection(),
        if (widget.name.isNotEmpty && widget.bio.isNotEmpty)
          const SizedBox(height: 12),

        if (widget.bio.isNotEmpty) _buildBioSection(),
        if (widget.bio.isNotEmpty &&
            (widget.latestEducation.isNotEmpty ||
                widget.location.isNotEmpty ||
                (widget.showCurrentCompany &&
                    widget.currentPosition.isNotEmpty)))
          const SizedBox(height: 16),

        if (widget.latestEducation.isNotEmpty ||
            widget.location.isNotEmpty ||
            (widget.showCurrentCompany && widget.currentPosition.isNotEmpty))
          _buildEducationLocationSection(),
        if ((widget.latestEducation.isNotEmpty ||
                widget.location.isNotEmpty ||
                (widget.showCurrentCompany &&
                    widget.currentPosition.isNotEmpty)) &&
            widget.links.isNotEmpty)
          const SizedBox(height: 12),

        if (widget.links.isNotEmpty) _buildLinks(context),
        if (widget.links.isNotEmpty) const SizedBox(height: 8),

        // Only build connections section if we have a user ID to fetch data for
        if (!widget.isMyProfile && widget.userId != null) ...[
          _buildConnectionsSection(),
        ] else if (widget.connections > 0)
          _buildStaticConnectionsSection(),

        if (widget.connections > 0 &&
            widget.mutualConnections.isNotEmpty &&
            !widget.isMyProfile)
          const SizedBox(height: 8),

        if (widget.mutualConnections.isNotEmpty && !widget.isMyProfile)
          _buildMutualConnections(context),
      ],
    );
  }

  Widget _buildNameSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            Text(
              widget.name,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(width: 8),
            if (widget.verified)
              const Icon(Icons.gpp_good_outlined, size: 20, color: Colors.blue),
            const SizedBox(width: 5),
            if (widget.namePronunciation)
              const Icon(Icons.volume_up_outlined, size: 20),
            const SizedBox(width: 5),
            Text(widget.degree, style: const TextStyle(color: Colors.white70)),
          ],
        ),
      ],
    );
  }

  Widget _buildBioSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.bio,
          style: const TextStyle(fontSize: 16, height: 1.4),
          textAlign: TextAlign.left,
        ),
      ],
    );
  }

  // New method to build connection button based on connection status with refresh capability
  Widget _buildConnectionButton(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: _refreshCounter,
      builder: (context, refreshValue, child) {
        return FutureBuilder<Map<String, dynamic>>(
          key: ValueKey(
            'connectionButton-$refreshValue',
          ), // Force rebuild on refresh
          future: _checkConnectionStatus(widget.userId!),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return ElevatedButton(
                onPressed:
                    () => _sendConnectionRequest(context, widget.userId!),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  minimumSize: const Size(double.infinity, 40),
                ),
                child: const Text(
                  'Connect',
                  style: TextStyle(color: Colors.white),
                ),
              );
            } else if (snapshot.hasData) {
              final status = snapshot.data!['status'] as String;
              final direction = snapshot.data!['direction'] as String?;

              int? requestId;
              try {
                requestId = snapshot.data!['connection_request_id'] as int?;
              } catch (e) {
                requestId = null;
              }

              if (status == 'connected') {
                return ElevatedButton(
                  onPressed: null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey.shade300,
                    minimumSize: const Size(double.infinity, 40),
                  ),
                  child: const Text(
                    'Connected',
                    style: TextStyle(color: Colors.black54),
                  ),
                );
              } else if (status == 'pending') {
                if (direction == 'outgoing') {
                  return ElevatedButton(
                    onPressed: () {
                      _cancelConnectionRequest(
                        context,
                        widget.userId!,
                        requestId,
                      );
                      _refreshConnectionStatus(); // Refresh after cancellation
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade300,
                      minimumSize: const Size(double.infinity, 40),
                    ),
                    child: const Text(
                      'Pending - Cancel',
                      style: TextStyle(color: Colors.black54),
                    ),
                  );
                } else if (direction == 'incoming') {
                  return Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            _acceptConnectionRequest(
                              context,
                              widget.userId!,
                              requestId,
                            );
                            _refreshConnectionStatus(); // Refresh after accepting
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            minimumSize: const Size(0, 40),
                          ),
                          child: const Text(
                            'Accept',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            _declineConnectionRequest(context, widget.userId!);
                            _refreshConnectionStatus(); // Refresh after declining
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey.shade300,
                            minimumSize: const Size(0, 40),
                          ),
                          child: const Text(
                            'Decline',
                            style: TextStyle(color: Colors.black54),
                          ),
                        ),
                      ),
                    ],
                  );
                }
              }

              return ElevatedButton(
                onPressed: () {
                  _sendConnectionRequest(context, widget.userId!);
                  _refreshConnectionStatus(); // Refresh after sending request
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  minimumSize: const Size(double.infinity, 40),
                ),
                child: const Text(
                  'Connect',
                  style: TextStyle(color: Colors.white),
                ),
              );
            }

            return ElevatedButton(
              onPressed: () {
                _sendConnectionRequest(context, widget.userId!);
                _refreshConnectionStatus(); // Refresh after sending request
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                minimumSize: const Size(double.infinity, 40),
              ),
              child: const Text(
                'Connect',
                style: TextStyle(color: Colors.white),
              ),
            );
          },
        );
      },
    );
  }

  // Helper methods for connection actions
  Future<Map<String, dynamic>> _checkConnectionStatus(String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.get(
        '/connection/connections/status/$userId',
      );

      if (response.statusCode == 200) {
        final data = Map<String, dynamic>.from(jsonDecode(response.body));
        if (data["success"] != true) {
          return {'status': 'notConnected', 'direction': ''};
        }

        // Get connection relationship data to get request ID and connection count
        final relationshipData = await _getConnectionRelationship(userId);

        return {
          'status': data["data"]['status'] ?? 'notConnected',
          'direction': data["data"]['direction'] ?? '',
          'connection_request_id': relationshipData['connection_request_id'],
          'connection_count': relationshipData['connection_count'],
        };
      }
      return {'status': 'notConnected', 'direction': ''};
    } catch (e) {
      debugPrint('Error checking connection status: $e');
      return {'status': 'notConnected', 'direction': ''};
    }
  }

  Future<Map<String, dynamic>> _getConnectionRelationship(String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.get(
        '/connection/connections/rels/$userId',
      );

      if (response.statusCode == 200) {
        final data = Map<String, dynamic>.from(jsonDecode(response.body));
        if (data["success"] == true) {
          return {
            'connection_count':
                data["data"]['connection_count'] ?? widget.connections,
            'connection_request_id':
                data["data"]['connection_request_id'] ?? '',
          };
        }
      }
      return {
        'connection_count': widget.connections,
        'connection_request_id': '',
      };
    } catch (e) {
      debugPrint('Error getting connection relationship: $e');
      return {
        'connection_count': widget.connections,
        'connection_request_id': '',
      };
    }
  }

  Future<void> _sendConnectionRequest(
    BuildContext context,
    String userId,
  ) async {
    try {
      // Display a popup and ask for connection message
      final msg = await showDialog<String>(
        context: context,
        builder: (BuildContext context) {
          String message = '';

          return AlertDialog(
            title: const Text('Send Connection Request'),
            content: TextField(
              onChanged: (value) {
                message = value;
              },
              decoration: const InputDecoration(hintText: 'Enter message'),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, message),
                child: const Text('Send'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
            ],
          );
        },
      );

      if (msg == null || msg.isEmpty) {
        return;
      }

      final apiClient = sl.apiClient;
      final response = await apiClient.post(
        '/connection/request',
        data: {'userId': userId, "message": msg},
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Connection request sent')),
        );

        _refreshConnectionStatus();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error sending connection request: $e')),
      );
    }
  }

  Future<void> _cancelConnectionRequest(
    BuildContext context,
    String userId,
    int? requestId,
  ) async {
    try {
      if (requestId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cannot find connection request')),
        );
        return;
      }

      final apiClient = ApiClient();
      final response = await apiClient.delete('/connection/request/$requestId');

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Connection request canceled')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error canceling request: $e')));
    }
  }

  Future<void> _acceptConnectionRequest(
    BuildContext context,
    String userId,
    int? requestId,
  ) async {
    try {
      if (requestId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cannot find connection request')),
        );
        return;
      }

      final apiClient = ApiClient();
      final response = await apiClient.put(
        '/connection/respond/$requestId',
        data: {'accept': true},
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Connection request accepted')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error accepting request: $e')));
    }
  }

  Future<void> _declineConnectionRequest(
    BuildContext context,
    String userId,
  ) async {
    try {
      // First get the connection relationship to get the request ID
      final relationshipData = await _getConnectionRelationship(userId);
      final requestId = relationshipData['connection_request_id'];

      if (requestId == null || requestId.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cannot find connection request')),
        );
        return;
      }

      final apiClient = ApiClient();
      final response = await apiClient.put(
        '/connection/respond/$requestId',
        data: {'accept': false},
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Connection request declined')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error declining request: $e')));
    }
  }

  // Static connections section for my profile
  Widget _buildStaticConnectionsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.connections < 500
              ? '${widget.connections} connections'
              : '500+ connections',
          style: TextStyle(
            color: !widget.isconnect ? Colors.grey[900] : Colors.blue,
          ),
        ),
        const SizedBox(height: 5),
      ],
    );
  }

  // Dynamic connections section with loading state
  Widget _buildConnectionsSection() {
    return ValueListenableBuilder<int>(
      valueListenable: _refreshCounter,
      builder: (context, refreshValue, child) {
        return FutureBuilder<Map<String, dynamic>>(
          key: ValueKey(
            'connectionCount-$refreshValue',
          ), // Force rebuild on refresh
          future: _getConnectionRelationship(widget.userId!),
          builder: (context, snapshot) {
            // Show loading indicator while fetching data
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const SizedBox(
                height: 40,
                child: Center(child: CircularProgressIndicator()),
              );
            }

            // Handle errors by displaying the default value
            if (snapshot.hasError) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.connections < 500
                        ? '${widget.connections} connections'
                        : '500+ connections',
                    style: TextStyle(
                      color: !widget.isconnect ? Colors.grey[900] : Colors.blue,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: 200,
                    height: 36,
                    child: _buildConnectionButton(context),
                  ),
                ],
              );
            }

            // Display the data once loaded
            int connectionCount = widget.connections; // Default
            if (snapshot.hasData) {
              final ccDyn = snapshot.data?['connection_count'];
              connectionCount =
                  (ccDyn is String ? int.tryParse(ccDyn) : ccDyn) ??
                  widget.connections;
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  connectionCount < 500
                      ? '$connectionCount connections'
                      : '500+ connections',
                  style: TextStyle(
                    color: !widget.isconnect ? Colors.grey[900] : Colors.blue,
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: 200,
                  height: 36,
                  child: _buildConnectionButton(context),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildEducationLocationSection() {
    bool hasCurrentPosition =
        widget.showCurrentCompany && widget.currentPosition.isNotEmpty;
    bool hasEducation = widget.showSchool && widget.latestEducation.isNotEmpty;
    bool hasLocation = widget.location.isNotEmpty;

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (hasCurrentPosition || hasEducation)
          Wrap(
            spacing: 5,
            runSpacing: 5,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              if (hasCurrentPosition)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.work_outline, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      widget.currentPosition,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              if (hasCurrentPosition && hasEducation)
                const Text("•", style: TextStyle(fontSize: 14)),
              if (hasEducation)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.school_outlined, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      widget.latestEducation,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        if ((hasCurrentPosition || hasEducation) && hasLocation)
          const SizedBox(height: 8),
        if (hasLocation)
          Row(
            children: [
              const Icon(Icons.location_on_outlined, size: 16),
              const SizedBox(width: 4),
              Text(
                widget.location,
                style: const TextStyle(fontSize: 14, color: Colors.grey),
              ),
            ],
          ),
      ],
    );
  }

  Widget _buildLinks(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.links.isNotEmpty)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 5),
              ProfileExtraMaterial(links: widget.links),
            ],
          ),
        const SizedBox(height: 5),
      ],
    );
  }

  Widget _buildMutualConnections(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _showMutualConnectionsDialog(context, widget.mutualConnections);
      },
      child: Row(
        children: [
          const Icon(Icons.people, size: 16),
          const SizedBox(width: 5),
          Expanded(
            child: Text(
              widget.mutualConnections.length > 2
                  ? "${widget.mutualConnections.take(2).join(', ')} , and ${widget.mutualConnections.length - 2} other mutual connections"
                  : "${widget.mutualConnections.join(', and ')} are mutual connections",
              style: const TextStyle(decoration: TextDecoration.underline),
            ),
          ),
        ],
      ),
    );
  }

  void _showMutualConnectionsDialog(
    BuildContext context,
    List<String> mutualConnections,
  ) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Mutual Connections"),
          content: SizedBox(
            width: double.maxFinite,
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: mutualConnections.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(mutualConnections[index]),
                  onTap: () {
                    Navigator.pop(context);
                  },
                );
              },
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Close", style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }
}
