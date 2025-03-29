import 'package:flutter/material.dart';
import '../../../managers/reaction_manager.dart';

class ReactionButton extends StatefulWidget {
  final ReactionManager manager;
  final VoidCallback onLongPressStart;
  final VoidCallback onLongPressEnd;
  
  const ReactionButton({
    Key? key,
    required this.manager,
    required this.onLongPressStart,
    required this.onLongPressEnd,
  }) : super(key: key);
  
  @override
  State<ReactionButton> createState() => _ReactionButtonState();
}

class _ReactionButtonState extends State<ReactionButton> with SingleTickerProviderStateMixin {
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
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));
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
        // Just toggle default like reaction
        widget.manager.toggleReaction('like');
        setState(() {});
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
          // Animated icon that moves up when pressed
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
          
          // Conditional rendering of the label - only when long pressed
          if (_isLongPressed) ...[
            const SizedBox(width: 8),
            Text(
              widget.manager.getCurrentReactionLabel(),
              style: TextStyle(
                color: widget.manager.getCurrentReactionColor(),
              ),
            ),
          ],
        ],
      ),
    );
  }
}