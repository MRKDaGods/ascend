// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/Messaging/utils/date_verifier.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/services/file_viewer_service.dart';
import 'package:ascend_app/features/Messaging/presentation/pages/image_viewer_screen.dart';

class ChatBox extends StatefulWidget {
  final String messageId;
  final String receiverId;
  final String senderName;
  final String? senderAvatar;
  final bool sentOrReceived;
  final DateTime sentAt;
  final DateTime receivedAt;
  final String? content;
  final String? fileUrl;
  final String? fileType;
  final String conversationId;

  const ChatBox({
    super.key,
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
  });

  @override
  State<ChatBox> createState() => _ChatBoxState();
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
    return DateVerifier.isMessageRead(widget.receivedAt, widget.sentAt);
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
    String? avatarUrl,
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
                      ? NetworkImage(widget.senderAvatar!)
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

  Widget _buildFileContent(String fileUrl, String fileType) {
    // Debugging
    debugPrint('Processing file: $fileUrl with type: $fileType');

    // Handle uploading state
    if (fileUrl == 'uploading') {
      return Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            const SizedBox(width: 10),
            Text('Uploading $fileType...'),
          ],
        ),
      );
    }

    // Standardize image type detection
    final normalizedType = fileType.toLowerCase();
    final isImage =
        normalizedType.contains('image') ||
        [
          'jpg',
          'jpeg',
          'png',
          'gif',
        ].any((ext) => normalizedType.contains(ext));
    final isVideo =
        normalizedType.contains('video') ||
        [
          'mp4',
          'mov',
          'webm',
          'avi',
        ].any((ext) => normalizedType.contains(ext));

    // Regular file content handling with improved type detection
    if (isImage) {
      return _buildImageContent(fileUrl);
    } else if (isVideo) {
      return _buildVideoContent(fileUrl);
    } else {
      return _buildFileSection(fileUrl, fileType);
    }
  }

  Widget _buildImageContent(String imageUrl) {
    return GestureDetector(
      onTap: () => FileViewerService.openFile(context, imageUrl, 'image'),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 250, maxHeight: 300),
          child: Image.network(
            imageUrl,
            fit: BoxFit.cover,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              return Container(
                height: 150,
                width: 150,
                color: Colors.grey[200],
                child: Center(
                  child: CircularProgressIndicator(
                    value:
                        loadingProgress.expectedTotalBytes != null
                            ? loadingProgress.cumulativeBytesLoaded /
                                loadingProgress.expectedTotalBytes!
                            : null,
                  ),
                ),
              );
            },
            errorBuilder: (context, error, stackTrace) {
              debugPrint('Error loading image: $error');
              return Container(
                height: 150,
                width: 150,
                color: Colors.grey[200],
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.broken_image, color: Colors.grey),
                    SizedBox(height: 8),
                    Text(
                      'Failed to load image',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildVideoContent(String videoUrl) {
    return GestureDetector(
      onTap: () => FileViewerService.openFile(context, videoUrl, 'video'),
      child: Container(
        height: 180,
        width: double.infinity, // Make it take the available width
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Play button
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.play_arrow,
                color: Colors.white,
                size: 40,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFileSection(String fileUrl, String fileType) {
    // Extract filename from URL
    String fileName = 'File';
    try {
      fileName = fileUrl.split('/').last;
      if (fileName.isEmpty) {
        fileName = 'Document';
      }
    } catch (e) {
      debugPrint('Error parsing filename: $e');
    }

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
          Flexible(child: Text(fileName, overflow: TextOverflow.ellipsis)),
          const SizedBox(width: 8),
          TextButton(
            onPressed:
                () => FileViewerService.openFile(context, fileUrl, fileType),
            child: const Text('Open'),
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
                if (hasFile) ...[
                  // Use _buildFileContent which handles different file types properly
                  _buildFileContent(widget.fileUrl!, widget.fileType!),
                  if (hasContent) const SizedBox(height: 8),
                ],
                if (hasContent)
                  Text(
                    widget.content!,
                    style: TextStyle(
                      color: isSent ? Colors.white : Colors.black,
                    ),
                  ),
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
    debugPrint(
      '[ChatBox] Building message widget for messageId: ${widget.messageId}',
    );

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
            } else if (isSent) {
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
        } else if (isSent) {
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
          ],
        );
      },
    );
  }
}
