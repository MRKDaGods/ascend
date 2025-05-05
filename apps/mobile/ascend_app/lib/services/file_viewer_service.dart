import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;
import 'package:open_file/open_file.dart';
import 'package:path/path.dart' as path;
import 'package:ascend_app/features/Messaging/presentation/pages/image_viewer_screen.dart';
import 'package:ascend_app/features/Messaging/presentation/pages/video_player_screen.dart';

class FileViewerService {
  /// Main method to open any type of file
  static Future<void> openFile(
    BuildContext context,
    String fileUrl,
    String fileType,
  ) async {
    debugPrint('FileViewerService: Opening $fileType at $fileUrl');

    if (fileUrl == 'uploading') {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('File is still uploading...')),
        );
      }
      return;
    }

    // Normalize file type
    final normalizedType = fileType.toLowerCase();

    // Determine the file category
    if (_isImageType(normalizedType)) {
      _openImage(context, fileUrl);
    } else if (_isVideoType(normalizedType)) {
      _openVideo(context, fileUrl);
    } else {
      _openDocument(context, fileUrl, normalizedType);
    }
  }

  /// Helper for identifying image file types
  static bool _isImageType(String fileType) {
    return fileType.contains('image') ||
        [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'bmp',
          'webp',
        ].any((ext) => fileType.contains(ext));
  }

  /// Helper for identifying video file types
  static bool _isVideoType(String fileType) {
    return fileType.contains('video') ||
        [
          'mp4',
          'mov',
          'avi',
          'mkv',
          'webm',
        ].any((ext) => fileType.contains(ext));
  }

  /// Opens an image in a full-screen viewer
  static void _openImage(BuildContext context, String imageUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ImageViewerScreen(imageUrl: imageUrl),
      ),
    );
  }

  /// Opens a video in the video player
  static void _openVideo(BuildContext context, String videoUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => VideoPlayerScreen(videoUrl: videoUrl),
      ),
    );
  }

  /// Opens a document by downloading if needed and using native handlers
  static Future<void> _openDocument(
    BuildContext context,
    String fileUrl,
    String fileType,
  ) async {
    try {
      // Show loading indicator
      _showLoadingDialog(context);

      // Check if it's a URL or local path
      if (fileUrl.startsWith('http')) {
        // It's a network URL, need to download first
        await _downloadAndOpenFile(context, fileUrl, fileType);
      } else {
        // Try to open as a local file
        final result = await OpenFile.open(fileUrl);

        // Hide loading indicator
        if (context.mounted) Navigator.pop(context);

        if (result.type != ResultType.done) {
          if (context.mounted) {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text('Error: ${result.message}')));
          }
        }
      }
    } catch (e) {
      // Hide loading indicator
      if (context.mounted) Navigator.pop(context);

      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error opening file: $e')));
      }
    }
  }

  /// Downloads a file from URL and opens it
  static Future<void> _downloadAndOpenFile(
    BuildContext context,
    String url,
    String fileType,
  ) async {
    try {
      // Request storage permission based on Android version
      bool permissionGranted = false;

      if (Platform.isAndroid) {
        // For Android 13+ (SDK 33+)
        if (await Permission.photos.request().isGranted &&
            await Permission.videos.request().isGranted &&
            await Permission.audio.request().isGranted) {
          permissionGranted = true;
        }
        // For older Android versions
        else if (await Permission.storage.request().isGranted) {
          permissionGranted = true;
        }
      } else {
        // For iOS or other platforms
        permissionGranted = await Permission.storage.request().isGranted;
      }

      if (!permissionGranted) {
        if (context.mounted) {
          Navigator.pop(context); // Hide loading
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Storage permission required to download files'),
              action: SnackBarAction(
                label: 'Settings',
                onPressed: openAppSettings,
              ),
            ),
          );
        }
        return;
      }

      // Extract filename from URL or generate one
      String fileName = path.basename(url);
      if (fileName.isEmpty || !fileName.contains('.')) {
        // Generate filename based on timestamp and type
        String extension = fileType.contains('.') ? fileType : '.$fileType';
        fileName = 'file_${DateTime.now().millisecondsSinceEpoch}$extension';
      }

      // Get app's documents directory (most reliable across Android versions)
      final dir = await getApplicationDocumentsDirectory();

      // Create download path if needed
      final downloadPath = '${dir.path}/Downloads';
      await Directory(downloadPath).create(recursive: true);

      // Full file path for saving
      final filePath = '$downloadPath/$fileName';

      // Only download if file doesn't already exist
      final file = File(filePath);
      if (!await file.exists()) {
        // Download the file
        final response = await http.get(Uri.parse(url));
        if (response.statusCode != 200) {
          throw Exception('Failed to download file: ${response.statusCode}');
        }

        // Save the file
        await file.writeAsBytes(response.bodyBytes);
        debugPrint('File downloaded to: $filePath');
      } else {
        debugPrint('File already exists at: $filePath');
      }

      // Hide loading indicator
      if (context.mounted) Navigator.pop(context);

      // Open the file
      final result = await OpenFile.open(filePath);
      if (result.type != ResultType.done && context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: ${result.message}')));
      }
    } catch (e) {
      if (context.mounted) Navigator.pop(context);
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  /// Gets the best storage directory to use (SD card if available)
  static Future<Directory> _getBestStorageDirectory() async {
    try {
      // Start by checking for external directories (including SD card)
      final externalDirs = await getExternalStorageDirectories();

      if (externalDirs != null && externalDirs.isNotEmpty) {
        // Look for SD card paths - they typically have specific patterns
        for (final dir in externalDirs) {
          final path = dir.path.toLowerCase();
          if (path.contains('sdcard') &&
              !path.contains('emulated') &&
              !path.contains('self')) {
            debugPrint('Using SD card storage: $path');
            return dir;
          }
        }

        // If no SD card found, use first external directory
        debugPrint('Using external storage: ${externalDirs.first.path}');
        return externalDirs.first;
      }

      // Fall back to downloads directory
      try {
        final downloadsDir = await getDownloadsDirectory();
        if (downloadsDir != null) {
          debugPrint('Using downloads directory: ${downloadsDir.path}');
          return downloadsDir;
        }
      } catch (e) {
        debugPrint('Error getting downloads directory: $e');
      }

      // Last resort: use app documents directory
      final appDocDir = await getApplicationDocumentsDirectory();
      debugPrint('Using app documents directory: ${appDocDir.path}');
      return appDocDir;
    } catch (e) {
      debugPrint('Error finding storage directories: $e');
      // If all else fails, use app documents directory
      return await getApplicationDocumentsDirectory();
    }
  }

  /// Shows a loading dialog
  static void _showLoadingDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder:
          (context) => Dialog(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(width: 20),
                  Text('Preparing file...'),
                ],
              ),
            ),
          ),
    );
  }
}
