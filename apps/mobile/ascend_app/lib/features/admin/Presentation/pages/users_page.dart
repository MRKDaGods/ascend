import 'package:flutter/material.dart';
import '../widgets/reported_user_card.dart'; // Import the ReportedUserCard widget
import '../widgets/banned_user_card.dart'; // Import the new BannedUserCard widget

class UsersPage extends StatefulWidget {
  const UsersPage({Key? key}) : super(key: key);

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
    // Add logic to delete the user
    print('Delete user with ID: $userId');
  }

  void _handleBanUser(BuildContext context, String userId) {
    // Add logic to ban the user
    print('Ban user with ID: $userId');
  }

  void _handleUnbanUser(BuildContext context, String userId) {
    // Add logic to unban the user
    print('Unban user with ID: $userId');
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
                ListView(
                  children: [
                    ReportedUserCard(
                      name: 'John Doe',
                      email: 'john.doe@example.com',
                      date: 'Joined: 2023-01-15',
                      reports: 2,
                      showReports: _expandedReports['user1'] ?? false,
                      onToggleReports: () => _toggleReportsVisibility('user1'),
                      onDelete: () => _handleDeleteUser(context, 'user1'),
                      onBan: () => _handleBanUser(context, 'user1'),
                    ),
                    ReportedUserCard(
                      name: 'Jane Smith',
                      email: 'jane.smith@example.com',
                      date: 'Joined: 2023-02-20',
                      reports: 3,
                      showReports: _expandedReports['user2'] ?? false,
                      onToggleReports: () => _toggleReportsVisibility('user2'),
                      onDelete: () => _handleDeleteUser(context, 'user2'),
                      onBan: () => _handleBanUser(context, 'user2'),
                    ),
                  ],
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
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Add user modal logic
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
