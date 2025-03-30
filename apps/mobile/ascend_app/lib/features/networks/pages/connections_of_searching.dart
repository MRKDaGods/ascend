import 'package:flutter/material.dart';

class ConnectionsOfSearching extends StatefulWidget {
  const ConnectionsOfSearching({super.key});

  @override
  State<ConnectionsOfSearching> createState() => _ConnectionsOfSearchingState();
}

class _ConnectionsOfSearchingState extends State<ConnectionsOfSearching> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Search Connections',
          style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: TextField(
          controller: _searchController,
          decoration: InputDecoration(
            hintText: 'Search Connections',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8.0),
              borderSide: const BorderSide(color: Colors.grey, width: 1.0),
            ),
          ),
        ),
      ),
    );
  }
}
