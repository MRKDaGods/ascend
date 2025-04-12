import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/widgets/follow_button.dart';
import 'package:ascend_app/features/networks/model/followed_user.dart';

class Followings extends StatelessWidget {
  final List<FollowedUser> followingUsers;
  final Function(String) onFollow;
  final Function(String) onUnFollow;

  const Followings({
    super.key,
    required this.followingUsers,
    required this.onFollow,
    required this.onUnFollow,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('People I follow')),
      body: Column(
        children: [
          ListTile(
            leading: Text(
              '${followingUsers.length} people',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
          ),
          if (followingUsers.isEmpty)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text('No following'),
            )
          else
            Expanded(
              child: ListView.separated(
                itemCount: followingUsers.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundImage: AssetImage(
                        followingUsers[index].profile_image_id!.startsWith(
                              'http',
                            )
                            ? followingUsers[index].profile_image_id!
                            : 'assets/images/default_profile.png',
                      ),
                    ),
                    title: Text(
                      '${followingUsers[index].first_name} ${followingUsers[index].last_name}',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          followingUsers[index].bio!,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                    trailing: FollowButton(
                      userId: followingUsers[index].user_id!,
                      onFollow: onFollow,
                      onUnFollow: onUnFollow,
                    ),
                  );
                },
                separatorBuilder:
                    (context, index) => Divider(
                      color: Colors.grey,
                      thickness: 1,
                      indent: 16,
                      endIndent: 16,
                    ),
              ),
            ),
        ],
      ),
    );
  }
}
