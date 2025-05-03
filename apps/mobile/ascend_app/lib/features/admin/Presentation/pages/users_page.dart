import 'package:flutter/material.dart';

class UsersPage extends StatefulWidget {
  const UsersPage({Key? key}) : super(key: key);

  @override
  State<UsersPage> createState() => _UsersPageState();
}

class _UsersPageState extends State<UsersPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

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

  void _showAddUserModal() {
    showDialog(
      context: context,
      builder: (context) {
        final TextEditingController firstNameController =
            TextEditingController();
        final TextEditingController lastNameController =
            TextEditingController();
        final TextEditingController emailController = TextEditingController();
        final TextEditingController passwordController =
            TextEditingController();

        return AlertDialog(
          title: const Text(
            'Add New User',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 16),
                TextField(
                  controller: firstNameController,
                  decoration: InputDecoration(
                    labelText: 'First Name',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    filled: true,
                    fillColor: Colors.grey[200],
                  ),
                  style: const TextStyle(fontSize: 18),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: lastNameController,
                  decoration: InputDecoration(
                    labelText: 'Last Name',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    filled: true,
                    fillColor: Colors.grey[200],
                  ),
                  style: const TextStyle(fontSize: 18),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: emailController,
                  decoration: InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    filled: true,
                    fillColor: Colors.grey[200],
                  ),
                  style: const TextStyle(fontSize: 18),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: passwordController,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    filled: true,
                    fillColor: Colors.grey[200],
                  ),
                  obscureText: true,
                  style: const TextStyle(fontSize: 18),
                ),
              ],
            ),
          ),
          actions: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(fontSize: 18, color: Colors.red),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    // Handle user creation logic here
                    final newUser = {
                      "first_name": firstNameController.text,
                      "last_name": lastNameController.text,
                      "email": emailController.text,
                      "password": passwordController.text,
                    };
                    print(newUser); // Replace with actual API call
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  child: const Text('Add', style: TextStyle(fontSize: 18)),
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildUserCard({
    required String name,
    required String email,
    String? date,
    int? reports,
    required List<Widget> actions,
  }) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 4),
            Text(
              email,
              style: const TextStyle(color: Colors.black87, fontSize: 16),
            ),
            if (date != null)
              Text(
                'Date: $date',
                style: const TextStyle(color: Colors.black87, fontSize: 16),
              ),
            if (reports != null)
              Text(
                'Reports: $reports',
                style: const TextStyle(color: Colors.black87, fontSize: 16),
              ),
            const SizedBox(height: 8),
            Row(children: actions),
          ],
        ),
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
                Tab(text: 'Active Users'),
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
                // Active Users Tab
                ListView(
                  children: [
                    _buildUserCard(
                      name: 'John Doe',
                      email: 'john.doe@example.com',
                      date: 'Joined: 2023-01-15',
                      reports: 2,
                      actions: [
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'Ban User',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'Delete User',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'View Reports',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                      ],
                    ),
                    _buildUserCard(
                      name: 'Jane Smith',
                      email: 'jane.smith@example.com',
                      date: 'Joined: 2023-02-20',
                      actions: [
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'Ban User',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'Delete User',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'View Reports',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                // Banned Users Tab
                ListView(
                  children: [
                    _buildUserCard(
                      name: 'Alice Johnson',
                      email: 'alice.johnson@example.com',
                      date: 'Banned: 2023-04-10',
                      actions: [
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'Unban User',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'Delete User',
                            style: TextStyle(fontSize: 16),
                          ),
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
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddUserModal,
        child: const Icon(Icons.add),
      ),
    );
  }
}
