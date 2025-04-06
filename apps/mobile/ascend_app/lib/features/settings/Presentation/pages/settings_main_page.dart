import 'package:flutter/material.dart';
import 'package:ascend_app/features/settings/presentation/widgets/settings_list_item.dart';

class SettingsMainPage extends StatelessWidget {
  const SettingsMainPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final settingsItems = [
      {'title': 'Account Preferences', 'route': '/accountPreferences'},
      {'title': 'Sign In & Security', 'route': '/signInSecurity'},
      {'title': 'Visibility', 'route': '/visibility'},
      {'title': 'Data Privacy', 'route': '/dataPrivacy'},
      {'title': 'Advertising Data', 'route': '/advertisingData'},
      {'title': 'Notifications', 'route': '/notifications'},
      {'title': 'Help Center', 'route': '/helpCenter'},
      {'title': 'Legal Information', 'route': '/legalInformation'},
      {'title': 'Sign Out', 'route': '/signOut'},
      {
        'title': 'Version: 4.1.1038',
        'route': null,
      }, // No navigation for version
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView.builder(
        itemCount: settingsItems.length,
        itemBuilder: (context, index) {
          final item = settingsItems[index];
          return SettingsListItem(
            title: item['title']!,
            onTap:
                item['route'] != null
                    ? () => Navigator.pushNamed(context, item['route']!)
                    : null,
          );
        },
      ),
    );
  }
}
