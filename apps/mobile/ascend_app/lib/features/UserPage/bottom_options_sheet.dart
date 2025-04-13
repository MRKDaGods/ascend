import 'package:flutter/material.dart';

class ProfileOptionsSheet extends StatelessWidget {
  const ProfileOptionsSheet({
    required this.isConnect,
    required this.isfollowing,
    required this.isPending,
    required this.toggleConnect,
    required this.withdrawRequest,
    required this.toggleFollow,
    required this.removeConnection,
    super.key,
  });

  final bool isConnect;
  final bool isfollowing;
  final bool isPending;
  final void Function() toggleConnect;
  final void Function() toggleFollow;
  final void Function(BuildContext) withdrawRequest;
  final void Function(BuildContext) removeConnection;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min, // Ensures it wraps content properly
      children: [
        // Custom Drag Handle
        Stack(
          children: [
            Container(
              width: double.infinity, // Full width background
              height: 35, // Slightly taller to match reference
              // Slightly darker background
            ),
            Center(
              child: Container(
                width: 54, // Proper width as in the reference image
                height: 7, // Slightly thicker
                decoration: BoxDecoration(
                  color: Colors.grey[400], // Drag handle color
                  // Drag handle color
                  borderRadius: BorderRadius.circular(3), // Rounded edges
                ),
                margin: const EdgeInsets.symmetric(
                  vertical: 10,
                ), // Adds proper spacing
              ),
            ),
          ],
        ),

        // Main content with padding
        Padding(
          padding: const EdgeInsets.only(bottom: 16, left: 16, right: 16),
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
                  : _buildSheetOption(
                    context,
                    Icons.add,
                    "Follow",
                    toggleFollow,
                  ),
              isConnect
                  ? _buildSheetOption(
                    context,
                    Icons.person_off,
                    "Remove connection",
                    removeConnection,
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
              _buildSheetOption(
                context,
                Icons.info,
                "About this profile",
                null,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSheetOption(
    BuildContext context,
    IconData icon,
    String text,
    dynamic onTap,
  ) {
    return ListTile(
      leading: Icon(icon),
      title: Text(text),
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
