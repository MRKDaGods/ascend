import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/utils/helper_functions.dart';
import 'package:ascend_app/features/Messaging/utils/date_verifier.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';

class ChatBox extends StatefulWidget {
  final String messageId;
  final String receiverId;
  final String senderName;
  final String senderAvatar;
  final bool sentOrReceived;
  final DateTime sentAt;
  final DateTime receivedAt;
  final String? content;
  final String? fileUrl;
  final String? fileType;
  final String conversationId;

  const ChatBox({
    Key? key,
    required this.messageId,
    required this.receiverId,
    required this.senderName,
    required this.senderAvatar,
    required this.sentOrReceived,
    required this.sentAt,
    required this.receivedAt,
    required this.conversationId,
    this.content,
    this.fileUrl,
    this.fileType,
  }) : super(key: key);

  @override
  _ChatBoxState createState() => _ChatBoxState();
}

class _ChatBoxState extends State<ChatBox> {
  @override
  void initState() {
    super.initState();

    // If this is a received message and hasn't been marked as read yet,
    // trigger read receipt via BLoC
    if (!widget.sentOrReceived && !_isMessageRead()) {
      _updateMessageStatus(true);
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  bool _isMessageRead() {
    // Use DateVerifier to check if the message has been read
    return widget.receivedAt != null &&
        DateVerifier.isMessageRead(widget.receivedAt, widget.sentAt);
  }

  Widget _buildDateSeperator(DateTime date) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      alignment: Alignment.center,
      child: Row(
        children: [
          Expanded(child: Divider(color: Colors.grey[300])),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              DateVerifier.getFormattedDateString(date),
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.grey[600],
              ),
            ),
          ),
          Expanded(child: Divider(color: Colors.grey[300])),
        ],
      ),
    );
  }

  Widget _buildNameandTimeSection(
    String name,
    DateTime date,
    String avatarUrl,
  ) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundImage:
                  !_shouldShowFallbackIcon()
                      ? NetworkImage(widget.senderAvatar)
                      : null, // Use NetworkImage for profile image
              child:
                  _shouldShowFallbackIcon()
                      ? const Icon(Icons.person, size: 40, color: Colors.grey)
                      : null,
            ),
            const SizedBox(width: 8),
            Text(
              name,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        Text(
          DateVerifier.formatTime(date),
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
      ],
    );
  }

  bool _shouldShowFallbackIcon() {
    final imageUrl = widget.senderAvatar;
    return imageUrl == null ||
        imageUrl.isEmpty ||
        imageUrl == 'assets/EmptyUser.png';
  }

  Widget _buildFileTypeIcon(String fileType) {
    switch (fileType) {
      case 'image':
        return const Icon(Icons.image, color: Colors.blue);
      case 'video':
        return const Icon(Icons.videocam, color: Colors.blue);
      case 'audio':
        return const Icon(Icons.audiotrack, color: Colors.blue);
      case 'application/pdf':
        return const Icon(Icons.picture_as_pdf, color: Colors.red);
      case 'document':
        return const Icon(Icons.description, color: Colors.blue);
      default:
        return const Icon(Icons.attach_file, color: Colors.blue);
    }
  }

  Widget _buildFileSection(String fileUrl, String fileType) {
    // Extract filename from URL
    final filename = fileUrl.split('/').last;

    return Container(
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFileTypeIcon(fileType),
          const SizedBox(width: 8),
          Flexible(child: Text(filename, overflow: TextOverflow.ellipsis)),
          const SizedBox(width: 8),
          TextButton(
            onPressed: () {
              // Handle file download using BLoC
              /*context.read<MessagingBloc>().add(
                DownloadFile(
                  fileUrl: fileUrl,
                  fileName: filename,
                  fileType: fileType,
                ),
              );*/
              // For now, just print the file URL
              debugPrint('Downloading file: $fileUrl');
            },
            child: const Text('Download'),
          ),
        ],
      ),
    );
  }

  Widget _buildReadStatus(bool isRead) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          DateVerifier.formatTime(widget.sentAt),
          style: TextStyle(fontSize: 10, color: Colors.grey),
        ),
        const SizedBox(width: 4),
        isRead
            ? const Icon(Icons.done_all, color: Colors.blue, size: 14)
            : const Icon(Icons.done, color: Colors.grey, size: 14),
      ],
    );
  }

  Widget _showSuggestedReplies() {
    return Container(
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Suggested Replies:', style: TextStyle(fontSize: 16)),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElevatedButton(
                onPressed: () {
                  _sendSuggestedReply("How are you?");
                },
                child: const Text(
                  'How are you?',
                  style: TextStyle(color: Colors.blue),
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  _sendSuggestedReply("Hello!");
                },
                child: const Text(
                  'Hello!',
                  style: TextStyle(color: Colors.blue),
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  _sendSuggestedReply("Thanks!");
                },
                child: const Text(
                  'Thanks!',
                  style: TextStyle(color: Colors.blue),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestedReplyButton(String text) {
    return OutlinedButton(
      onPressed: () => _sendSuggestedReply(text),
      style: OutlinedButton.styleFrom(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      child: Text(text),
    );
  }

  void _sendSuggestedReply(String text) {
    // Use BLoC to send the suggested reply
    if (mounted) {
      context.read<MessagingBloc>().add(
        SendMessage(widget.conversationId, widget.conversationId, text),
      );
    }
  }

  Widget _buildMessageBubble(
    bool isSent,
    bool isReceived,
    bool hasContent,
    bool hasFile,
  ) {
    return Container(
      margin: EdgeInsets.only(
        left: isSent ? 80.0 : 0,
        right: isReceived ? 80.0 : 0,
      ),
      child: Column(
        crossAxisAlignment:
            isSent ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: isSent ? Colors.blue[400] : Colors.grey[200],
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Content and file handling
                if (hasContent && hasFile) ...[
                  Text(
                    widget.content!,
                    style: TextStyle(
                      color: isSent ? Colors.white : Colors.black,
                    ),
                  ),
                  const SizedBox(height: 8),
                  _buildFileSection(widget.fileUrl!, widget.fileType!),
                ] else if (hasContent) ...[
                  Text(
                    widget.content!,
                    style: TextStyle(
                      color: isSent ? Colors.white : Colors.black,
                    ),
                  ),
                ] else if (hasFile) ...[
                  _buildFileSection(widget.fileUrl!, widget.fileType!),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _updateMessageStatus(bool isRead) {
    // Add mounted check before accessing context
    if (mounted) {
      context.read<MessagingBloc>().add(
        MarkMessagesasRead(widget.conversationId),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Configure if chat box contains file or content
    bool hasFile = widget.fileUrl != null && widget.fileUrl!.isNotEmpty;
    bool hasContent = widget.content != null && widget.content!.isNotEmpty;

    // Determine if the message is sent or received
    bool isSent = widget.sentOrReceived;
    bool isReceived = !isSent;

    // Determine the message date
    DateTime messageDate = isSent ? widget.sentAt : widget.receivedAt;

    // Check message read status using bloc state
    bool isRead = false;

    // Store the BlocProvider reference in initState
    return BlocBuilder<MessagingBloc, MessagingBlocState>(
      buildWhen: (previous, current) {
        // Only rebuild if widget is still mounted
        if (!mounted) return false;

        // Only rebuild if the state contains updated message information
        if (current is MessagesLoaded &&
            current.conversationId == widget.conversationId) {
          // Check if this message's read status has changed
          return true;
        }
        return false;
      },
      builder: (context, state) {
        // Update read status based on bloc state if available
        if (state is MessagesLoaded) {
          try {
            final message = state.messages.firstWhere(
              (m) => m.messageId == widget.messageId,
              orElse:
                  () => MessageModel(
                    messageId: '',
                    conversationId: '',
                    content: '',
                    sentAt: DateTime.now(),
                    senderId: '',
                  ),
            );

            if (message.messageId.isNotEmpty && isSent) {
              isRead = message.isRead;
            } else if (isSent && widget.receivedAt != null) {
              // Fall back to the widget's data if message is not found in state
              isRead = DateVerifier.isMessageRead(
                widget.receivedAt,
                widget.sentAt,
              );
            }
          } catch (e) {
            // Handle any potential errors when searching for the message
            debugPrint('Error finding message in state: $e');
          }
        } else if (isSent && widget.receivedAt != null) {
          // Fall back to the widget's data if no valid state
          isRead = DateVerifier.isMessageRead(widget.receivedAt, widget.sentAt);
        }

        return Column(
          crossAxisAlignment:
              isSent ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            // Only show date separator when needed (this should be controlled by parent widget)
            _buildDateSeperator(messageDate),

            _buildNameandTimeSection(
              widget.senderName,
              messageDate,
              widget.senderAvatar,
            ),
            const SizedBox(height: 4),
            _buildMessageBubble(isSent, isReceived, hasContent, hasFile),
            // Show read status for sent messages only
            if (isSent) ...[const SizedBox(width: 4), _buildReadStatus(isRead)],
            // Show suggested replies only for received messages
            if (isReceived) ...[
              const SizedBox(height: 8),
              _showSuggestedReplies(),
            ],
          ],
        );
      },
    );
  }
}
