import 'package:flutter/material.dart';
import '../../features/profile/models/user_profile_model.dart';

class AppDrawer extends StatelessWidget {
  final UserProfileModel? userProfile;
  
  const AppDrawer({
    Key? key,
    this.userProfile,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Use the provided profile or an empty one if null
    final profile = userProfile ?? UserProfileModel.empty();
    
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
                        CircleAvatar(
                          radius: 30,
                          backgroundImage: profile.avatarUrl.isNotEmpty 
                              ? NetworkImage(profile.avatarUrl) as ImageProvider
                              : const AssetImage('assets/logo.jpg'),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          profile.name,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text(profile.position, style: const TextStyle(fontSize: 14)),
                        const SizedBox(height: 5),
                        Text(profile.location, style: const TextStyle(fontSize: 14)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 8,
                              backgroundImage: profile.companyLogoUrl.isNotEmpty 
                                  ? NetworkImage(profile.companyLogoUrl) as ImageProvider
                                  : const AssetImage('assets/logo.jpg'),
                            ),
                            const SizedBox(width: 5),
                            Flexible(
                              child: Text(
                                profile.companyName,
                                style: const TextStyle(fontSize: 14),
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
                    profile.profileViewers.toString(),
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
                    profile.postImpressions.toString(),
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
          // Only show "Try premium" if the user is not a premium user
          if (!profile.isPremium)
            ListTile(
              dense: true,
              leading: const Icon(Icons.payments_rounded, color: Colors.amber),
              horizontalTitleGap: 5,
              title: const Text(
                'Try premium for EGP0',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              onTap: () {
                Navigator.pop(context);
                // Navigate to premium subscription
              },
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
