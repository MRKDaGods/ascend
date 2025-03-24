import 'package:flutter/material.dart';

class GreyButton extends StatelessWidget {
  const GreyButton({
    super.key,
    required this.text,
    required this.action,
    this.icon,
  });

  final void Function(BuildContext) action;
  final String text;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return icon != null
        ? OutlinedButton.icon(
          icon: Icon(icon!, color: Colors.blue),
          onPressed: () => action(context),
          style: OutlinedButton.styleFrom(
            foregroundColor: Colors.blue,
            side: const BorderSide(color: Colors.blue),
            padding: const EdgeInsets.symmetric(vertical: 8),
          ),
          label: Text(text),
        )
        : OutlinedButton(
          onPressed: () => action(context),
          style: OutlinedButton.styleFrom(
            foregroundColor: Colors.blue,
            side: const BorderSide(color: Colors.blue),
            padding: const EdgeInsets.symmetric(vertical: 8),
          ),
          child: Text(text),
        );
  }
}
