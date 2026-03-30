import 'package:flutter/material.dart';
import '../../managers/reaction_manager.dart';
import '../widgets/reaction/post_reactions_popup.dart';

class ReactionUtils {
  static void showReactionsPopup({
    required BuildContext context,
    required Offset position,
    required String itemId, // Could be postId or commentId
    required Function(String, String?) onReactionSelected,
    bool isComment = true,
  }) {
    showDialog(
      context: context,
      barrierColor: Colors.transparent,
      builder: (BuildContext context) {
        return PostReactionsPopup(
          reactionIcons: ReactionManager.reactionIcons,
          reactionColors: ReactionManager.reactionColors,
          position: position,
          isComment: isComment,
          onReactionSelected: (reactionType) {
            Navigator.of(context).pop();
            onReactionSelected(itemId, reactionType);
          },
        );
      },
    );
  }
}