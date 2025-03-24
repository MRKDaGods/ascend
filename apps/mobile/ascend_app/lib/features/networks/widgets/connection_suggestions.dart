import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/single_connection.dart';
import 'package:ascend_app/features/networks/managers/connection_manager.dart';

class ConnectionSuggestions extends StatefulWidget {
  final List<UserModel> suggestedUsers;
  final Map<String, List<UserModel>> connectionsMap;
  final Function(String) onSend;
  final bool ShowAll;

  const ConnectionSuggestions({
    Key? key,
    required this.suggestedUsers,
    required this.connectionsMap,
    required this.onSend,
    required this.ShowAll,
  }) : super(key: key);

  @override
  _ConnectionSuggestionsState createState() => _ConnectionSuggestionsState();
}

class _ConnectionSuggestionsState extends State<ConnectionSuggestions> {
  final Set<String> connectedUsers = {}; // Track connected users by their IDs
  late List<UserModel> localsuggestedUsers;

  @override
  void initState() {
    super.initState();
    localsuggestedUsers = List.from(widget.suggestedUsers);
  }

  void _handleConnect(String userId) {
    setState(() {
      connectedUsers.add(userId); // Mark the user as connected
    });
    widget.onSend(userId); // Trigger the onSend callback
  }

  @override
  Widget build(BuildContext context) {
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

    final Map<String, List<UserModel>> MutualConnectionsMap =
        getMutualConnectionsforeachUser("1", widget.connectionsMap);
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
        final bool isConnected = connectedUsers.contains(user.id);
        print(
          "User Name: ${user.name},User Id : ${user.id} ,index: $index, isConnected: $isConnected",
        );
        return SingleConnection(
          key: ValueKey(user.id),
          user: user,
          onSend: _handleConnect,
          ShowAll: widget.ShowAll,
          isConnected: isConnected,
          mutualUsers: MutualConnectionsMap[user.id] ?? [],
          acceptedConnections: widget.connectionsMap[user.id] ?? [],
          onHide: (userId) {
            setState(() {
              localsuggestedUsers.removeWhere((user) => user.id == userId);
            });
          },
        );
      },
    );
  }
}
