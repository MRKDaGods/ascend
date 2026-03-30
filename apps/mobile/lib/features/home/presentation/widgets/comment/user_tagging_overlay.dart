import 'package:flutter/material.dart';
import 'package:ascend_app/features/profile/models/user_profile_model.dart'; // Assuming UserProfileModel exists
import 'package:ascend_app/shared/widgets/user_avatar.dart';

class UserTaggingOverlay extends StatelessWidget {
  final List<UserProfileModel> users;
  final Function(UserProfileModel) onUserSelected;

  const UserTaggingOverlay({
    super.key,
    required this.users,
    required this.onUserSelected,
  });

  @override
  Widget build(BuildContext context) {
    // Use Material to ensure text styles and inkwells work correctly
    return Material(
      elevation: 4.0,
      borderRadius: BorderRadius.circular(8.0),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: 150, // Limit the height of the overlay
        ),
        child: ListView.builder(
          padding: EdgeInsets.zero, // Remove default padding
          shrinkWrap: true,
          itemCount: users.length,
          itemBuilder: (context, index) {
            final user = users[index];
            return ListTile(
              leading: UserAvatar(imageUrl: user.avatarUrl, radius: 16),
              title: Text(user.name),
              subtitle: Text(
                user.position, // Show position if available
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              dense: true, // Make the list items smaller
              onTap: () {
                onUserSelected(user);
              },
            );
          },
        ),
      ),
    );
  }
}
