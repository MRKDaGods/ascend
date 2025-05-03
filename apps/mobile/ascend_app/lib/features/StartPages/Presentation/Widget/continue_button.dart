import 'package:flutter/material.dart';

Widget buildOutlinedButton({
  required String label,
  String? iconPath,
  required VoidCallback onPressed,
}) {
  return OutlinedButton.icon(
    onPressed: onPressed,
    style: OutlinedButton.styleFrom(minimumSize: const Size(450, 50)),
    icon: iconPath != null
        ? Image.asset(iconPath, height: 24.0, width: 24.0)
        : const SizedBox.shrink(),
    label: Text(label, style: const TextStyle(fontSize: 16)),
  );
}

Widget buildTextButton({
  required String label,
  required VoidCallback onPressed,
  required Color backgroundColor,
  required Color textColor,
  FontWeight fontWeight = FontWeight.normal,
}) {
  return TextButton(
    onPressed: onPressed,
    style: TextButton.styleFrom(
      minimumSize: const Size(450, 50),
      backgroundColor: backgroundColor,
      textStyle: const TextStyle(fontSize: 18),
    ),
    child: Text(
      label,
      style: TextStyle(color: textColor, fontWeight: fontWeight),
    ),
  );
}