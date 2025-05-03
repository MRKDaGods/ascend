import 'package:ascend_app/features/home/presentation/widgets/search/user_search_result_model.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class UserSearchResultTile extends StatelessWidget {
  final UserSearchResult user;

  const UserSearchResultTile({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: user.profilePictureUrl != null
            ? CachedNetworkImageProvider(user.profilePictureUrl!)
            : null, // Use CachedNetworkImageProvider
        child: user.profilePictureUrl == null
            ? const Icon(Icons.person) // Placeholder icon
            : null,
      ),
      title: Text(user.fullName, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(
        user.bio ?? 'No bio available', // Display bio or a default text
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: IconButton( // Example action button
        icon: const Icon(Icons.person_add_alt_1_outlined),
        onPressed: () {
          // TODO: Implement connect action
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Connect with ${user.fullName}')),
          );
        },
      ),
      onTap: () {
        // TODO: Implement navigation to user profile
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Navigate to profile ${user.id}')),
        );
      },
    );
  }
}
