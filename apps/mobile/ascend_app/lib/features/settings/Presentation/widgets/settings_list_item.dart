import 'package:flutter/material.dart';

class SettingsListItem extends StatelessWidget {
  final String title;
  final VoidCallback? onTap;

  const SettingsListItem({
    Key? key,
    required this.title,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(title),
      trailing: const Icon(Icons.arrow_forward_ios),
      onTap: onTap,
    );
  }
}