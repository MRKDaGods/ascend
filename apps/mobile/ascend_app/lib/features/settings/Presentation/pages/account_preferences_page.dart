import 'package:flutter/material.dart';

class AccountPreferencesPage extends StatefulWidget {
  const AccountPreferencesPage({Key? key}) : super(key: key);

  @override
  State<AccountPreferencesPage> createState() => _AccountPreferencesPageState();
}

class _AccountPreferencesPageState extends State<AccountPreferencesPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Account Preferences')),
      body: const Center(child: Text('Account Preferences Page')),
    );
  }
}
