import 'package:flutter/material.dart';
import '../../../managers/reaction_manager.dart';
import 'reaction_button.dart';
import 'reaction_panel.dart';

class AnimatedReactionButton extends StatefulWidget {
  final bool isLiked;
  final String reaction;
  final int likesCount;
  final Function(bool, String, int) onReactionChanged;
  
  const AnimatedReactionButton({
    Key? key,
    required this.isLiked,
    required this.reaction,
    required this.likesCount,
    required this.onReactionChanged,
  }) : super(key: key);
  
  @override
  State<AnimatedReactionButton> createState() => _AnimatedReactionButtonState();
}

class _AnimatedReactionButtonState extends State<AnimatedReactionButton> {
  late ReactionManager _manager;
  bool _isPanelVisible = false;
  
  @override
  void initState() {
    super.initState();
    _manager = ReactionManager(
      isLiked: widget.isLiked,
      currentReaction: widget.reaction,
      likesCount: widget.likesCount,
      onReactionChanged: widget.onReactionChanged,
    );
  }
  
  void _showPanel() {
    setState(() {
      _isPanelVisible = true;
    });
    _manager.showReactionPanel();
  }
  
  void _hidePanel() {
    setState(() {
      _isPanelVisible = false;
    });
    _manager.hideReactionPanel();
  }
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        // The reaction button
        ReactionButton(
          manager: _manager,
          onLongPressStart: _showPanel,
          onLongPressEnd: _hidePanel,
        ),
        
        // The floating reaction panel
        Positioned(
          bottom: 36, // Position above the button
          left: -40, // Adjust horizontal position
          child: ReactionPanel(
            manager: _manager,
            isVisible: _isPanelVisible,
          ),
        ),
      ],
    );
  }
}