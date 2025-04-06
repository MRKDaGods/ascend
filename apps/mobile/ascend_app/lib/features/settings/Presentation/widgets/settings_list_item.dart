import 'package:flutter/material.dart';

class SettingsListItem extends StatelessWidget {
  final String title;
  final VoidCallback? onTap;
  final IconData? leading;
  final TextStyle? titleStyle; // Add an optional TextStyle for the title

  const SettingsListItem({
    Key? key,
    required this.title,
    this.onTap,
    this.leading,
    this.titleStyle, // Accept the custom TextStyle
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: leading != null ? Icon(leading) : null,
      title: Text(
        title,
        style:
            titleStyle ??
            const TextStyle(fontSize: 16), // Use custom style if provided
      ),
      onTap: onTap,
    );
  }
}
