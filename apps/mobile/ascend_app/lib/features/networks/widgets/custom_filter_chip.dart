import 'package:flutter/material.dart';

class CustomFilterChip extends StatelessWidget {
  final String labelText;
  final String? badgeText;
  final Color? badgeColor;
  final Color? badgeTextColor;
  final bool isSelected; // Whether the chip is selected
  final VoidCallback onSelected; // Callback when the chip is tapped
  final bool showDropdown;

  const CustomFilterChip({
    super.key,
    required this.labelText,
    this.badgeText,
    this.badgeColor,
    this.badgeTextColor,
    required this.isSelected,
    required this.onSelected,
    this.showDropdown = false,
  });

  @override
  Widget build(BuildContext context) {
    return ChoiceChip(
      label: Text(labelText),
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black,
        fontWeight: FontWeight.bold,
      ),
      selected: isSelected,
      selectedColor: Colors.green,
      backgroundColor: Colors.grey[200],
      onSelected: (_) => onSelected(),
      avatar:
          showDropdown
              ? Icon(
                Icons.arrow_drop_down,
                color: isSelected ? Colors.white : Colors.black,
              )
              : null,
      side: BorderSide(
        color: isSelected ? Colors.green : Colors.grey[200]!,
        width: 1,
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    );
  }
}
