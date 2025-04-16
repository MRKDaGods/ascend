import 'package:flutter/material.dart';

class CustomAlertDialog extends StatelessWidget {
  final String? title;
  final String description;
  final String confirmText;
  final VoidCallback? onConfirm;

  const CustomAlertDialog({
    this.title,
    required this.description,
    this.confirmText = "Withdraw",
    this.onConfirm,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      // Dark background
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16), // Smooth rounded corners
      ),
      title:
          title != null
              ? Center(
                child: Text(
                  title!,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              )
              : null,
      content: Text(
        description,
        style: const TextStyle(fontSize: 14),
        textAlign: TextAlign.center,
      ),
      actions: [
        Container(
          decoration: const BoxDecoration(
            border: Border(
              top: BorderSide(
                // Slightly lighter border for realism
              ),
            ),
          ),
          child: Row(
            children: [
              _buildActionButton(
                context,
                label: "Cancel",
                textColor: Colors.black,
                onTap: () => Navigator.pop(context),
              ),
              Container(
                width: 1, // Thin divider between buttons
                height: 48,
              ),
              _buildActionButton(
                context,
                label: confirmText,
                textColor: Colors.red,
                onTap: () {
                  onConfirm?.call();
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required String label,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Text(
            label,
            style: TextStyle(
              color: textColor,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }
}
