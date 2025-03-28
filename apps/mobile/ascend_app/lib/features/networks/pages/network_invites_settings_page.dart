import 'package:flutter/material.dart';

class NetworkInvitesSettingsPage extends StatefulWidget {
  const NetworkInvitesSettingsPage({super.key});

  @override
  _NetworkInvitesSettingsPageState createState() =>
      _NetworkInvitesSettingsPageState();
}

class _NetworkInvitesSettingsPageState
    extends State<NetworkInvitesSettingsPage> {
  bool allowPageInvitations = true;
  bool allowEventInvitations = true;
  bool allowNewsletterInvitations = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Network invites",
          style: TextStyle(color: Colors.black),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline, color: Colors.black),
            onPressed: () {
              // Add help functionality here
            },
          ),
        ],
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Allow your network and pages you engage with to send you invitations to follow pages?",
              style: TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 25),
            _buildSwitchTile("Allow page invitations", allowPageInvitations, (
              value,
            ) {
              setState(() {
                allowPageInvitations = value;
              });
            }),
            Text(
              "Allow your network and pages you engage with to send you invitations to attend events?",
              style: const TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 25),
            _buildSwitchTile("Allow event invitations", allowEventInvitations, (
              value,
            ) {
              setState(() {
                allowEventInvitations = value;
              });
            }),
            Text(
              "Allow your network and pages you engage with to send you newsletter invitations?",
              style: const TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 25),
            _buildSwitchTile(
              "Allow newsletter invitations",
              allowNewsletterInvitations,
              (value) {
                setState(() {
                  allowNewsletterInvitations = value;
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.6,
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 30,
                  color: Colors.grey,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            Transform.scale(
              scale: 1.6,
              child: Switch(
                value: value,
                onChanged: onChanged,
                activeColor: Colors.blue,
                activeTrackColor: Colors.blue.shade100,
              ),
            ),
          ],
        ),
        const SizedBox(height: 25),
      ],
    );
  }
}
