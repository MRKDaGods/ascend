import 'package:flutter/material.dart';

class MoreCategoriesScreen extends StatelessWidget {
  final List<String> categories;

  const MoreCategoriesScreen({super.key, required this.categories});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("All Categories")),
      body: ListView.builder(
        itemCount: categories.length,
        itemBuilder: (context, index) {
          return ListTile(title: Text(categories[index]));
        },
      ),
    );
  }
}
