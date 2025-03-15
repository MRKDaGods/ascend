import 'package:flutter/material.dart';

class CommentForm extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onSubmit;
  final FocusNode? focusNode; // Add this parameter, make it optional

  const CommentForm({
    super.key,
    required this.controller,
    required this.onSubmit,
    this.focusNode, // Optional parameter
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Row(
        children: [
          const CircleAvatar(
            backgroundImage: AssetImage('assets/logo.jpg'),
            radius: 16,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: TextField(
              controller: controller,
              focusNode: focusNode, // Use the provided focus node
              decoration: const InputDecoration(
                hintText: 'Add a comment...',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(
                  vertical: 8.0,
                  horizontal: 12.0,
                ),
              ),
              // Add this to allow dismissing the keyboard by tapping elsewhere
              onTap: () {
                // Optional: If you want custom behavior when tapping the field
              },
            ),
          ),
          IconButton(
            icon: const Icon(Icons.send),
            onPressed: onSubmit,
          ),
        ],
      ),
    );
  }
}