import 'package:flutter/material.dart';

class BlueButton extends StatelessWidget {
  const BlueButton({super.key, required this.text, this.action, this.icon});

  final VoidCallback? action;
  final String text;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return icon != null
        ? ElevatedButton.icon(
          label: Text(text),
          icon: Icon(icon!, color: Colors.black),

          style: ElevatedButton.styleFrom(
            foregroundColor: Colors.black,
            backgroundColor: Colors.blue,
            padding: const EdgeInsets.symmetric(vertical: 8),
          ),
          onPressed: action ?? () {},
        )
        : ElevatedButton(
          style: ElevatedButton.styleFrom(
            foregroundColor: Colors.black,
            backgroundColor: Colors.blue,
            padding: const EdgeInsets.symmetric(vertical: 8),
          ),
          onPressed: action ?? () {},
          child: Text(text),
        );
  }
}
