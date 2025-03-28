import 'package:ascend_app/features/networks/Mock%20Data/follow.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/mutual_follow.dart';

class SingleFollow extends StatefulWidget {
  final UserModel user;
  final List<UserModel> mutualUsers;
  final Function(String) onFollow;
  final Function(String) onUnfollow;
  final Function(String) onHide;

  const SingleFollow({
    super.key,
    required this.user,
    required this.mutualUsers,
    required this.onFollow,
    required this.onUnfollow,
    required this.onHide,
  });

  @override
  _FollowState createState() => _FollowState();
}

class _FollowState extends State<SingleFollow> {
  bool isFollowing = false;
  bool isVisible = true;
  Color backgroundColorrr = Colors.white;

  void _changeFollowStatus() {
    setState(() {
      isFollowing = !isFollowing;
      print(isFollowing);
      if (isFollowing) {
        widget.onFollow(widget.user.id);
      } else {
        widget.onUnfollow(widget.user.id);
      }
    });
  }

  void _hideWidget() {
    setState(() {
      isVisible = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    print("Rebuilding SingleFollow: isFollowing = $isFollowing");
    if (!isVisible) {
      return const SizedBox.shrink();
    }
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Card(
        elevation: 2,
        child: SizedBox(
          height: 250, // Increased height to fit all elements
          child: Stack(
            clipBehavior:
                Clip.none, // Ensure elements outside the card are visible
            children: [
              // Cover picture
              Image.asset(
                widget.user.coverpic,
                height: 100,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
              // Close button with constrained touch area
              Positioned(
                top: 8,
                right: 8,
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(15),
                    onTap: _hideWidget,
                    child: Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ),
              ),
              // Profile picture
              Positioned(
                top: 60, // Adjusted to avoid clipping
                left: 16,
                child: CircleAvatar(
                  radius: 40,
                  backgroundImage:
                      widget.user.profilePic.isNotEmpty
                          ? AssetImage(widget.user.profilePic)
                          : const AssetImage("assets/EmptyUser.png"),
                ),
              ),
              // Follow button
              Positioned(
                top: 110, // Adjusted to move it further down
                right: 16,
                child: OutlinedButton.icon(
                  onPressed: _changeFollowStatus, // Ensure this is clickable
                  icon: Icon(
                    isFollowing ? Icons.check : Icons.add,
                    color: isFollowing ? Colors.grey : Colors.blue,
                  ),
                  label: Text(
                    isFollowing ? "Following" : "Follow",
                    style: TextStyle(
                      color: isFollowing ? Colors.grey : Colors.blue,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    side: BorderSide(
                      color: isFollowing ? Colors.grey : Colors.blue,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 150,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        widget.user.name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 4,
                      ),
                      child: Text(
                        widget.user.bio,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      child: MutualFollow(
                        mutualUsers: widget.mutualUsers,
                        numFollowers:
                            fetchFollowers(
                              generateFollowers(),
                              widget.user.id,
                            ).length,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
