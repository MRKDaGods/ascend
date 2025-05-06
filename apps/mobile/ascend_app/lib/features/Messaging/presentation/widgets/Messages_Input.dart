import 'dart:async';
import 'dart:io';

import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;

class MessageInput extends StatefulWidget {
  final TextEditingController messageController;
  final FocusNode focusNode;
  final Function(String) onSendMessage;
  final Function() onAttachmentPressed;
  final Function() onCameraPressed;
  final Function() onEmojiPressed;
  final Function(bool) onTypingStatusChanged;
  final String conversationId;
  final Function(File, String)? onFileSelected;

  const MessageInput({
    super.key,
    required this.messageController,
    required this.focusNode,
    required this.onSendMessage,
    required this.onAttachmentPressed,
    required this.onCameraPressed,
    required this.onEmojiPressed,
    required this.onTypingStatusChanged,
    required this.conversationId,
    this.onFileSelected,
  });

  @override
  State<MessageInput> createState() => _MessageInputState();
}

class _MessageInputState extends State<MessageInput>
    with SingleTickerProviderStateMixin {
  bool _showAttachments = false;
  bool _isTyping = false;
  Timer? _typingTimer;
  File? _selectedFile;
  String _selectedFileType = '';

  late AnimationController _attachmentController;
  late Animation<double> _attachmentAnimation;

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();

    _attachmentController = AnimationController(
      duration: const Duration(milliseconds: 250),
      vsync: this,
    );
    _attachmentAnimation = CurvedAnimation(
      parent: _attachmentController,
      curve: Curves.easeOut,
    );

    widget.messageController.addListener(_onTypingChanged);
  }

  void _onTypingChanged() {
    bool isCurrentlyTyping = widget.messageController.text.isNotEmpty;

    if (isCurrentlyTyping != _isTyping) {
      setState(() {
        _isTyping = isCurrentlyTyping;
      });

      widget.onTypingStatusChanged(isCurrentlyTyping);
    }

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

    if (_selectedFile != null) {
      if (widget.onFileSelected != null) {
        widget.onFileSelected!(_selectedFile!, _selectedFileType);
      }
      _clearSelectedFile();
    } else if (messageText.isNotEmpty) {
      widget.onSendMessage(messageText);
    } else {
      return;
    }

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

  Future<void> _pickDocument() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'],
    );

    if (result != null) {
      setState(() {
        _selectedFile = File(result.files.single.path!);
        _selectedFileType = 'document';
      });
      _toggleAttachments();
    }
  }

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );

    if (image != null) {
      setState(() {
        _selectedFile = File(image.path);
        _selectedFileType = 'image';
      });
      _toggleAttachments();
    }
  }

  Future<void> _takePhoto() async {
    final XFile? photo = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 80,
    );

    if (photo != null) {
      setState(() {
        _selectedFile = File(photo.path);
        _selectedFileType = 'image';
      });
      _toggleAttachments();
    }
  }

  Future<void> _pickVideo() async {
    final XFile? video = await _picker.pickVideo(source: ImageSource.gallery);

    if (video != null) {
      setState(() {
        _selectedFile = File(video.path);
        _selectedFileType = 'video';
      });
      _toggleAttachments();
    }
  }

  Future<void> _pickGif() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['gif'],
    );

    if (result != null) {
      setState(() {
        _selectedFile = File(result.files.single.path!);
        _selectedFileType = 'gif';
      });
      _toggleAttachments();
    }
  }

  void _clearSelectedFile() {
    setState(() {
      _selectedFile = null;
      _selectedFileType = '';
    });
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
        if (_showAttachments)
          SizeTransition(
            sizeFactor: _attachmentAnimation,
            child: _buildAttachmentsSection(),
          ),

        if (_selectedFile != null) _buildSelectedFilePreview(),

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
                                    ? 'Add a caption...'
                                    : 'Message',
                            hintStyle: TextStyle(color: Colors.grey[500]),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.only(bottom: 4),
                        decoration: BoxDecoration(
                          color: Theme.of(context).primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: Icon(
                            widget.messageController.text.isNotEmpty ||
                                    _selectedFile != null
                                ? Icons.send
                                : Icons.mic,
                            color: Colors.white,
                            size: 22,
                          ),
                          onPressed:
                              widget.messageController.text.isNotEmpty ||
                                      _selectedFile != null
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

  Widget _buildSelectedFilePreview() {
    return Container(
      padding: EdgeInsets.all(8),
      color: Colors.grey[100],
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: Colors.grey[300],
            ),
            child:
                _selectedFileType == 'image' || _selectedFileType == 'gif'
                    ? ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.file(_selectedFile!, fit: BoxFit.cover),
                    )
                    : Center(
                      child: Icon(
                        _getFileIcon(_selectedFile!.path),
                        size: 30,
                        color: Colors.grey[700],
                      ),
                    ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  path.basename(_selectedFile!.path),
                  style: TextStyle(fontWeight: FontWeight.w500),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  '${(_selectedFile!.lengthSync() / 1024).toStringAsFixed(1)} KB',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(Icons.close, color: Colors.grey[700]),
            onPressed: _clearSelectedFile,
          ),
        ],
      ),
    );
  }

  IconData _getFileIcon(String filePath) {
    final extension = path.extension(filePath).toLowerCase();

    switch (extension) {
      case '.pdf':
        return Icons.picture_as_pdf;
      case '.doc':
      case '.docx':
        return Icons.article;
      case '.xls':
      case '.xlsx':
        return Icons.table_chart;
      case '.mp4':
      case '.mov':
      case '.avi':
        return Icons.videocam;
      case '.gif':
        return Icons.gif;
      default:
        return Icons.insert_drive_file;
    }
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
            onTap: _pickDocument,
          ),
          _buildAttachmentOption(
            icon: Icons.camera_alt,
            label: 'Take a photo',
            color: Colors.green,
            onTap: _takePhoto,
          ),
          _buildAttachmentOption(
            icon: Icons.image,
            label: 'Photo & Video',
            color: Colors.purple,
            onTap: _pickImage,
          ),
          _buildAttachmentOption(
            icon: Icons.videocam,
            label: 'Video',
            color: Colors.red,
            onTap: _pickVideo,
          ),
          _buildAttachmentOption(
            icon: Icons.gif,
            label: 'Send a GIF',
            color: Colors.orange,
            onTap: _pickGif,
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
