import 'package:flutter/material.dart';
import 'package:ascend_app/features/settings/presentation/widgets/settings_list_item.dart';

class SettingsMainPage extends StatefulWidget {
  const SettingsMainPage({Key? key}) : super(key: key);

  @override
  State<SettingsMainPage> createState() => _SettingsMainPageState();
}

class _SettingsMainPageState extends State<SettingsMainPage> {
  @override
  Widget build(BuildContext context) {
    // Main settings items
    final settingsItems = [
      {
        'title': 'Account Preferences',
        'route': '/accountPreferences',
        'icon': Icons.person,
      },
      {
        'title': 'Sign In & Security',
        'route': '/signInSecurity',
        'icon': Icons.lock,
      },
      {'title': 'Visibility', 'route': '/visibility', 'icon': Icons.visibility},
      {
        'title': 'Data Privacy',
        'route': '/dataPrivacy',
        'icon': Icons.privacy_tip,
      },
      {
        'title': 'Advertising Data',
        'route': '/advertisingData',
        'icon': Icons.ad_units,
      },
      {
        'title': 'Notifications',
        'route': '/notifications',
        'icon': Icons.notifications,
      },
    ];

    // Other settings items
    final otherSettingsItems = [
      {'title': 'Help Center', 'route': '/helpCenter', 'icon': Icons.help},
      {'title': 'Sign Out', 'route': '/signOut', 'icon': Icons.logout},
      {'title': 'Version: 4.1.1038', 'route': null},
    ];

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text(''), // Empty title
          actions: [
            IconButton(
              icon: const Icon(Icons.settings), // Settings icon
              onPressed: () {
                print('Settings icon tapped'); // Action for the settings icon
              },
            ),
          ],
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Image and "Settings" Text
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20, // Profile image size
                    backgroundImage: NetworkImage(
                      'https://via.placeholder.com/150', // Replace with user's profile image URL
                    ),
                  ),
                  const SizedBox(width: 10), // Spacing between image and text
                  const Text(
                    'Settings',
                    style: TextStyle(
                      fontSize: 36, // Larger font size
                      fontWeight: FontWeight.bold, // Bold text
                    ),
                  ),
                ],
              ),
            ),
            // Settings List
            Expanded(
              child: ListView(
                children: [
                  // Main Settings Items
                  ...settingsItems.map((item) {
                    return Column(
                      children: [
                        SettingsListItem(
                          title: item['title'] as String,
                          leading: item['icon'] as IconData?,
                          titleStyle: const TextStyle(
                            fontSize: 22, // Larger font size
                            fontWeight: FontWeight.bold, // Bold text
                          ),
                          onTap:
                              item['route'] != null
                                  ? () => Navigator.pushNamed(
                                    context,
                                    item['route'] as String,
                                  )
                                  : null,
                        ),
                        const SizedBox(height: 8), // Spacing between items
                        if (item['title'] == 'Notifications')
                          Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16.0,
                            ),
                            child: const Divider(
                              thickness: 1.5, // Divider thickness
                            ),
                          ),
                      ],
                    );
                  }).toList(),
                  // Other Settings Items
                  ...otherSettingsItems.map((item) {
                    return SettingsListItem(
                      title: item['title'] as String,
                      leading: item['icon'] as IconData?,
                      titleStyle: const TextStyle(
                        fontSize: 17, // Slightly smaller font size
                        fontWeight: FontWeight.normal, // Normal weight
                      ),
                      onTap:
                          item['route'] != null
                              ? () => Navigator.pushNamed(
                                context,
                                item['route'] as String,
                              )
                              : null,
                    );
                  }).toList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
