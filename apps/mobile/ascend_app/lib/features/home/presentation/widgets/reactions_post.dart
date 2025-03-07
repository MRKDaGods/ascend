
import 'package:ascend_app/features/home/presentation/bloc/reaction_button.dart';
import 'package:flutter/material.dart';

class ReactionsPost extends StatelessWidget {
  const ReactionsPost({
    super.key,
    required this.popupWidth,
  });

  final num popupWidth;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: SizedBox(
        width: popupWidth.toDouble(),
        height: 51, // Adjust height as needed
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ReactionButton(icon: Icons.thumb_up, label: "Like"),
            ReactionButton(
              icon: Icons.celebration,
              label: "Celebrate",
              color: Colors.purple,
            ),
            ReactionButton(
              icon: Icons.volunteer_activism,
              label: "Support",
              color: Colors.green,
            ),
            ReactionButton(
              icon: Icons.favorite,
              label: "Love",
              color: Colors.red,
            ),
            ReactionButton(
              icon: Icons.lightbulb,
              label: "Insightful",
              color: Colors.blue,
            ),
            ReactionButton(
              icon: Icons.emoji_emotions,
              label: "Funny",
              color: Colors.orange,
            ),
          ],
        ),
      ),
    );
  }
}
