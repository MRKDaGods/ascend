import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:path/path.dart' as path;
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

class ChatBox extends StatelessWidget {
  final String messageId;
  final String senderName;
  final String receiverId;
  final String senderAvatar;
  final bool sentOrReceived;
  final DateTime sentAt;
  final DateTime receivedAt;
  final String content;
  final String? fileUrl;
  final String? fileType;
  final String conversationId;

  const ChatBox({
    super.key,
    required this.messageId,
    required this.senderName,
    required this.receiverId,
    required this.senderAvatar,
    required this.sentOrReceived,
    required this.sentAt,
    required this.receivedAt,
    required this.content,
    this.fileUrl,
    this.fileType,
    required this.conversationId,
  });

  @override
  Widget build(BuildContext context) {
    final time = DateFormat('h:mm a').format(sentAt.toLocal());
    final hasFile = fileUrl != null && fileUrl!.isNotEmpty;
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment:
            sentOrReceived ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Avatar for received messages
          if (!sentOrReceived) ...[
            CircleAvatar(
              radius: 16,
              backgroundImage: NetworkImage(senderAvatar),
              onBackgroundImageError: (_, __) {
                // Handle error loading image
              },
            ),
            SizedBox(width: 8),
          ],

          // Message content
          Flexible(
            child: Container(
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.7,
              ),
              decoration: BoxDecoration(
                color:
                    sentOrReceived
                        ? theme.primaryColor.withOpacity(0.2)
                        : Colors.grey[200],
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // File content
                    if (hasFile) _buildFileContent(context),

                    // Text content (may appear with or without a file)
                    if (content.isNotEmpty) ...[
                      if (hasFile) SizedBox(height: 8),
                      Text(
                        content,
                        style: TextStyle(fontSize: 16, color: Colors.black87),
                      ),
                    ],

                    // Time stamp
                    SizedBox(height: 4),
                    Text(
                      time,
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Avatar for sent messages
          if (sentOrReceived) ...[
            SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundImage: NetworkImage(senderAvatar),
              onBackgroundImageError: (_, __) {
                // Handle error loading image
              },
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildFileContent(BuildContext context) {
    if (fileUrl == null || fileUrl!.isEmpty) return SizedBox.shrink();
    final theme = Theme.of(context);

    // Check if it's an image
    if (_isImageFile(fileUrl!, fileType)) {
      return InkWell(
        onTap: () => _openFileFullScreen(context),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: CachedNetworkImage(
            imageUrl: fileUrl!,
            placeholder:
                (context, url) => Container(
                  height: 150,
                  width: double.infinity,
                  color: Colors.grey[300],
                  child: Center(child: CircularProgressIndicator()),
                ),
            errorWidget:
                (context, url, error) => Container(
                  height: 150,
                  width: double.infinity,
                  color: Colors.grey[300],
                  child: Icon(Icons.error, color: Colors.red),
                ),
            fit: BoxFit.cover,
            width: double.infinity,
            height: 200,
          ),
        ),
      );
    }
    // Check if it's a video
    else if (_isVideoFile(fileUrl!, fileType)) {
      return InkWell(
        onTap: () => _openVideoPlayer(context),
        child: Container(
          height: 200,
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.black87,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Video thumbnail (could be a generated preview or a placeholder)
              Center(
                child: Icon(
                  Icons.play_circle_fill,
                  color: Colors.white,
                  size: 50,
                ),
              ),
              Positioned(
                bottom: 8,
                left: 8,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.videocam, color: Colors.white, size: 16),
                      SizedBox(width: 4),
                      Text(
                        'Video',
                        style: TextStyle(color: Colors.white, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }
    // Handle PDF files
    else if (_isPdfFile(fileUrl!, fileType)) {
      final fileName = _getFileNameFromUrl(fileUrl!);
      return InkWell(
        onTap: () => _openPdfViewer(context),
        child: Container(
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Row(
            children: [
              Stack(
                alignment: Alignment.center,
                children: [
                  Icon(Icons.picture_as_pdf, color: Colors.red[700], size: 36),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: theme.primaryColor,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.visibility,
                        color: Colors.white,
                        size: 12,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      fileName,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 4),
                    Text(
                      'PDF - Tap to view',
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }
    // Handle document files
    else if (_isDocumentFile(fileUrl!, fileType)) {
      final fileName = _getFileNameFromUrl(fileUrl!);
      return InkWell(
        onTap: () => _openFile(fileUrl!),
        child: Container(
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Row(
            children: [
              Icon(_getFileIcon(), color: theme.primaryColor, size: 36),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      fileName,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Document - Tap to open',
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }
    // Handle other file types
    else {
      final fileName = _getFileNameFromUrl(fileUrl!);
      return InkWell(
        onTap: () => _openFile(fileUrl!),
        child: Container(
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Row(
            children: [
              Icon(
                Icons.insert_drive_file,
                color: theme.primaryColor,
                size: 36,
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      fileName,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 4),
                    Text(
                      'File - Tap to open',
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }
  }

  bool _isImageFile(String url, String? fileType) {
    if (fileType != null) {
      if (fileType == 'image' ||
          fileType.startsWith('image/') ||
          [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'webp',
          ].contains(fileType.toLowerCase())) {
        return true;
      }
    }

    final ext = path.extension(url).toLowerCase();
    return [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.bmp',
      '.heic',
    ].contains(ext);
  }

  bool _isVideoFile(String url, String? fileType) {
    if (fileType != null) {
      if (fileType == 'video' ||
          fileType.startsWith('video/') ||
          [
            'mp4',
            'mov',
            'avi',
            'webm',
            'mkv',
          ].contains(fileType.toLowerCase())) {
        return true;
      }
    }

    final ext = path.extension(url).toLowerCase();
    return [
      '.mp4',
      '.mov',
      '.avi',
      '.webm',
      '.mkv',
      '.flv',
      '.wmv',
      '.3gp',
    ].contains(ext);
  }

  bool _isPdfFile(String url, String? fileType) {
    if (fileType != null) {
      if (fileType == 'pdf' ||
          fileType == 'application/pdf' ||
          fileType.contains('pdf')) {
        return true;
      }
    }

    final ext = path.extension(url).toLowerCase();
    return ext == '.pdf';
  }

  bool _isDocumentFile(String url, String? fileType) {
    if (fileType != null) {
      if (fileType == 'document' ||
          fileType.contains('doc') ||
          fileType.contains('xls') ||
          fileType.contains('ppt') ||
          [
            'application/msword',
            'application/vnd.openxmlformats-officedocument',
          ].any((t) => fileType.contains(t))) {
        return true;
      }
    }

    final ext = path.extension(url).toLowerCase();
    final docExtensions = [
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.txt',
      '.rtf',
      '.odt',
      '.ods',
      '.odp',
    ];
    return docExtensions.contains(ext);
  }

  String _getFileNameFromUrl(String url) {
    try {
      return path.basename(Uri.parse(url).path);
    } catch (e) {
      return 'File';
    }
  }

  IconData _getFileIcon() {
    if (_isPdfFile(fileUrl ?? '', fileType)) {
      return Icons.picture_as_pdf;
    } else if (fileType?.contains('doc') == true ||
        fileUrl?.toLowerCase().endsWith('.doc') == true ||
        fileUrl?.toLowerCase().endsWith('.docx') == true) {
      return Icons.description;
    } else if (fileType?.contains('xls') == true ||
        fileUrl?.toLowerCase().endsWith('.xls') == true ||
        fileUrl?.toLowerCase().endsWith('.xlsx') == true) {
      return Icons.table_chart;
    } else if (fileType?.contains('ppt') == true ||
        fileUrl?.toLowerCase().endsWith('.ppt') == true ||
        fileUrl?.toLowerCase().endsWith('.pptx') == true) {
      return Icons.slideshow;
    } else {
      return Icons.insert_drive_file;
    }
  }

  void _openFile(String url) async {
    try {
      final Uri uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        debugPrint('Could not launch $url');
      }
    } catch (e) {
      debugPrint('Error opening file: $e');
    }
  }

  void _openFileFullScreen(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder:
            (context) => Scaffold(
              appBar: AppBar(
                backgroundColor: Colors.black,
                iconTheme: IconThemeData(color: Colors.white),
                elevation: 0,
              ),
              body: Container(
                color: Colors.black,
                child: Center(
                  child: InteractiveViewer(
                    minScale: 0.5,
                    maxScale: 4.0,
                    child: CachedNetworkImage(
                      imageUrl: fileUrl!,
                      placeholder:
                          (context, url) =>
                              Center(child: CircularProgressIndicator()),
                      errorWidget:
                          (context, url, error) =>
                              Icon(Icons.error, color: Colors.red, size: 50),
                      fit: BoxFit.contain,
                      width: double.infinity,
                      height: double.infinity,
                    ),
                  ),
                ),
              ),
            ),
      ),
    );
  }

  void _openVideoPlayer(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => _VideoPlayerScreen(videoUrl: fileUrl!),
      ),
    );
  }

  void _openPdfViewer(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder:
            (context) => Scaffold(
              appBar: AppBar(
                title: Text(_getFileNameFromUrl(fileUrl!)),
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              body: SfPdfViewer.network(
                fileUrl!,
                canShowPaginationDialog: true,
                canShowScrollHead: true,
                canShowScrollStatus: true,
                enableDoubleTapZooming: true,
              ),
            ),
      ),
    );
  }
}

class _VideoPlayerScreen extends StatefulWidget {
  final String videoUrl;

  const _VideoPlayerScreen({Key? key, required this.videoUrl})
    : super(key: key);

  @override
  State<_VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<_VideoPlayerScreen> {
  late VideoPlayerController _videoPlayerController;
  ChewieController? _chewieController;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initializePlayer();
  }

  void _initializePlayer() async {
    try {
      _videoPlayerController = VideoPlayerController.network(widget.videoUrl);
      await _videoPlayerController.initialize();

      _chewieController = ChewieController(
        videoPlayerController: _videoPlayerController,
        autoPlay: true,
        looping: false,
        aspectRatio: _videoPlayerController.value.aspectRatio,
        errorBuilder: (context, errorMessage) {
          return Center(
            child: Text(
              'Error: $errorMessage',
              style: TextStyle(color: Colors.white),
            ),
          );
        },
      );

      setState(() {
        _isLoading = false;
      });
    } catch (error) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Could not play this video: ${error.toString()}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: Center(
        child:
            _isLoading
                ? CircularProgressIndicator()
                : _errorMessage != null
                ? Text(
                  _errorMessage!,
                  style: TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                )
                : Chewie(controller: _chewieController!),
      ),
    );
  }

  @override
  void dispose() {
    _videoPlayerController.dispose();
    _chewieController?.dispose();
    super.dispose();
  }
}
