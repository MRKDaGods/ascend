import 'package:flutter/material.dart';

class InvitationsSettingsPage extends StatefulWidget {
  const InvitationsSettingsPage({Key? key}) : super(key: key);

  @override
  State<InvitationsSettingsPage> createState() =>
      _InvitationsSettingsPageState();
}

class _InvitationsSettingsPageState extends State<InvitationsSettingsPage> {
  String _selectedOption = "Everyone on LinkedIn (recommended)";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 1,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: const Text(
          "Connection invites",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline, color: Colors.black),
            onPressed: () {
              // Add help functionality here
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Who can send you invitations to connect?",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            // Option 1
            RadioListTile<String>(
              value: "Everyone on LinkedIn (recommended)",
              groupValue: _selectedOption,
              onChanged: (value) {
                setState(() {
                  _selectedOption = value!;
                });
              },
              title: const Text(
                "Everyone on LinkedIn (recommended)",
                style: TextStyle(fontSize: 20, color: Colors.black),
              ),
            ),
            const SizedBox(height: 16),
            // Option 2
            RadioListTile<String>(
              value:
                  "Only people who know your email address or appear in your 'Imported Contacts' list",
              groupValue: _selectedOption,
              onChanged: (value) {
                setState(() {
                  _selectedOption = value!;
                });
              },
              title: const Text(
                "Only people who know your email address or appear in your 'Imported Contacts' list",
                style: TextStyle(fontSize: 20, color: Colors.black),
              ),
            ),
            const SizedBox(height: 16),
            // Option 3
            RadioListTile<String>(
              value: "Only people who appear in your 'Imported Contacts' list",
              groupValue: _selectedOption,
              onChanged: (value) {
                setState(() {
                  _selectedOption = value!;
                });
              },
              title: const Text(
                "Only people who appear in your 'Imported Contacts' list",
                style: TextStyle(fontSize: 20, color: Colors.black),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
