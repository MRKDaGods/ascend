import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../widgets/reported_user_card.dart'; // Import the ReportedUserCard widget
import '../widgets/banned_user_card.dart'; // Import the new BannedUserCard widget
import '../../bloc/users/bloc/users_bloc.dart'; // Import the UsersBloc

class UsersPage extends StatefulWidget {
  const UsersPage({super.key});

  @override
  State<UsersPage> createState() => _UsersPageState();
}

class _UsersPageState extends State<UsersPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final Map<String, bool> _expandedReports = {};
  final List<Map<String, String>> _bannedUsers = [
    {
      'id': 'user3',
      'name': 'Alice Johnson',
      'email': 'alice.johnson@example.com',
      'date': 'Banned: 2023-04-10',
    },
    {
      'id': 'user4',
      'name': 'Bob Brown',
      'email': 'bob.brown@example.com',
      'date': 'Banned: 2023-03-25',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);

    // Trigger the FetchReportedUsers event when the page loads
    context.read<UsersBloc>().add(FetchReportedUsers());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _toggleReportsVisibility(String userId) {
    setState(() {
      _expandedReports[userId] = !(_expandedReports[userId] ?? false);
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
    // Add logic to ban the user
    debugPrint('Ban user with ID: $userId');
  }

  void _handleUnbanUser(BuildContext context, String userId) {
    // Add logic to unban the user
    debugPrint('Unban user with ID: $userId');
    setState(() {
      _bannedUsers.removeWhere((user) => user['id'] == userId);
    });
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
                      return ListView.builder(
                        itemCount: state.reports.length,
                        itemBuilder: (context, index) {
                          final reportedUser =
                              state
                                  .reports[index]
                                  .reported; // Extract ReportedUser
                          return ReportedUserCard(
                            name:
                                '${reportedUser.firstName} ${reportedUser.lastName}',
                            email: reportedUser.email,
                            date: 'Joined: ${reportedUser.joinedAt.toLocal()}',
                            reports: [
                              state.reports[index].reason,
                            ], // Optional: Display reason
                            showReports:
                                _expandedReports[reportedUser.userId
                                    .toString()] ??
                                false,
                            onToggleReports:
                                () => _toggleReportsVisibility(
                                  reportedUser.userId.toString(),
                                ),
                            userId:
                                reportedUser.userId
                                    .toString(), // Pass the userId here
                            handleDeleteUser:
                                () => _handleDeleteUser(
                                  context,
                                  reportedUser.userId.toString(),
                                ),
                            onBan:
                                () => _handleBanUser(
                                  context,
                                  reportedUser.userId.toString(),
                                ),
                          );
                        },
                      );
                    } else if (state is UsersError) {
                      return Center(
                        child: Text(
                          'Error: ${state.message}',
                          style: const TextStyle(color: Colors.red),
                        ),
                      );
                    } else {
                      return const Center(child: Text('No data available.'));
                    }
                  },
                ),
                // Banned Users Section
                ListView(
                  children:
                      _bannedUsers.map((user) {
                        return BannedUserCard(
                          name: user['name']!,
                          email: user['email']!,
                          date: user['date']!,
                          onUnban: () => _handleUnbanUser(context, user['id']!),
                        );
                      }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
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
