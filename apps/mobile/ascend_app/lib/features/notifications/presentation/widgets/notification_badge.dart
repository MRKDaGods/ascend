import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/notification_bloc.dart';
import '../bloc/notification_state.dart';

/// A badge widget that displays the count of unread notifications
class NotificationBadge extends StatelessWidget {
  /// The child widget that the badge will be displayed on top of
  final Widget child;
  
  /// The position of the badge relative to the child
  final Alignment alignment;
  
  /// The size of the badge
  final double size;
  
  /// The padding inside the badge
  final EdgeInsetsGeometry padding;
  
  /// The text style for the badge count
  final TextStyle? textStyle;
  
  /// The color of the badge
  final Color? badgeColor;
  
  /// The maximum count to display before showing "99+"
  final int maxCount;
  
  /// Whether to hide the badge when there are no unread notifications
  final bool hideWhenZero;

  const NotificationBadge({
    Key? key,
    required this.child,
    this.alignment = Alignment.topRight,
    this.size = 18.0,
    this.padding = const EdgeInsets.all(0),
    this.textStyle,
    this.badgeColor,
    this.maxCount = 99,
    this.hideWhenZero = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<NotificationBloc, NotificationState>(
      buildWhen: (previous, current) {
        // Only rebuild when the unread count changes
        if (previous is NotificationLoaded && current is NotificationLoaded) {
          return previous.unreadCount != current.unreadCount;
        }
        return current is NotificationLoaded;
      },
      builder: (context, state) {
        // Get unread count from state
        int unreadCount = 0;
        if (state is NotificationLoaded) {
          unreadCount = state.unreadCount;
        }
        
        // Hide badge if there are no unread notifications and hideWhenZero is true
        if (unreadCount == 0 && hideWhenZero) {
          return child;
        }
        
        return Stack(
          alignment: alignment,
          children: [
            child,
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                padding: padding,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: badgeColor ?? Theme.of(context).colorScheme.error,
                ),
                constraints: BoxConstraints(
                  minWidth: size,
                  minHeight: size,
                ),
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(2.0),
                    child: FittedBox(
                      child: Text(
                        unreadCount > maxCount ? '$maxCount+' : '$unreadCount',
                        style: textStyle ?? TextStyle(
                          color: Theme.of(context).colorScheme.onError,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}