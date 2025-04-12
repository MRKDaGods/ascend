import 'package:flutter/material.dart';
class AddEntry extends StatelessWidget{
  const AddEntry({super.key, required this.onAdd});
  final void Function() onAdd;
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onAdd,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            const Icon(Icons.add, color: Colors.blue),
            const SizedBox(width: 8),
            Text('Add Entry', style: TextStyle(color: Colors.blue)),
          ],
        ),
      ),
    );
  }
}