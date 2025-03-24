import 'package:flutter/material.dart';

class CommentForm extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onSubmit;
  final FocusNode? focusNode;
  final String hintText;

  const CommentForm({
    super.key,
    required this.controller,
    required this.onSubmit,
    this.focusNode,
    this.hintText = 'Add a comment...',
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
              focusNode: focusNode,
              decoration: InputDecoration(
                hintText: hintText, // Use the provided hintText
                border: const OutlineInputBorder(),
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 8.0,
                  horizontal: 12.0,
                ),
              ),
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