import 'dart:async';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path/path.dart' as path;
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MessageInput extends StatefulWidget {
  final TextEditingController messageController;
  final FocusNode focusNode;
  final Function(String) onSendMessage;
  final Function() onAttachmentPressed;
  final Function() onCameraPressed;
  final Function() onEmojiPressed;
  final Function(bool) onTypingStatusChanged;
  final Function(File) onFileSelected;
  final String conversationId;

  const MessageInput({
    super.key,
    required this.messageController,
    required this.focusNode,
    required this.onSendMessage,
    required this.onAttachmentPressed,
    required this.onCameraPressed,
    required this.onEmojiPressed,
    required this.onTypingStatusChanged,
    required this.onFileSelected,
    required this.conversationId,
  });

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

  // Media
  File? _selectedFile;
  String? _selectedFileType;
  bool _showMediaPreview = false;
  final _imagePicker = ImagePicker();

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

  void _sendTextMessage() {
    final messageText = widget.messageController.text.trim();
    if (messageText.isEmpty) return;

    widget.onSendMessage(messageText);
    widget.messageController.clear();
  }

  void _sendFile() {
    if (_selectedFile != null) {
      widget.onFileSelected(_selectedFile!);
      widget.messageController.clear();
    }
  }

  Future<void> _pickDocument() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
      );
      if (result != null && result.files.isNotEmpty) {
        final file = File(result.files.first.path!);
        setState(() {
          _selectedFile = File(result.files.single.path!);
          _selectedFileType = path.extension(file.path);
          _showMediaPreview = true;
          _showAttachments = false;
        });
        _attachmentController.reverse();
      }
    } catch (e) {
      // Handle error
      debugPrint('Error picking document: $e');
    }
  }

  Future<void> _pickImage() async {
    try {
      final pickedFile = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 50,
      );
      if (pickedFile != null) {
        setState(() {
          _selectedFile = File(pickedFile.path);
          _selectedFileType = 'image';
          _showMediaPreview = true;
          _showAttachments = false;
        });
        _attachmentController.reverse();
      }
    } catch (e) {
      // Handle error
      debugPrint('Error picking image: $e');
    }
  }

  Future<void> _pickVideo() async {
    try {
      final pickedFile = await _imagePicker.pickVideo(
        source: ImageSource.gallery,
        maxDuration: const Duration(minutes: 5),
      );
      if (pickedFile != null) {
        setState(() {
          _selectedFile = File(pickedFile.path);
          _selectedFileType = 'video';
          _showMediaPreview = true;
          _showAttachments = false;
        });
        _attachmentController.reverse();
      }
    } catch (e) {
      // Handle error
      debugPrint('Error picking video: $e');
    }
  }

  void _clearSelectedMedia() {
    setState(() {
      _selectedFile = null;
      _selectedFileType = null;
      _showMediaPreview = false;
    });
  }

  Widget _buildMediaPreview() {
    return Container(
      padding: const EdgeInsets.all(8),
      color: Colors.grey[100],
      child: Row(
        children: [
          // Media preview
          if (_selectedFileType == 'image')
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.file(
                _selectedFile!,
                width: 60,
                height: 60,
                fit: BoxFit.cover,
              ),
            )
          else
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                _selectedFileType == 'video'
                    ? Icons.video_file
                    : Icons.insert_drive_file,
                color: _selectedFileType == 'video' ? Colors.red : Colors.blue,
                size: 30,
              ),
            ),

          // File details
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    path.basename(_selectedFile!.path),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _selectedFileType?.toUpperCase() ?? 'FILE',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
          ),

          // Remove button
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: _clearSelectedMedia,
          ),
        ],
      ),
    );
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

        // Media preview
        if (_showMediaPreview && _selectedFile != null) _buildMediaPreview(),

        // Message input field
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                // ignore: deprecated_member_use
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
                            hintText:
                                _selectedFile != null
                                    ? 'Caption'
                                    : 'Type a message...',
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
                          icon: Icon(Icons.send, color: Colors.white, size: 22),
                          onPressed: () {
                            if (_selectedFile != null) {
                              _sendFile();
                            } else {
                              _sendTextMessage();
                            }
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
            label: 'Document',
            color: Colors.grey,
            onTap: () => _pickDocument(),
          ),
          _buildAttachmentOption(
            icon: Icons.camera_alt,
            label: 'Photo',
            color: Colors.green,
            onTap: () => _pickImage(),
          ),
          _buildAttachmentOption(
            icon: Icons.image,
            label: 'Video',
            color: Colors.red,
            onTap: _pickVideo,
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
                // ignore: deprecated_member_use
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
