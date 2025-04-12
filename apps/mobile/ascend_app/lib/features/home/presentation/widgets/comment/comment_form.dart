import 'package:flutter/material.dart';
import 'package:ascend_app/shared/widgets/user_avatar.dart';

class CommentForm extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode? focusNode;
  final Function(String) onSubmit;
  final VoidCallback? onTap;
  final String? hintText;
  final String? userAvatarUrl;
  final String? userName; // Add userName parameter
  final String? replyingTo;
  final VoidCallback? onCancelReply;

  const CommentForm({
    super.key,
    required this.controller,
    this.focusNode,
    required this.onSubmit,
    this.onTap,
    this.hintText,
    this.userAvatarUrl,
    this.userName, // Add to constructor
    this.replyingTo,
    this.onCancelReply,
  });

  @override
  Widget build(BuildContext context) {
    // Use passed userName and userAvatarUrl directly
    final String displayName = userName ?? 'You';
    final bool hasAvatar = userAvatarUrl != null && userAvatarUrl!.isNotEmpty;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (replyingTo != null)
            Padding(
              padding: const EdgeInsets.only(left: 40.0, bottom: 8.0),
              child: Row(
                children: [
                  Text(
                    'Replying to $replyingTo',
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontWeight: FontWeight.w500,
                      fontSize: 12.0,
                    ),
                  ),
                  if (onCancelReply != null)
                    TextButton(
                      onPressed: onCancelReply,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        textStyle: const TextStyle(fontSize: 12.0),
                      ),
                      child: const Text('Cancel'),
                    ),
                ],
              ),
            ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              UserAvatar(imageUrl: userAvatarUrl, radius: 16),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: controller,
                  focusNode: focusNode,
                  onTap: onTap,
                  decoration: InputDecoration(
                    hintText:
                        replyingTo != null
                            ? 'Reply to $replyingTo...'
                            : (hintText ?? 'Add a comment as $displayName...'),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20.0),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Colors.grey[200],
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                      vertical: 8.0,
                    ),
                  ),
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _handleSubmit(),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.send),
                color: Theme.of(context).primaryColor,
                onPressed: _handleSubmit,
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _handleSubmit() {
    final text = controller.text.trim();
    if (text.isNotEmpty) {
      onSubmit(text);
    }
  }
}
