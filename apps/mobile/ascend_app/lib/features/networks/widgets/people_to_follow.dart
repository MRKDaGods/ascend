import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/single_follow.dart';
import 'package:flutter/material.dart';

class PeopleToFollow extends StatefulWidget {
  final List<UserModel> users;
  final Map<String, List<UserModel>> mutualUsers;
  final Function(String) onFollow;
  final Function(String) onUnfollow;
  final Function(String) onHide;
  final bool showAll;

  const PeopleToFollow({
    Key? key,
    required this.users,
    required this.mutualUsers,
    required this.onFollow,
    required this.onUnfollow,
    required this.onHide,
    required this.showAll,
  }) : super(key: key);
  @override
  _PeopleToFollowState createState() => _PeopleToFollowState();
}

class _PeopleToFollowState extends State<PeopleToFollow> {
  late List<UserModel> localUsers; // Local copy of the users list

  @override
  void initState() {
    super.initState();
    localUsers = List.from(widget.users); // Initialize the local list
  }

  void _handleHide(String userId) {
    setState(() {
      localUsers.removeWhere(
        (user) => user.id == userId,
      ); // Remove the user locally
    });
    widget.onHide(userId); // Trigger the onHide callback
  }

  @override
  Widget build(BuildContext context) {
    int countFollows =
        widget.showAll
            ? localUsers.length
            : localUsers.length > 2
            ? 2
            : localUsers.length;
    return Wrap(
      spacing: 8.0,
      runSpacing: 8.0,
      children:
          localUsers.take(countFollows).map((user) {
            List<UserModel> mutuals = widget.mutualUsers[user.id] ?? [];
            return SingleFollow(
              key: ValueKey(user.id),
              user: user,
              mutualUsers: mutuals,
              onFollow: widget.onFollow,
              onUnfollow: widget.onUnfollow,
              onHide: widget.onHide,
            );
          }).toList(),
    );
  }
}
