import 'package:flutter/material.dart';

class ChoiceChipItem extends StatelessWidget {
  final String item;
  final bool isSelected;
  final Function(bool) onSelected;
  final Color selectedColor;
  final IconData? icon;

  const ChoiceChipItem({
    Key? key,
    required this.item,
    required this.isSelected,
    required this.onSelected,
    required this.selectedColor,
    this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChoiceChip(
      label: Text(
        item,
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.black,
          fontWeight: FontWeight.bold,
        ),
      ),
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black,
        fontWeight: FontWeight.bold,
      ),
      selected: isSelected,
      selectedColor: selectedColor,
      onSelected: onSelected,
      showCheckmark: false,
    );
  }
}
