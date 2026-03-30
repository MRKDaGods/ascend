import 'package:flutter/material.dart';
import '../../../managers/reaction_manager.dart';

class PostReactionsPopup extends StatelessWidget {
  // Support both direct maps and ReactionManager
  final Map<String, IconData>? reactionIcons;
  final Map<String, Color>? reactionColors;
  final ReactionManager? manager;
  final Offset position;
  final Function(String) onReactionSelected;
  final bool isComment;

  const PostReactionsPopup({
    super.key,
    this.reactionIcons,
    this.reactionColors,
    this.manager,
    required this.position,
    required this.onReactionSelected,
    this.isComment = false,
  }) : assert(
         (reactionIcons != null && reactionColors != null) || manager != null,
         'Either provide both reactionIcons and reactionColors, or provide a manager',
       );

  @override
  Widget build(BuildContext context) {
    // Use either provided maps or manager's maps
    final icons = reactionIcons ?? ReactionManager.reactionIcons;
    final colors = reactionColors ?? ReactionManager.reactionColors;

    // Calculate position based on the parent's position
    // We want to show it above the reaction button
    final double top = position.dy - 100.0; // Position it above the button
    final double left = position.dx - 20.0; // Align with the left of the button

    return Stack(
      children: [
        // Invisible tappable area to dismiss popup
        Positioned.fill(
          child: GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            child: Container(color: Colors.transparent),
          ),
        ),

        // Reaction popup
        Positioned(
          top: top,
          left: left,
          child: Material(
            elevation: 8.0,
            borderRadius: BorderRadius.circular(30.0),
            color: Colors.white,
            child: IntrinsicWidth(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8.0,
                  vertical: 8.0,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children:
                      icons.entries.map((entry) {
                        final String reactionType = entry.key;
                        final IconData icon = entry.value;
                        final Color color = colors[reactionType] ?? Colors.grey;

                        return ReactionOption(
                          reactionType: reactionType,
                          icon: icon,
                          color: color,
                          onTap: () {
                            // If manager is provided, update it
                            if (manager != null) {
                              manager!.updateReaction(reactionType);
                            }
                            // Always call the callback
                            onReactionSelected(reactionType);
                          },
                        );
                      }).toList(),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class ReactionOption extends StatefulWidget {
  final String reactionType;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const ReactionOption({
    super.key,
    required this.reactionType,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  State<ReactionOption> createState() => _ReactionOptionState();
}

class _ReactionOptionState extends State<ReactionOption>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.3,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutBack));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) {
        setState(() {
          _isHovered = true;
        });
        _controller.forward();
      },
      onExit: (_) {
        setState(() {
          _isHovered = false;
        });
        _controller.reverse();
      },
      child: GestureDetector(
        onTap: widget.onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedBuilder(
                animation: _controller,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _scaleAnimation.value,
                    child: child,
                  );
                },
                child: Icon(widget.icon, color: widget.color, size: 24.0),
              ),
              const SizedBox(height: 4.0),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: TextStyle(
                  color: widget.color,
                  fontSize: _isHovered ? 11.0 : 10.0,
                  fontWeight: _isHovered ? FontWeight.bold : FontWeight.normal,
                ),
                child: Text(_getReactionLabel(widget.reactionType)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getReactionLabel(String reactionType) {
    switch (reactionType) {
      case 'like':
        return 'Like';
      case 'love':
        return 'Love';
      case 'haha':
        return 'Haha';
      case 'wow':
        return 'Wow';
      case 'sad':
        return 'Sad';
      case 'angry':
        return 'Angry';
      default:
        return capitalize(reactionType);
    }
  }

  String capitalize(String s) {
    if (s.isEmpty) return s;
    return s[0].toUpperCase() + s.substring(1);
  }
}
