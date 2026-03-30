import 'package:ascend_app/features/networks/model/user_suggested_to_connect.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/widgets/connection_suggestions.dart';

class SuggestedConnectionsPage extends StatefulWidget {
  final String message;
  final List<UserSuggestedtoConnect> users;
  final Function(String) onSend;
  final bool showAll;

  const SuggestedConnectionsPage({
    super.key,
    required this.message,
    required this.users,
    required this.onSend,
    required this.showAll,
  });

  @override
  State<SuggestedConnectionsPage> createState() =>
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
                  widget.message,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              //ConnectionSuggestions PAGE
              ConnectionSuggestions(
                suggestedUsers: widget.users,
                onSend: widget.onSend,
                onSentMessageRequest: widget.onSend,
                showAll: widget.showAll,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
