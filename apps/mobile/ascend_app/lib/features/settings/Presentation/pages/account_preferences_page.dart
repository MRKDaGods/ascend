import 'package:flutter/material.dart';

class AccountPreferencesPage extends StatelessWidget {
  const AccountPreferencesPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Account Preferences'),
      ),
      body: const Center(
        child: Text('Account Preferences Page'),
      ),
    );
  }
}