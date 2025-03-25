import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16.0),
                  child: SafeArea(
                    bottom: false,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const CircleAvatar(
                          radius: 30,
                          backgroundImage: AssetImage('assets/logo.jpg'),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'User Name',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text('user postion or bio', style: TextStyle(fontSize: 14)),
                        SizedBox(height: 5),
                        Text('location', style: TextStyle(fontSize: 14)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const CircleAvatar(
                              radius: 8,
                              backgroundImage: AssetImage('assets/logo.jpg'),
                            ),
                            const SizedBox(width: 5),
                            Flexible(
                              child: Text(
                                'Company Name',
                                style: TextStyle(fontSize: 14),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const Divider(),
                // profile viewers
                ListTile(
                  horizontalTitleGap: 5,
                  leading: Text(
                    '32',
                    style: TextStyle(
                      fontSize: 20,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  dense: true,
                  title: const Text('Profile viewers'),
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                ListTile(
                  horizontalTitleGap: 5,
                  leading: Text(
                    '60',
                    style: TextStyle(
                      fontSize: 20,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  dense: true,
                  title: const Text('Post impressions'),
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
                const Divider(),
                ListTile(
                  title: const Text(
                    'Puzzle games',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                ListTile(
                  title: const Text(
                    'Saved posts',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                ListTile(
                  title: const Text(
                    'Groups',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          // Settings at the bottom
          Divider(),
          ListTile(
            dense: true,
            leading: const Icon(Icons.payments_rounded, color: Colors.amber),
            horizontalTitleGap: 5,
            title: const Text(
              'Try premium for EGP0',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
          ListTile(
            horizontalTitleGap: 5,
            leading: const Icon(Icons.settings),
            title: const Text(
              'Settings',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            onTap: () {
              Navigator.pop(context);
              // Navigate to settings
            },
          ),
          SizedBox(height: 16), // Add some padding at the bottom
        ],
      ),
    );
  }
}
