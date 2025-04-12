import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_follow.dart';
import 'package:ascend_app/features/networks/widgets/single_follow.dart';
import 'package:flutter/material.dart';

class PeopleToFollow extends StatefulWidget {
  final List<UserSuggestedtoFollow> users;
  final Function(String) onFollow;
  final Function(String) onUnfollow;
  final bool showAll;

  const PeopleToFollow({
    super.key,
    required this.users,
    required this.onFollow,
    required this.onUnfollow,
    required this.showAll,
  });
  @override
  _PeopleToFollowState createState() => _PeopleToFollowState();
}

class _PeopleToFollowState extends State<PeopleToFollow> {
  late List<UserSuggestedtoFollow> localUsers; // Local copy of the users list

  @override
  void initState() {
    super.initState();
    localUsers = List.from(widget.users); // Initialize the local list
  }

  void _handleFollow(String userId) {
    setState(() {
      localUsers.removeWhere(
        (user) => user.user_id == userId,
      ); // Remove the user locally
    });
    widget.onFollow(userId); // Trigger the onFollow callback
  }

  void _handleHide(String userId) {
    setState(() {
      localUsers.removeWhere(
        (user) => user.user_id == userId,
      ); // Remove the user locally
    });
  }

  @override
  Widget build(BuildContext context) {
    // Dynamically calculate the number of users to display
    int countFollows =
        widget.showAll
            ? localUsers.length
            : localUsers.length > 2
            ? 2
            : localUsers.length;

    return ListView(
      shrinkWrap: true, // Allow the ListView to wrap its content
      physics: const NeverScrollableScrollPhysics(), // Disable scrolling
      children: [
        Column(
          children:
              localUsers.take(countFollows).map((user) {
                List<ConnectedUser> mutuals = user.MutualUsers!;
                return Padding(
                  padding: const EdgeInsets.only(
                    bottom: 8.0,
                  ), // Add spacing between items
                  child: SingleFollow(
                    key: ValueKey(user.user_id),
                    user: user,
                    mutualUsers: mutuals,
                    numFollowers: 0, //user.num_followers,
                    onFollow: _handleFollow,
                    onUnfollow: widget.onUnfollow,
                    onHide: _handleHide, // Use the local hide handler
                  ),
                );
              }).toList(),
        ),
      ],
    );
  }
}
