import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';

class ConnectionRequestsReceivedListFull extends StatefulWidget {
  final Function(String) onAccept;
  final Function(String) onDecline;

  const ConnectionRequestsReceivedListFull({
    super.key,
    required this.onAccept,
    required this.onDecline,
  });

  @override
  State<ConnectionRequestsReceivedListFull> createState() =>
      _ConnectionRequestsReceivedListFullState();
}

class _ConnectionRequestsReceivedListFullState
    extends State<ConnectionRequestsReceivedListFull>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<bool> isSelectedList = [true, false, false];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        if (state is ConnectionRequestSuccess) {
          if (state.pendingRequestsReceived.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.people_outline,
                      size: 64,
                      color: Colors.grey[400],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No pending connection requests',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          // Calculate counts for each category
          final allCount = state.pendingRequestsReceived.length;
          final newsletterCount = 0; // Assuming no newsletter requests for now
          final peopleCount = state.pendingRequestsReceived.length;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Filter chips with white background
              Container(
                color: Colors.white,
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        _buildFilterChip(
                          'All ($allCount)',
                          isSelectedList[0],
                          () {
                            setState(() {
                              isSelectedList = [true, false, false];
                              _tabController.animateTo(0);
                            });
                          },
                        ),
                        const SizedBox(width: 12),
                        _buildFilterChip(
                          'Newsletter ($newsletterCount)',
                          isSelectedList[1],
                          () {
                            setState(() {
                              isSelectedList = [false, true, false];
                              _tabController.animateTo(1);
                            });
                          },
                        ),
                        const SizedBox(width: 12),
                        _buildFilterChip(
                          'People ($peopleCount)',
                          isSelectedList[2],
                          () {
                            setState(() {
                              isSelectedList = [false, false, true];
                              _tabController.animateTo(2);
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Divider between filter and content
              const Divider(height: 1, thickness: 1, color: Color(0xFFE0E0E0)),

              // Content section with TabBarView
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  physics:
                      const NeverScrollableScrollPhysics(), // Prevent swiping between tabs
                  children: [
                    // All Tab
                    _buildRequestList(state.pendingRequestsReceived),

                    // Newsletter Tab (Empty for now)
                    _buildEmptyTabContent('No newsletter requests'),

                    // People Tab
                    _buildRequestList(state.pendingRequestsReceived),
                  ],
                ),
              ),
            ],
          );
        } else {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(20.0),
              child: CircularProgressIndicator(),
            ),
          );
        }
      },
    );
  }

  Widget _buildRequestList(List<UserPendingModel> requests) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 0),
      itemCount: requests.length,
      separatorBuilder:
          (_, __) =>
              const Divider(height: 1, thickness: 1, indent: 0, endIndent: 0),
      itemBuilder: (context, index) {
        final request = requests[index];
        return _buildLinkedInStyleItem(
          request,
          widget.onAccept,
          widget.onDecline,
        );
      },
    );
  }

  Widget _buildEmptyTabContent(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox_outlined, size: 48, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            message,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color:
              isSelected
                  ? Theme.of(context).primaryColor.withOpacity(0.1)
                  : Colors.grey[50],
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color:
                isSelected ? Theme.of(context).primaryColor : Colors.grey[300]!,
            width: 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color:
                isSelected ? Theme.of(context).primaryColor : Colors.grey[800],
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            fontSize: 13,
          ),
        ),
      ),
    );
  }

  Widget _buildLinkedInStyleItem(
    UserPendingModel request,
    Function(String) onAccept,
    Function(String) onDecline,
  ) {
    return InkWell(
      onTap: () {
        // Navigate to user profile page when card is clicked
        if (request.user_id != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder:
                  (context) => UserProfilePage(
                    profileId: int.tryParse(request.user_id!),
                  ),
            ),
          );
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        color: Colors.white,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile image or initials
            request.profile_picture_url != null &&
                    request.profile_picture_url!.isNotEmpty
                ? CircleAvatar(
                  radius: 24,
                  backgroundImage: NetworkImage(request.profile_picture_url!),
                )
                : CircleAvatar(
                  radius: 24,
                  backgroundColor: Colors.blue,
                  child: Text(
                    request.first_name?.isNotEmpty == true
                        ? request.first_name![0].toUpperCase()
                        : 'U',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
            const SizedBox(width: 12),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "${request.first_name ?? ''} ${request.last_name ?? ''}",
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            if (request.message != null &&
                                request.message!.isNotEmpty) ...[
                              Text(
                                request.message!,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                            // Mutual connections display
                            if (request.connected_users != null &&
                                request.connected_users!.isNotEmpty) ...[
                              Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.people,
                                      size: 14,
                                      color: Colors.grey[600],
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      "${request.connected_users_count ?? request.connected_users!.length} mutual connection${(request.connected_users_count ?? request.connected_users!.length) > 1 ? 's' : ''}",
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                            // Time ago display
                            Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Text(
                                _getTimeAgo(request.created_at),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[500],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          _buildActionButton(
                            onPressed: () => onDecline(request.id ?? ''),
                            icon: Icons.close,
                            backgroundColor: Colors.white,
                            iconColor: Colors.black,
                            borderColor: Colors.grey[300]!,
                          ),
                          const SizedBox(width: 8),
                          _buildActionButton(
                            onPressed: () => onAccept(request.id ?? ''),
                            icon: Icons.check,
                            backgroundColor: Colors.white,
                            iconColor: Colors.blue,
                            borderColor: Colors.blue,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Updated helper method to calculate time ago from DateTime
  String _getTimeAgo(DateTime? dateTime) {
    if (dateTime == null) return "Recently";

    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inSeconds < 60) {
      return "Just now";
    } else if (difference.inMinutes < 60) {
      final minutes = difference.inMinutes;
      return "$minutes minute${minutes > 1 ? 's' : ''} ago";
    } else if (difference.inHours < 24) {
      final hours = difference.inHours;
      return "$hours hour${hours > 1 ? 's' : ''} ago";
    } else if (difference.inDays < 7) {
      final days = difference.inDays;
      return "$days day${days > 1 ? 's' : ''} ago";
    } else if (difference.inDays < 14) {
      return "1 week ago";
    } else if (difference.inDays < 30) {
      final weeks = (difference.inDays / 7).floor();
      return "$weeks week${weeks > 1 ? 's' : ''} ago";
    } else if (difference.inDays < 365) {
      final months = (difference.inDays / 30).floor();
      return "$months month${months > 1 ? 's' : ''} ago";
    } else {
      final years = (difference.inDays / 365).floor();
      return "$years year${years > 1 ? 's' : ''} ago";
    }
  }

  Widget _buildActionButton({
    required VoidCallback onPressed,
    required IconData icon,
    required Color backgroundColor,
    required Color iconColor,
    required Color borderColor,
  }) {
    return InkWell(
      onTap: onPressed,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: backgroundColor,
          border: Border.all(color: borderColor, width: 1.5),
        ),
        child: Center(child: Icon(icon, color: iconColor, size: 20)),
      ),
    );
  }
}
