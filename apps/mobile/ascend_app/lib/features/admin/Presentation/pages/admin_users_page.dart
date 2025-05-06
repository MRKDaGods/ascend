import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../widgets/reported_user_card.dart';
import '../widgets/banned_user_card.dart';
import '../../bloc/users/bloc/users_bloc.dart';

class UsersPage extends StatefulWidget {
  const UsersPage({super.key});

  @override
  State<UsersPage> createState() => _UsersPageState();
}

class _UsersPageState extends State<UsersPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final Map<String, bool> _expandedReports = {};

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);

    // Add a small delay to ensure the widget tree is built
    // This helps prevent state issues on initial load
    Future.microtask(() {
      // Initially load the active tab's data
      if (_tabController.index == 0) {
        context.read<UsersBloc>().add(FetchReportedUsers());
      } else {
        context.read<UsersBloc>().add(FetchBannedUsers());
      }
    });

    // Listen for tab changes to refresh data if needed
    _tabController.addListener(_handleTabChange);
  }

  void _handleTabChange() {
    if (!_tabController.indexIsChanging) {
      // Only trigger when tab change completes
      if (_tabController.index == 0) {
        // Reported Users tab is active
        context.read<UsersBloc>().add(FetchReportedUsers());
      } else {
        // Banned Users tab is active
        context.read<UsersBloc>().add(FetchBannedUsers());
      }
    }
  }

  @override
  void dispose() {
    _tabController.removeListener(_handleTabChange);
    _tabController.dispose();
    super.dispose();
  }

  // Update the toggle method to use reportId
  void _toggleReportsVisibility(String reportId) {
    setState(() {
      _expandedReports[reportId] = !(_expandedReports[reportId] ?? false);
    });
  }

  void _handleDeleteUser(BuildContext context, String userId) {
    showDialog(
      context: context,
      builder:
          (dialogContext) => AlertDialog(
            title: const Text('Delete User'),
            content: const Text(
              'Are you sure you want to delete this reported user?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(dialogContext);
                  context.read<UsersBloc>().add(
                    DeleteUserEvent(userId: int.parse(userId)),
                  );
                },
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Delete'),
              ),
            ],
          ),
    );
  }

  void _handleBanUser(BuildContext context, String userId) {
    final TextEditingController reasonController = TextEditingController();
    final TextEditingController expiresAtController = TextEditingController();

    // Add date picker function
    Future<void> _selectExpirationDate(BuildContext context) async {
      final DateTime? picked = await showDatePicker(
        context: context,
        initialDate: DateTime.now().add(const Duration(days: 30)),
        firstDate: DateTime.now(),
        lastDate: DateTime.now().add(const Duration(days: 365)),
      );
      if (picked != null) {
        expiresAtController.text = picked.toUtc().toIso8601String();
      }
    }

    showDialog(
      context: context,
      builder:
          (dialogContext) => AlertDialog(
            title: const Text('Ban User'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: reasonController,
                  decoration: const InputDecoration(
                    labelText: 'Reason (optional)',
                  ),
                ),
                const SizedBox(height: 16),
                // Update text field to include date picker button
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: expiresAtController,
                        readOnly:
                            true, // Make read-only since we use the picker
                        decoration: const InputDecoration(
                          labelText: 'Ban Expiration (optional)',
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.calendar_today),
                      onPressed: () => _selectExpirationDate(dialogContext),
                      tooltip: 'Select expiration date',
                    ),
                  ],
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(dialogContext);

                  // Add the ban event
                  context.read<UsersBloc>().add(
                    BanUserEvent(
                      userId: int.parse(userId),
                      reason:
                          reasonController.text.isNotEmpty
                              ? reasonController.text
                              : null,
                      expiresAt:
                          expiresAtController.text.isNotEmpty
                              ? expiresAtController.text
                              : null,
                    ),
                  );

                  // Show success message with SnackBar
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('User with ID $userId banned successfully'),
                      backgroundColor: Colors.green,
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Ban'),
              ),
            ],
          ),
    );
  }

  void _handleUnbanUser(BuildContext context, String userId) {
    showDialog(
      context: context,
      builder:
          (dialogContext) => AlertDialog(
            title: const Text('Unban User'),
            content: const Text('Are you sure you want to unban this user?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(dialogContext);
                  // Use the bloc to handle the unban action
                  context.read<UsersBloc>().add(UnbanUser(userId));

                  // After unbanning, refresh the banned users list
                  context.read<UsersBloc>().add(FetchBannedUsers());
                },
                style: TextButton.styleFrom(foregroundColor: Colors.green),
                child: const Text('Unban'),
              ),
            ],
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              tabs: const [
                Tab(text: 'Reported Users'),
                Tab(text: 'Banned Users'),
              ],
              labelColor: Colors.black,
              unselectedLabelColor: Colors.grey,
              indicatorWeight: 4,
              labelStyle: const TextStyle(fontSize: 16),
              onTap: (index) {
                // Refresh data when tab is tapped
                if (index == 0) {
                  context.read<UsersBloc>().add(FetchReportedUsers());
                } else {
                  context.read<UsersBloc>().add(FetchBannedUsers());
                }
              },
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Reported Users Section
                BlocBuilder<UsersBloc, UsersState>(
                  builder: (context, state) {
                    if (state is UsersLoading) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (state is UsersLoaded) {
                      if (state.reports.isEmpty) {
                        return const Center(
                          child: Text('No reported users found.'),
                        );
                      }
                      return ListView.builder(
                        itemCount: state.reports.length,
                        itemBuilder: (context, index) {
                          final report = state.reports[index];
                          final reportReasons = [report.reason];
                          // Update ReportedUserCard to accept a unique reportId:
                          return ReportedUserCard(
                            name:
                                '${report.reported.firstName} ${report.reported.lastName}',
                            email: report.reported.email,
                            date: DateFormat(
                              'MMM d, y',
                            ).format(report.reported.joinedAt),
                            reports: reportReasons,
                            showReports:
                                _expandedReports[report.id.toString()] ??
                                false, // Use report.id instead of userId
                            onToggleReports:
                                () => _toggleReportsVisibility(
                                  report.id.toString(),
                                ), // Use report.id
                            userId: report.reported.userId.toString(),
                            handleDeleteUser:
                                () => _handleDeleteUser(
                                  context,
                                  report.reported.userId.toString(),
                                ),
                            onBan:
                                () => _handleBanUser(
                                  context,
                                  report.reported.userId.toString(),
                                ),
                            profilePictureUrl:
                                report.reported.profilePictureUrl,
                            coverPhotoUrl: report.reported.coverPhotoUrl,
                            // Add reporter information
                            reporterId: report.reportedById,
                            reporterFirstName: report.reportedBy.firstName,
                            reporterLastName: report.reportedBy.lastName,
                            reporterProfilePictureUrl:
                                report.reportedBy.profilePictureUrl,
                          );
                        },
                      );
                    } else if (state is UserBannedState ||
                        state is UserDeletedState) {
                      // Show success message and trigger refresh
                      String message =
                          state is UserBannedState
                              ? 'User with ID ${(state as UserBannedState).userId} has been banned successfully!'
                              : 'User with ID ${(state as UserDeletedState).userId} has been deleted successfully!';

                      // After displaying success message, refresh the list
                      Future.delayed(const Duration(seconds: 2), () {
                        if (mounted) {
                          context.read<UsersBloc>().add(FetchReportedUsers());
                        }
                      });

                      return Center(
                        child: Text(
                          message,
                          style: const TextStyle(
                            color: Colors.green,
                            fontSize: 16,
                          ),
                        ),
                      );
                    } else if (state is UsersError) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Error: ${state.message}',
                              style: const TextStyle(
                                color: Colors.red,
                                fontSize: 16,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: () {
                                context.read<UsersBloc>().add(
                                  FetchReportedUsers(),
                                );
                              },
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      );
                    } else {
                      // Critical fix: Always trigger a fetch if we don't have the right state
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        context.read<UsersBloc>().add(FetchReportedUsers());
                      });
                      return const Center(child: CircularProgressIndicator());
                    }
                  },
                ),

                // Banned Users Section
                BlocBuilder<UsersBloc, UsersState>(
                  builder: (context, state) {
                    if (state is UsersLoading) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (state is BannedUsersLoaded) {
                      if (state.bannedUsers.isEmpty) {
                        return const Center(
                          child: Text('No banned users found.'),
                        );
                      }

                      return ListView.builder(
                        itemCount: state.bannedUsers.length,
                        itemBuilder: (context, index) {
                          final bannedUser = state.bannedUsers[index];
                          return BannedUserCard(
                            name: bannedUser.fullName,
                            email: bannedUser.email,
                            date:
                                'Banned on ${DateFormat('MMM d, y').format(bannedUser.createdAt)}',
                            onUnban:
                                () => _handleUnbanUser(
                                  context,
                                  bannedUser.userId.toString(),
                                ),
                            profilePictureUrl: bannedUser.profilePictureUrl,
                            coverPhotoUrl: bannedUser.coverPhotoUrl,
                            bannedByName: bannedUser.bannerFullName,
                            bannedById: bannedUser.bannedBy,
                          );
                        },
                      );
                    } else if (state is UserUnbannedState) {
                      // After displaying success message, refresh the list
                      Future.delayed(const Duration(seconds: 2), () {
                        if (mounted) {
                          context.read<UsersBloc>().add(FetchBannedUsers());
                        }
                      });

                      return Center(
                        child: Text(
                          'User with ID ${state.userId} has been unbanned successfully!',
                          style: const TextStyle(
                            color: Colors.green,
                            fontSize: 16,
                          ),
                        ),
                      );
                    } else if (state is UsersError) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Error: ${state.message}',
                              style: const TextStyle(
                                color: Colors.red,
                                fontSize: 16,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: () {
                                context.read<UsersBloc>().add(
                                  FetchBannedUsers(),
                                );
                              },
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      );
                    } else {
                      // If we don't have data yet but not in loading state, trigger a fetch
                      if (state is! UsersLoaded) {
                        WidgetsBinding.instance.addPostFrameCallback((_) {
                          context.read<UsersBloc>().add(FetchBannedUsers());
                        });
                      }
                      return const Center(
                        child: Text('Loading banned users...'),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ],
      ),
      // Preserved floating action buttons
      floatingActionButton: Stack(
        children: [
          // Positive Action Button
          Positioned(
            bottom: 16,
            right: 80, // Adjust spacing between buttons
            child: FloatingActionButton(
              onPressed: () {
                // Negative action logic
                debugPrint('Negative action triggered');
              },
              backgroundColor: Colors.red,
              child: const Icon(Icons.remove),
            ),
          ),
          Positioned(
            bottom: 16,
            right: 16,
            child: FloatingActionButton(
              onPressed: () {
                // Add user modal logic
              },
              child: const Icon(Icons.add),
            ),
          ),
          // Negative Action Button
        ],
      ),
    );
  }
}
