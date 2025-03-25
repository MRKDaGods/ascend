import 'package:flutter/material.dart';
import '../../../managers/reaction_manager.dart';

class ReactionPanel extends StatefulWidget {
  final ReactionManager manager;
  final bool isVisible;
  
  const ReactionPanel({
    Key? key,
    required this.manager,
    required this.isVisible,
  }) : super(key: key);
  
  @override
  State<ReactionPanel> createState() => _ReactionPanelState();
}

class _ReactionPanelState extends State<ReactionPanel> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    
    _scaleAnimation = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));
  }
  
  @override
  void didUpdateWidget(ReactionPanel oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isVisible != oldWidget.isVisible) {
      if (widget.isVisible) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    }
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    if (!widget.isVisible && _controller.isDismissed) {
      return const SizedBox.shrink(); // Don't render when hidden and animation complete
    }
    
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Opacity(
            opacity: _scaleAnimation.value,
            child: Card(
              elevation: 8,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildReactionOption('like', ReactionManager.reactionIcons['like']!),
                    _buildReactionOption('love', ReactionManager.reactionIcons['love']!),
                    _buildReactionOption('haha', ReactionManager.reactionIcons['haha']!),
                    _buildReactionOption('wow', ReactionManager.reactionIcons['wow']!),
                    _buildReactionOption('sad', ReactionManager.reactionIcons['sad']!),
                    _buildReactionOption('angry', ReactionManager.reactionIcons['angry']!),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
  
  // Individual reaction option with animation
  Widget _buildReactionOption(String type, IconData icon) {
    bool isHolding = false;
    
    return StatefulBuilder(
      builder: (context, setState) {
        return GestureDetector(
          onTap: () {
            widget.manager.toggleReaction(type);
            widget.manager.hideReactionPanel();
            setState(() {});
          },
          onLongPress: () {}, // Enable long press recognition
          onLongPressStart: (_) {
            setState(() {
              isHolding = true;
            });
          },
          onLongPressEnd: (_) {
            setState(() {
              isHolding = false;
            });
          },
          onLongPressCancel: () {
            setState(() {
              isHolding = false;
            });
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.grey[100],
                  ),
                  padding: const EdgeInsets.all(8.0),
                  child: Icon(
                    icon,
                    color: ReactionManager.reactionColors[type],
                    size: 20,
                  ),
                ),
                const SizedBox(height: 2),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 150),
                  child: isHolding
                    ? Text(
                        ReactionManager.reactionLabels[type]!,
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: ReactionManager.reactionColors[type],
                        ),
                        key: ValueKey<bool>(true),
                      )
                    : SizedBox(height: 12, key: ValueKey<bool>(false)),
                ),
              ],
            ),
          ),
        );
      }
    );
  }
}