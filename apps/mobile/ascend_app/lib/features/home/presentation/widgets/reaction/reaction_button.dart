import 'package:flutter/material.dart';
import '../../../managers/reaction_manager.dart';

class ReactionButton extends StatefulWidget {
  final ReactionManager manager;
  final VoidCallback onLongPressStart;
  final VoidCallback onLongPressEnd;
  final VoidCallback? onTap;

  const ReactionButton({
    super.key,
    required this.manager,
    required this.onLongPressStart,
    required this.onLongPressEnd,
    this.onTap,
  });

  @override
  State<ReactionButton> createState() => _ReactionButtonState();
}

class _ReactionButtonState extends State<ReactionButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _slideUpAnimation;
  bool _isLongPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );

    _slideUpAnimation = Tween<double>(
      begin: 0.0,
      end: -10.0, // How far up the icon moves when pressed
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (widget.onTap != null) {
          widget.onTap!();
        } else {
          // Check if we need to remove current reaction or toggle to default
          if (widget.manager.isLiked) {
            // If already has a reaction, remove it
            widget.manager.removeReaction();
          } else {
            // If no reaction, add the default one
            widget.manager.toggleReaction();
          }
          setState(() {}); // Force a rebuild with the new state
        }
      },
      onLongPressStart: (_) {
        setState(() {
          _isLongPressed = true;
        });
        _controller.forward();
        widget.onLongPressStart();
      },
      onLongPressEnd: (_) {
        setState(() {
          _isLongPressed = false;
        });
        _controller.reverse();
        widget.onLongPressEnd();
      },
      onLongPressCancel: () {
        setState(() {
          _isLongPressed = false;
        });
        _controller.reverse();
        widget.onLongPressEnd();
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.translate(
                offset: Offset(0, _slideUpAnimation.value),
                child: Icon(
                  widget.manager.getCurrentReactionIcon(),
                  color: widget.manager.getCurrentReactionColor(),
                  size: 24,
                ),
              );
            },
          ),

          if (_isLongPressed) ...[
            const SizedBox(width: 8),
            Text(
              widget.manager.getCurrentReactionLabel(),
              style: TextStyle(
                color: widget.manager.getCurrentReactionColor(),
                fontWeight:
                    widget.manager.isLiked
                        ? FontWeight.bold
                        : FontWeight.normal,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
