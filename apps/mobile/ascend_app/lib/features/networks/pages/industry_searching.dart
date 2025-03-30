import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class IndustrySearching extends StatefulWidget {
  const IndustrySearching({super.key});

  @override
  State<IndustrySearching> createState() => _IndustrySearchingState();
}

class _IndustrySearchingState extends State<IndustrySearching> {
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
          'Industry',
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
            hintText: 'Search Industry ',
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
