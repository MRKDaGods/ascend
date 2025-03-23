import 'package:flutter/material.dart';

class PremiumSection extends StatelessWidget {
  final bool isDarkMode;

  const PremiumSection({super.key, required this.isDarkMode});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Text(
        "Jobs where you're more likely to hear back",
        style: TextStyle(
          color: isDarkMode ? Colors.orange : Colors.deepOrange,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
