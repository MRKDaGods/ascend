import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class UserActivitySection extends StatelessWidget {
  final Profile profile;
  final bool isMyProfile;
  final VoidCallback onEditActivity;

  const UserActivitySection({
    super.key,
    required this.profile,
    required this.isMyProfile,
    required this.onEditActivity,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Activity",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                if (isMyProfile)
                  TextButton(
                    onPressed: onEditActivity,
                    child: const Text("Create a post"),
                    style: TextButton.styleFrom(foregroundColor: Colors.blue),
                  ),
              ],
            ),
          ),
          // Activity stats
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Text(
                  "${profile.firstName} has 0 followers",
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                ),
                const SizedBox(width: 16),
                Text(
                  "0 posts",
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                ),
              ],
            ),
          ),

          // Example activity item or placeholder
          const SizedBox(height: 16),
          Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  Icon(
                    Icons.emoji_events_outlined,
                    size: 48,
                    color: Colors.grey.shade400,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    isMyProfile
                        ? "Your posts, articles, and activities will be displayed here"
                        : "${profile.firstName} hasn't posted anything yet",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
                  ),
                  if (isMyProfile) const SizedBox(height: 16),
                  if (isMyProfile)
                    ElevatedButton(
                      onPressed: onEditActivity,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                      ),
                      child: const Text("Create a post"),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
