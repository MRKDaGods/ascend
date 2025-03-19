import 'package:flutter/material.dart';

class ProfileOptionsSheet extends StatelessWidget {
  const ProfileOptionsSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      children: [
        Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min, // Takes only needed height
            children: [
              _buildSheetOption(context, Icons.send, "Send profile in a message"),
              _buildSheetOption(context, Icons.share, "Share via..."),
              _buildSheetOption(context, Icons.perm_contact_calendar, "Contact info"),
              _buildSheetOption(context, Icons.request_page, "Request a recommendation"),
              _buildSheetOption(context, Icons.thumb_up, "Recommend"),
              _buildSheetOption(context, Icons.person_remove, "Unfollow"),
              _buildSheetOption(context, Icons.person_off, "Remove connection"),
              _buildSheetOption(context, Icons.flag, "Report or block"),
              _buildSheetOption(context, Icons.info, "About this profile"),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSheetOption(BuildContext context, IconData icon, String text) {
    return ListTile(
      leading: Icon(icon, color: Colors.white),
      title: Text(text, style: TextStyle(color: Colors.white)),
      onTap: () {
        Navigator.pop(context); // Close sheet on tap
      },
    );
  }
}
