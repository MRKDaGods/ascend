import 'package:flutter/material.dart';

class PostActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;
  final VoidCallback onTap;

  const PostActionButton({
    super.key,
    required this.icon,
    required this.label,
    this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(fontSize: 12, color: color),
            ),
          ],
        ),
      ),
    );
  }
}