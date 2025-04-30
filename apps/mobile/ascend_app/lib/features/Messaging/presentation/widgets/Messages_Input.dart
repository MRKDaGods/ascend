import 'dart:async';

import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/animation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MessageInput extends StatefulWidget {
  final TextEditingController messageController;
  final FocusNode focusNode;
  final Function(String) onSendMessage;
  final Function() onAttachmentPressed;
  final Function() onCameraPressed;
  final Function() onEmojiPressed;
  final Function(bool) onTypingStatusChanged;
  final String conversationId;

  const MessageInput({
    Key? key,
    required this.messageController,
    required this.focusNode,
    required this.onSendMessage,
    required this.onAttachmentPressed,
    required this.onCameraPressed,
    required this.onEmojiPressed,
    required this.onTypingStatusChanged,
    required this.conversationId,
  }) : super(key: key);

  @override
  State<MessageInput> createState() => _MessageInputState();
}

class _MessageInputState extends State<MessageInput>
    with SingleTickerProviderStateMixin {
  bool _showAttachments = false;
  bool _isTyping = false;
  Timer? _typingTimer;

  // Animation controllers
  late AnimationController _attachmentController;
  late Animation<double> _attachmentAnimation;

  @override
  void initState() {
    super.initState();

    // Setup animations
    _attachmentController = AnimationController(
      duration: const Duration(milliseconds: 250),
      vsync: this,
    );
    _attachmentAnimation = CurvedAnimation(
      parent: _attachmentController,
      curve: Curves.easeOut,
    );

    // Setup typing detection
    widget.messageController.addListener(_onTypingChanged);
  }

  void _onTypingChanged() {
    bool isCurrentlyTyping = widget.messageController.text.isNotEmpty;

    if (isCurrentlyTyping != _isTyping) {
      setState(() {
        _isTyping = isCurrentlyTyping;
      });

      // Notify parent about typing status change
      widget.onTypingStatusChanged(isCurrentlyTyping);
    }

    //dispatch typing event and reset timer
    if (isCurrentlyTyping) {
      context.read<MessagingBloc>().add(
        SendTypingNotification(widget.conversationId),
      );
    }

    _typingTimer?.cancel();
    _typingTimer = Timer(const Duration(seconds: 3), () {
      if (isCurrentlyTyping) {
        setState(() {
          _isTyping = false;
        });
        widget.onTypingStatusChanged(false);
      }
    });
  }

  void _sendMessage() {
    final messageText = widget.messageController.text.trim();
    if (messageText.isEmpty) return;

    widget.onSendMessage(messageText);
    widget.messageController.clear();
  }

  void _toggleAttachments() {
    setState(() {
      _showAttachments = !_showAttachments;
    });

    if (_showAttachments) {
      _attachmentController.forward();
    } else {
      _attachmentController.reverse();
    }
  }

  @override
  void dispose() {
    widget.messageController.removeListener(_onTypingChanged);
    _typingTimer?.cancel();
    _attachmentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Attachment selection
        if (_showAttachments)
          SizeTransition(
            sizeFactor: _attachmentAnimation,
            child: _buildAttachmentsSection(),
          ),

        // Message input field
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 3,
                offset: Offset(0, -1),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // Attachment button
              IconButton(
                icon: Icon(
                  _showAttachments ? Icons.close : Icons.attach_file,
                  color: _showAttachments ? Colors.blue : Colors.grey[600],
                ),
                onPressed: () {
                  _toggleAttachments();
                  widget.onAttachmentPressed();
                },
              ),

              // Text input field
              Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // Text field
                      Expanded(
                        child: TextField(
                          controller: widget.messageController,
                          focusNode: widget.focusNode,
                          maxLines: 5,
                          minLines: 1,
                          textCapitalization: TextCapitalization.sentences,
                          decoration: InputDecoration(
                            hintText: 'Message',
                            hintStyle: TextStyle(color: Colors.grey[500]),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ),

                      // Send/Voice button
                      Container(
                        margin: const EdgeInsets.only(bottom: 4),
                        decoration: BoxDecoration(
                          color: Theme.of(context).primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: Icon(
                            widget.messageController.text.isNotEmpty
                                ? Icons.send
                                : Icons.mic,
                            color: Colors.white,
                            size: 22,
                          ),
                          onPressed:
                              widget.messageController.text.isNotEmpty
                                  ? _sendMessage
                                  : () {
                                    // Handle voice recording
                                  },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAttachmentsSection() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      color: Colors.grey[100],
      height: 100,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 8),
        children: [
          _buildAttachmentOption(
            icon: Icons.insert_drive_file,
            label: 'Send a document',
            color: Colors.grey,
            onTap: () => widget.onAttachmentPressed(),
          ),
          _buildAttachmentOption(
            icon: Icons.camera_alt,
            label: 'Take a photo or video',
            color: Colors.green,
            onTap: () => widget.onCameraPressed(),
          ),
          _buildAttachmentOption(
            icon: Icons.image,
            label: 'Video',
            color: Colors.red,
            onTap: () {},
          ),
          _buildAttachmentOption(
            icon: Icons.gif,
            label: 'Send a GIF',
            color: Colors.orange,
            onTap: () {},
          ),
          _buildAttachmentOption(
            icon: Icons.alternate_email,
            label: 'Mention a person',
            color: Colors.purple,
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildAttachmentOption({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      constraints: BoxConstraints(minWidth: 80, maxWidth: 120),
      margin: const EdgeInsets.symmetric(horizontal: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(fontSize: 12),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
