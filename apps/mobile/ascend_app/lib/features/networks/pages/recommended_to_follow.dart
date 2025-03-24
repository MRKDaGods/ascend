import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/people_to_follow.dart';

class RecommendedToFollow extends StatefulWidget {
  final String Message;
  final List<UserModel> users;
  final Map<String, List<UserModel>> mutualUsers;
  final Function(String) onFollow;
  final Function(String) onUnfollow;
  final Function(String) onHide;
  final bool showAll;

  const RecommendedToFollow({
    Key? key,
    required this.Message,
    required this.users,
    required this.mutualUsers,
    required this.onFollow,
    required this.onUnfollow,
    required this.onHide,
    required this.showAll,
  }) : super(key: key);

  @override
  _RecommendedToFollowState createState() => _RecommendedToFollowState();
}

class _RecommendedToFollowState extends State<RecommendedToFollow> {
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController(); // Initialize the ScrollController
  }

  @override
  void dispose() {
    _scrollController
        .dispose(); // Dispose of the ScrollController to prevent memory leaks
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Center(child: Text('Recommended to Follow'))),
      body: SingleChildScrollView(
        controller:
            _scrollController, // Assign the ScrollController to the ListView
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 4),
                child: Text(
                  'People to follow based on your activity',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 5),
              PeopleToFollow(
                users: widget.users,
                mutualUsers: widget.mutualUsers,
                onFollow: (userId) {
                  widget.onFollow(userId);
                },
                onUnfollow: (userId) {
                  widget.onUnfollow(userId);
                },
                onHide: (userId) {
                  widget.onHide(userId);
                },
                showAll: true,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
