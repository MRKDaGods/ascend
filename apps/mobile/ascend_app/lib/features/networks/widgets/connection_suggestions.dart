import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_connect.dart';
import 'package:ascend_app/features/networks/widgets/single_connection.dart';

class ConnectionSuggestions extends StatefulWidget {
  final List<UserSuggestedtoConnect> suggestedUsers;
  final Function(String) onSentMessageRequest;
  final Function(String) onSend;
  final bool ShowAll;

  const ConnectionSuggestions({
    super.key,
    required this.suggestedUsers,
    required this.onSentMessageRequest,
    required this.onSend,
    required this.ShowAll,
  });

  @override
  _ConnectionSuggestionsState createState() => _ConnectionSuggestionsState();
}

class _ConnectionSuggestionsState extends State<ConnectionSuggestions> {
  List<UserSuggestedtoConnect> localsuggestedUsers = [];
  final Set<String> connectedUsers = {};

  @override
  void initState() {
    super.initState();
  }

  void _handleConnect(String userId) {
    setState(() {
      connectedUsers.add(userId);
      localsuggestedUsers.removeWhere((user) => user.user_id == userId);
    });
    widget.onSend(userId); // Trigger the onSend callback
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    localsuggestedUsers = widget.suggestedUsers;
    final double screenWidth = MediaQuery.of(context).size.width;
    final double mainAxisExtent =
        screenWidth > 600 ? 400 : 320; // Adjust dynamically

    final int crossAxisCount =
        screenWidth > 600 ? 4 : 2; // Adjust columns for larger screens
    final double childAspectRatio = screenWidth > 600 ? 0.9 : 0.8;

    final int itemCount =
        screenWidth > 600
            ? !widget.ShowAll
                ? localsuggestedUsers.length > 8
                    ? 8
                    : localsuggestedUsers.length
                : localsuggestedUsers.length
            : !widget.ShowAll
            ? localsuggestedUsers.length > 4
                ? 4
                : localsuggestedUsers.length
            : localsuggestedUsers.length;

    return GridView.builder(
      shrinkWrap: true, // Prevents infinite height issues
      physics: NeverScrollableScrollPhysics(), // Disables GridView's scrolling
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        crossAxisSpacing: 5,
        mainAxisExtent: mainAxisExtent,
        mainAxisSpacing: 10,
        //childAspectRatio: childAspectRatio,
      ),
      itemCount: itemCount,
      itemBuilder: (context, index) {
        final user = localsuggestedUsers[index];
        final bool isConnected = connectedUsers.contains(user.user_id!);
        return SingleConnection(
          key: ValueKey(user.user_id!),
          user: user,
          onSend: _handleConnect,
          onSentMessageRequest: widget.onSentMessageRequest,
          ShowAll: widget.ShowAll,
          isConnected: isConnected,
          onHide: (userId) {
            setState(() {
              localsuggestedUsers.removeWhere((user) => user.user_id == userId);
            });
          },
        );
      },
    );
  }
}
