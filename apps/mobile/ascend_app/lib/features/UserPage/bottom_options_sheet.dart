import 'package:flutter/material.dart';

class ProfileOptionsSheet extends StatelessWidget {
  const ProfileOptionsSheet({
    required this.isConnect,
    required this.isfollowing,
    required this.isPending,
    required this.toggleConnect,
    required this.withdrawRequest,
    required this.toggleFollow,
    super.key,
  });

  final bool isConnect;
  final bool isfollowing;
  final bool isPending;
  final void Function() toggleConnect;
  final void Function() toggleFollow;
  final void Function(BuildContext) withdrawRequest;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Wrap(
        children: [
          _buildSheetOption(
            context,
            Icons.send,
            "Send profile in a message",
            null,
          ),
          _buildSheetOption(context, Icons.share, "Share via...", null),
          _buildSheetOption(
            context,
            Icons.perm_contact_calendar,
            "Contact info",
            null,
          ),
          if (isConnect) ...[
            _buildSheetOption(
              context,
              Icons.request_page,
              "Request a recommendation",
              null,
            ),
            _buildSheetOption(context, Icons.thumb_up, "Recommend", null),
          ],

          isfollowing
              ? _buildSheetOption(
                context,
                Icons.remove,
                "Unfollow",
                toggleFollow,
              )
              : _buildSheetOption(context, Icons.add, "Follow", toggleFollow),
          isConnect
              ? _buildSheetOption(
                context,
                Icons.person_off,
                "Remove connection",
                toggleConnect,
              )
              : isPending
              ? _buildSheetOption(
                context,
                Icons.access_time,
                "Pending",
                withdrawRequest,
              )
              : _buildSheetOption(
                context,
                Icons.person_add,
                "Connect",
                toggleConnect,
              ),

          _buildSheetOption(context, Icons.flag, "Report or block", null),
          _buildSheetOption(context, Icons.info, "About this profile", null),
        ],
      ),
    );
  }

  Widget _buildSheetOption(
    BuildContext context,
    IconData icon,
    String text,
    dynamic onTap,
  ) {
    return ListTile(
      leading: Icon(icon, color: Colors.white),
      title: Text(text, style: const TextStyle(color: Colors.white)),
      onTap: () {
        Navigator.pop(context);
        if (onTap != null) {
          if (onTap is Function(BuildContext)) {
            onTap(context);
          } else {
            onTap();
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("This feature is not available yet")),
          );
        }
        //Navigator.pop(context); // Always close the sheet after selection
      },
    );
  }
}
