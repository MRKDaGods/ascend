// ignore_for_file: use_build_context_synchronously

import 'dart:convert';

import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/features/UserPage/contact_info_section.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:share_plus/share_plus.dart';
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
    required this.profile,
  });

  final Profile profile;
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
  // Use ValueNotifier to track refresh state
  final ValueNotifier<int> _refreshCounter = ValueNotifier<int>(0);

  // Add a new ValueNotifier to track mutual connections
  final ValueNotifier<List<dynamic>> _mutualConnections =
      ValueNotifier<List<dynamic>>([]);

  @override
  void initState() {
    super.initState();
    // Fetch mutual connections if this is not the user's own profile
    if (!widget.isMyProfile && widget.userId != null) {
      _fetchMutualConnections();
    }
  }

  // Force a refresh of connection data
  void _refreshConnectionStatus() {
    _refreshCounter.value++;
  }

  // Fetch mutual connections from the API
  Future<void> _fetchMutualConnections() async {
    if (widget.userId == null) return;

    try {
      final apiClient = ApiClient();
      final response = await apiClient.get(
        '/connection/connections/mutual/${widget.userId}',
      );

      if (response.statusCode == 200) {
        final data = Map<String, dynamic>.from(jsonDecode(response.body));
        if (data["success"] == true && data["data"]["data"] != null) {
          _mutualConnections.value = List<dynamic>.from(data["data"]["data"]);
        }
      }
    } catch (e) {
      debugPrint('Error fetching mutual connections: $e');
    }
  }

  @override
  void dispose() {
    _refreshCounter.dispose();
    _mutualConnections.dispose();
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
              return Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed:
                          () => _sendConnectionRequest(context, widget.userId!),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        minimumSize: const Size(0, 40),
                      ),
                      child: const Text(
                        'Connect',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      _showProfileOptionsBottomSheet(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade300,
                      minimumSize: const Size(0, 40),
                      shape: const CircleBorder(),
                      padding: EdgeInsets.zero,
                      elevation: 0,
                    ),
                    child: const Icon(Icons.more_horiz, color: Colors.black54),
                  ),
                ],
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
                return Row(
                  children: [
                    Expanded(
                      flex: 4,
                      child: ElevatedButton.icon(
                        icon: const Icon(
                          Icons.send,
                          color: Colors.white,
                          size: 18,
                        ),
                        onPressed: () {
                          // Navigate to messaging screen with this user
                          // TODO: Implement navigation to message screen
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Message feature coming soon'),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          minimumSize: const Size(0, 40),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          elevation: 0,
                        ),
                        label: const Text(
                          'Message',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        _showProfileOptionsBottomSheet(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey.shade300,
                        minimumSize: const Size(40, 40),
                        shape: const CircleBorder(),
                        padding: EdgeInsets.zero,
                        elevation: 0,
                      ),
                      child: const Icon(
                        Icons.more_horiz,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                );
              } else if (status == 'pending') {
                if (direction == 'outgoing') {
                  return Row(
                    children: [
                      Expanded(
                        flex: 4,
                        child: ElevatedButton(
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
                            minimumSize: const Size(0, 40),
                          ),
                          child: const Text(
                            'Pending - Cancel',
                            style: TextStyle(color: Colors.black54),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () {
                          _showProfileOptionsBottomSheet(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey.shade300,
                          minimumSize: const Size(40, 40),
                          shape: const CircleBorder(),
                          padding: EdgeInsets.zero,
                          elevation: 0,
                        ),
                        child: const Icon(
                          Icons.more_horiz,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  );
                } else if (direction == 'incoming') {
                  return Row(
                    children: [
                      Expanded(
                        flex: 2,
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
                        flex: 2,
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
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () {
                          _showProfileOptionsBottomSheet(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey.shade300,
                          minimumSize: const Size(40, 40),
                          shape: const CircleBorder(),
                          padding: EdgeInsets.zero,
                          elevation: 0,
                        ),
                        child: const Icon(
                          Icons.more_horiz,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  );
                }
              }

              // Default case - not connected
              return Row(
                children: [
                  Expanded(
                    flex: 4,
                    child: ElevatedButton(
                      onPressed: () {
                        _sendConnectionRequest(context, widget.userId!);
                        _refreshConnectionStatus(); // Refresh after sending request
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        minimumSize: const Size(0, 40),
                      ),
                      child: const Text(
                        'Connect',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      _showProfileOptionsBottomSheet(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade300,
                      minimumSize: const Size(40, 40),
                      shape: const CircleBorder(),
                      padding: EdgeInsets.zero,
                      elevation: 0,
                    ),
                    child: const Icon(Icons.more_horiz, color: Colors.black54),
                  ),
                ],
              );
            }

            return Row(
              children: [
                Expanded(
                  flex: 4,
                  child: ElevatedButton(
                    onPressed: () {
                      _sendConnectionRequest(context, widget.userId!);
                      _refreshConnectionStatus(); // Refresh after sending request
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      minimumSize: const Size(0, 40),
                    ),
                    child: const Text(
                      'Connect',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 1,
                  child: ElevatedButton(
                    onPressed: () {
                      _showProfileOptionsBottomSheet(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade300,
                      minimumSize: const Size(0, 40),
                      shape: const CircleBorder(),
                      padding: EdgeInsets.zero,
                      elevation: 0,
                    ),
                    child: const Icon(Icons.more_horiz, color: Colors.black54),
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showAboutProfileDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      isScrollControlled: true, // Allows the sheet to expand properly
      builder: (BuildContext context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Custom Drag Handle
            Stack(
              children: [
                SizedBox(width: double.infinity, height: 35),
                Center(
                  child: Container(
                    width: 54,
                    height: 7,
                    decoration: BoxDecoration(
                      color: Colors.grey[400],
                      borderRadius: BorderRadius.circular(3),
                    ),
                    margin: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ],
            ),

            // Main content with padding
            Padding(
              padding: const EdgeInsets.only(bottom: 16, left: 16, right: 16),
              child: Wrap(
                children: [
                  Row(
                    children: [
                      Text(
                        "${widget.profile.firstName} ${widget.profile.lastName}",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(width: 8),
                      widget.profile.namePronunciation != null
                          ? Icon(Icons.volume_up, size: 20)
                          : const SizedBox(width: 2),
                    ],
                  ),
                  const SizedBox(height: 20),
                  _buildInfoRow(
                    "Joined",
                    widget.profile.createdAt != null
                        ? "${widget.profile.createdAt!.month} ${widget.profile.createdAt!.year}"
                        : "N/A",
                  ),
                  _buildInfoRow(
                    "Contact information",
                    widget.profile.contactInfo?.updatedAt != null
                        ? "Updated over ${_calculateTimeAgo(widget.profile.contactInfo!.updatedAt!)}"
                        : "N/A",
                  ),
                  _buildInfoRow(
                    "widget.profilephoto",
                    widget.profile.profilePictureUrl != null
                        ? "Updated over ${_calculateTimeAgo(widget.profile.updatedAt!)}"
                        : "N/A",
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [Text(value, style: const TextStyle(color: Colors.grey))],
          ),
        ],
      ),
    );
  }

  String _calculateTimeAgo(DateTime date) {
    final Duration difference = DateTime.now().difference(date);
    if (difference.inDays >= 365) {
      return "${difference.inDays ~/ 365} year(s) ago";
    } else if (difference.inDays >= 30) {
      return "${difference.inDays ~/ 30} month(s) ago";
    } else if (difference.inDays >= 1) {
      return "${difference.inDays} day(s) ago";
    } else {
      return "less than a day ago";
    }
  }

  // New method to show profile options bottom sheet
  void _showProfileOptionsBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return FutureBuilder<Map<String, dynamic>>(
          future: _checkConnectionStatus(widget.userId!),
          builder: (context, snapshot) {
            bool isFollowing = false;

            if (snapshot.hasData) {
              isFollowing = snapshot.data!['is_following'] as bool? ?? false;
            }

            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ListTile(
                    leading: const Icon(Icons.share_outlined),
                    title: const Text('Share profile'),
                    onTap: () async {
                      Navigator.pop(context);

                      final String shareUrl =
                          'https://www.ascendx.tech/profile?id=${widget.userId}';
                      final String shareText =
                          'Check out this profile on AscendX: $shareUrl';

                      try {
                        await Share.share(shareText);
                      } catch (e) {
                        ScaffoldMessenger.of(Get.context!).showSnackBar(
                          SnackBar(
                            content: Text('Could not share profile: $e'),
                          ),
                        );
                      }
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.contact_phone_outlined),
                    title: const Text('View contact info'),
                    onTap: () {
                      Navigator.pop(context);
                      showModalBottomSheet(
                        context: Get.context!,
                        builder:
                            (context) => ContactInfoSection(
                              profile: widget.profile,
                              isMyProfile: widget.isMyProfile,
                            ),
                      );
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.remove_circle_outline),
                    title: const Text('Remove connection'),
                    onTap: () {
                      Navigator.pop(context);
                      _showDisconnectConfirmation(context);
                    },
                  ),
                  const Divider(),
                  ListTile(
                    leading: Icon(
                      isFollowing
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                    ),
                    title: Text(isFollowing ? 'Unfollow' : 'Follow'),
                    onTap: () {
                      Navigator.pop(context);
                      if (isFollowing) {
                        _unfollowUser(context, widget.userId!);
                      } else {
                        _followUser(context, widget.userId!);
                      }
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.flag_outlined),
                    title: const Text('Report or block'),
                    onTap: () {
                      Navigator.pop(context);
                      _showReportBlockOptions(context, widget.userId!);
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.info_outline),
                    title: const Text('About this profile'),
                    onTap: () {
                      Navigator.pop(context);

                      _showAboutProfileDialog(Get.context!);
                    },
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // Show report and block options
  void _showReportBlockOptions(BuildContext context, String userId) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return FutureBuilder<bool>(
          future: _checkIfUserIsBlocked(userId),
          builder: (context, snapshot) {
            bool isBlocked = snapshot.data ?? false;

            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ListTile(
                    leading: Icon(isBlocked ? Icons.person_add : Icons.block),
                    title: Text(isBlocked ? 'Unblock user' : 'Block user'),
                    subtitle: Text(
                      isBlocked
                          ? 'Allow this user to see your profile and contact you'
                          : 'They won\'t be able to see your profile or contact you',
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      if (isBlocked) {
                        _unblockUser(context, userId);
                      } else {
                        _showBlockConfirmation(context, userId);
                      }
                    },
                  ),
                  if (!isBlocked)
                    ListTile(
                      leading: const Icon(Icons.report_outlined),
                      title: const Text('Report this profile'),
                      subtitle: const Text(
                        'Let us know if something seems off',
                      ),
                      onTap: () {
                        Navigator.pop(context);
                        _showReportDialog(context, userId);
                      },
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // Check if user is blocked
  Future<bool> _checkIfUserIsBlocked(String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.get('/connection/block/status/$userId');

      if (response.statusCode == 200) {
        final data = Map<String, dynamic>.from(jsonDecode(response.body));
        return data["data"]?['isBlocked'] == true;
      }
      return false;
    } catch (e) {
      debugPrint('Error checking block status: $e');
      return false;
    }
  }

  // Show confirmation dialog for blocking
  void _showBlockConfirmation(BuildContext context, String userId) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Block User'),
            content: const Text(
              'When you block someone:\n'
              '• They won\'t be able to see your profile\n'
              '• Any existing connections will be removed\n'
              '• They won\'t be able to message you\n\n'
              'Are you sure you want to block this user?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  _blockUser(context, userId);
                },
                child: const Text('Block', style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
    );
  }

  // Show dialog for reporting user
  void _showReportDialog(BuildContext context, String userId) {
    final TextEditingController reasonController = TextEditingController();

    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Report User'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Please explain why you\'re reporting this profile:',
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: reasonController,
                  decoration: const InputDecoration(
                    hintText: 'Enter reason',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  if (reasonController.text.trim().isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please enter a reason')),
                    );
                    return;
                  }
                  _reportUser(context, userId, reasonController.text.trim());
                  Navigator.pop(context);
                },
                child: const Text('Submit Report'),
              ),
            ],
          ),
    );
  }

  // Block a user
  Future<void> _blockUser(BuildContext context, String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.post('/connection/block/$userId');

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('User blocked successfully')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      } else {
        ScaffoldMessenger.of(
          Get.context!,
        ).showSnackBar(const SnackBar(content: Text('Failed to block user')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error blocking user: $e')));
    }
  }

  // Unblock a user
  Future<void> _unblockUser(BuildContext context, String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.delete('/connection/block/$userId');

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('User unblocked successfully')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      } else {
        ScaffoldMessenger.of(
          Get.context!,
        ).showSnackBar(const SnackBar(content: Text('Failed to unblock user')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error unblocking user: $e')));
    }
  }

  // Report a user
  Future<void> _reportUser(
    BuildContext context,
    String userId,
    String reason,
  ) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.post(
        '/auth/report-user',
        data: {'user_id': userId, 'reason': reason},
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(
            content: Text(
              'Thank you for your report. We will review it shortly.',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Failed to submit report')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error submitting report: $e')));
    }
  }

  // Confirmation dialog for disconnecting
  void _showDisconnectConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Remove Connection'),
            content: const Text(
              'Are you sure you want to remove this connection?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  _disconnectUser(context, widget.userId!);
                },
                child: const Text(
                  'Remove',
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ],
          ),
    );
  }

  // Method to disconnect from a user
  Future<void> _disconnectUser(BuildContext context, String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.delete('/connection/$userId');

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Connection removed successfully')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      } else {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Failed to remove connection')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error removing connection: $e')));
    }
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

        // Also check if following this user
        final followStatus = await _checkFollowingStatus(userId);

        return {
          'status': data["data"]['status'] ?? 'notConnected',
          'direction': data["data"]['direction'] ?? '',
          'connection_request_id': relationshipData['connection_request_id'],
          'connection_count': relationshipData['connection_count'],
          'is_following': followStatus['is_following'] ?? false,
        };
      }
      return {'status': 'notConnected', 'direction': '', 'is_following': false};
    } catch (e) {
      debugPrint('Error checking connection status: $e');
      return {'status': 'notConnected', 'direction': '', 'is_following': false};
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

  // Check if following a user
  Future<Map<String, dynamic>> _checkFollowingStatus(String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.get(
        '/connection/follows/status/$userId',
      );

      if (response.statusCode == 200) {
        final data = Map<String, dynamic>.from(jsonDecode(response.body));
        if (data["success"] == true) {
          return {'is_following': data["data"]['isFollowing'] ?? false};
        }
      }
      return {'is_following': false};
    } catch (e) {
      debugPrint('Error checking following status: $e');
      return {'is_following': false};
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
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Connection request sent')),
        );

        _refreshConnectionStatus();
      }
    } catch (e) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(
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
        ScaffoldMessenger.of(Get.context!).showSnackBar(
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
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Connection request accepted')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
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

      if (requestId == null) {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
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
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Connection request declined')),
        );
        _refreshConnectionStatus(); // Refresh connection status
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error declining request: $e')));
    }
  }

  // Follow a user
  Future<void> _followUser(BuildContext context, String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.post('/connection/follow/$userId');

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(
          Get.context!,
        ).showSnackBar(const SnackBar(content: Text('Now following user')));
        _refreshConnectionStatus(); // Refresh connection status
      } else {
        ScaffoldMessenger.of(
          Get.context!,
        ).showSnackBar(const SnackBar(content: Text('Failed to follow user')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error following user: $e')));
    }
  }

  // Unfollow a user
  Future<void> _unfollowUser(BuildContext context, String userId) async {
    try {
      final apiClient = ApiClient();
      final response = await apiClient.delete('/connection/follow/$userId');

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(
          Get.context!,
        ).showSnackBar(const SnackBar(content: Text('Unfollowed user')));
        _refreshConnectionStatus(); // Refresh connection status
      } else {
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Failed to unfollow user')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        Get.context!,
      ).showSnackBar(SnackBar(content: Text('Error unfollowing user: $e')));
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
                _buildConnectionButton(context),
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
    return ValueListenableBuilder<List<dynamic>>(
      valueListenable: _mutualConnections,
      builder: (context, mutualConnections, child) {
        if (mutualConnections.isEmpty && widget.mutualConnections.isEmpty) {
          return const SizedBox.shrink();
        }

        return GestureDetector(
          onTap: () {
            _showMutualConnectionsDialog(context, mutualConnections);
          },
          child: Row(
            children: [
              const Icon(Icons.people, size: 16),
              const SizedBox(width: 5),
              Expanded(
                child:
                    mutualConnections.isNotEmpty
                        ? _buildDynamicMutualConnectionsText(mutualConnections)
                        : Text(
                          widget.mutualConnections.length > 2
                              ? "${widget.mutualConnections.take(2).join(', ')} , and ${widget.mutualConnections.length - 2} other mutual connections"
                              : "${widget.mutualConnections.join(', and ')} are mutual connections",
                          style: const TextStyle(
                            decoration: TextDecoration.underline,
                          ),
                        ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDynamicMutualConnectionsText(List<dynamic> mutualConnections) {
    if (mutualConnections.isEmpty) return const SizedBox.shrink();

    final int count = mutualConnections.length;
    if (count == 1) {
      final connection = mutualConnections.first;
      return Text(
        "${connection['first_name']} ${connection['last_name']} is a mutual connection",
        style: const TextStyle(decoration: TextDecoration.underline),
      );
    } else if (count == 2) {
      return Text(
        "${mutualConnections[0]['first_name']} ${mutualConnections[0]['last_name']} and "
        "${mutualConnections[1]['first_name']} ${mutualConnections[1]['last_name']} are mutual connections",
        style: const TextStyle(decoration: TextDecoration.underline),
      );
    } else {
      return Text(
        "${mutualConnections[0]['first_name']} ${mutualConnections[0]['last_name']}, "
        "${mutualConnections[1]['first_name']} ${mutualConnections[1]['last_name']}, "
        "and ${count - 2} other mutual connections",
        style: const TextStyle(decoration: TextDecoration.underline),
      );
    }
  }

  void _showMutualConnectionsDialog(
    BuildContext context,
    List<dynamic> mutualConnectionsData,
  ) {
    // Use the API data if available, otherwise fall back to the string list
    final bool useApiData = mutualConnectionsData.isNotEmpty;
    final List<String> legacyMutualConnections = widget.mutualConnections;

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Mutual Connections"),
          content: SizedBox(
            width: double.maxFinite,
            height: 300, // Set a fixed height to avoid overflow
            child:
                useApiData
                    ? ListView.builder(
                      shrinkWrap: true,
                      itemCount: mutualConnectionsData.length,
                      itemBuilder: (context, index) {
                        final connection = mutualConnectionsData[index];
                        return ListTile(
                          leading: CircleAvatar(
                            backgroundImage:
                                connection['profile_picture_url'] != null
                                    ? NetworkImage(
                                      connection['profile_picture_url'],
                                    )
                                    : null,
                            child:
                                connection['profile_picture_url'] == null
                                    ? Text(
                                      '${connection['first_name']?[0] ?? ''}${connection['last_name']?[0] ?? ''}',
                                      style: const TextStyle(
                                        color: Colors.white,
                                      ),
                                    )
                                    : null,
                          ),
                          title: Text(
                            "${connection['first_name']} ${connection['last_name']}",
                          ),
                          subtitle:
                              connection['bio'] != null &&
                                      connection['bio'].toString().isNotEmpty
                                  ? Text(
                                    connection['bio'],
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  )
                                  : null,
                          onTap: () {
                            Navigator.pop(context);
                            // Navigate to user profile using the user_id
                            if (connection['user_id'] != null) {
                              // Add navigation to user profile here
                              // For example: Navigator.pushNamed(context, '/profile/${connection['user_id']}');
                            }
                          },
                        );
                      },
                    )
                    : ListView.builder(
                      shrinkWrap: true,
                      itemCount: legacyMutualConnections.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          title: Text(legacyMutualConnections[index]),
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
