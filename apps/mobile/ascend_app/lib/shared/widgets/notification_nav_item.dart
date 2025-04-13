import 'package:flutter/material.dart';
import '../../features/notifications/presentation/widgets/notification_badge.dart';

/// A navigation item with a notification badge
class NotificationNavItem extends StatelessWidget {
  /// The icon to display
  final IconData icon;
  
  /// The label to display
  final String label;
  
  /// Whether this item is selected
  final bool isSelected;
  
  /// Called when the item is tapped
  final VoidCallback onTap;

  const NotificationNavItem({
    Key? key,
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Color color = isSelected
        ? Theme.of(context).colorScheme.primary
        : Theme.of(context).colorScheme.onSurface;

    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          NotificationBadge(
            child: Icon(
              icon,
              color: color,
            ),
            size: 16,
            alignment: const Alignment(0.7, -0.7),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}