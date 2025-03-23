import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/single_follow.dart';
import 'package:flutter/material.dart';

class PeopleToFollow extends StatelessWidget {
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
  Widget build(BuildContext context) {
    int countFollows =
        showAll
            ? users.length
            : users.length > 2
            ? 2
            : users.length;
    return Wrap(
      spacing: 8.0,
      runSpacing: 8.0,
      children:
          users.take(countFollows).map((user) {
            List<UserModel> mutuals = mutualUsers[user.id] ?? [];
            return SingleFollow(
              key: ValueKey(user.id),
              user: user,
              mutualUsers: mutuals,
              onFollow: onFollow,
              onUnfollow: onUnfollow,
              onHide: onHide,
            );
          }).toList(),
    );
  }
}
