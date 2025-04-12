import 'package:flutter/material.dart';

class FollowButton extends StatefulWidget {
  @override
  final String userId;
  Function(String) onFollow;
  Function(String) onUnFollow;

  FollowButton({
    super.key,
    required this.userId,
    required this.onFollow,
    required this.onUnFollow,
  });
  @override
  _FollowButtonState createState() => _FollowButtonState();
}

class _FollowButtonState extends State<FollowButton> {
  bool isFollowing = true;

  void _toggleFollow(String userId) {
    setState(() {
      if (isFollowing) {
        widget.onUnFollow(userId);
      } else {
        widget.onFollow(userId);
      }
      isFollowing = !isFollowing;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _toggleFollow(widget.userId),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isFollowing ? Colors.grey : Colors.blue,
            width: 2,
          ),
        ),
        child: Text(
          isFollowing ? 'Following' : 'Follow',
          style: TextStyle(
            color: isFollowing ? Colors.grey : Colors.blue,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
