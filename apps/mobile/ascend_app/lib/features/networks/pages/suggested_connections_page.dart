import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/connection_suggestions.dart';

class SuggestedConnectionsPage extends StatefulWidget {
  final String Message;
  final List<UserModel> users;
  final Map<String, List<UserModel>> mutualUsers;
  final Function(String) onSend;
  final bool showAll;

  const SuggestedConnectionsPage({
    Key? key,
    required this.Message,
    required this.users,
    required this.mutualUsers,
    required this.onSend,
    required this.showAll,
  }) : super(key: key);

  @override
  _SuggestedConnectionsPageState createState() =>
      _SuggestedConnectionsPageState();
}

class _SuggestedConnectionsPageState extends State<SuggestedConnectionsPage> {
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
      appBar: AppBar(title: Center(child: Text('Suggested Connections'))),
      body: SingleChildScrollView(
        controller:
            _scrollController, // Assign the ScrollController to the ListView
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Text(
                  widget.Message,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              ConnectionSuggestions(
                suggestedUsers: widget.users,
                connectionsMap: widget.mutualUsers,
                onSend: widget.onSend,
                ShowAll: widget.showAll,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
