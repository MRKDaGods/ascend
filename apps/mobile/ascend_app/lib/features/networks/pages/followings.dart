import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/follow_button.dart';

class Followings extends StatelessWidget {
  final List<UserModel> followingUsers;
  final Function(String) onFollow;
  final Function(String) onUnFollow;

  const Followings({
    Key? key,
    required this.followingUsers,
    required this.onFollow,
    required this.onUnFollow,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Followings')),
      body: Column(
        children: [
          Card(
            elevation: 2, // Slight shadow effect
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Text(
                '${followingUsers.length} people',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
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
                        followingUsers[index].profilePic,
                      ),
                    ),
                    title: Text(
                      followingUsers[index].name,
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          followingUsers[index].bio,
                          maxLines: 2,
                          style: TextStyle(color: Colors.black, fontSize: 12),
                        ),
                      ],
                    ),
                    trailing: FollowButton(
                      userId: followingUsers[index].id,
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
