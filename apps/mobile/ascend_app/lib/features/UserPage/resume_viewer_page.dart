// ignore_for_file: use_build_context_synchronously

import 'dart:io';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_event.dart';
import 'package:ascend_app/features/settings/Presentation/widgets/loading_indicator.dart';

class ResumeViewerPage extends StatefulWidget {
  final String resumeUrl;
  final bool isMyProfile;
  final Profile profile;
  final VoidCallback onResumeUpdated;

  const ResumeViewerPage({
    super.key,
    required this.resumeUrl,
    required this.isMyProfile,
    required this.profile,
    required this.onResumeUpdated,
  });

  @override
  State<ResumeViewerPage> createState() => _ResumeViewerPageState();
}

class _ResumeViewerPageState extends State<ResumeViewerPage> {
  final PdfViewerController _pdfViewerController = PdfViewerController();
  bool _isLoading = false;
  double _zoomLevel = 1.0;
  bool _showControls = true;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _showControls = false;
        });
      }
    });
  }

  void _toggleControls() {
    setState(() {
      _showControls = !_showControls;
    });

    if (_showControls) {
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            _showControls = false;
          });
        }
      });
    }
  }

  Future<void> _downloadResume() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final Uri uri = Uri.parse(widget.resumeUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        // Fallback to manual download
        final response = await http.get(uri);
        final documentDirectory = await getApplicationDocumentsDirectory();

        final String fileName = uri.pathSegments.last;
        final File file = File('${documentDirectory.path}/$fileName');
        await file.writeAsBytes(response.bodyBytes);

        // Share the file
        await SharePlus.instance.share(
          ShareParams(uri: Uri.parse(file.path), text: 'My Resume'),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to download: $e')));
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteResume() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Call API to delete resume
      final endpoint = "/user/profile/resume";
      final response = await sl.apiClient.delete(endpoint);

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Resume deleted successfully")),
        );

        // Update the profile
        final updatedProfile = widget.profile.copyWith(resumeUrl: null);
        context.read<UserProfileBloc>().add(UpdateUserProfile(updatedProfile));

        widget.onResumeUpdated();
        Navigator.pop(context);
      } else {
        throw Exception("Failed to delete resume");
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to delete resume: $e')));
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _replaceResume() async {
    try {
      // Pick a PDF file
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.any,
      );

      if (result != null) {
        setState(() {
          _isLoading = true;
        });

        final file = File(result.files.single.path!);

        // Use ApiClient's uploadFile method instead of manually creating a multipart request
        final response = await sl.apiClient.uploadFile(
          '/user/profile/resume',
          file,
          'resume',
        );

        if (response.statusCode == 200) {
          widget.onResumeUpdated();

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Resume updated successfully")),
          );

          // Reload the page to show the new resume
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder:
                  (context) => ResumeViewerPage(
                    resumeUrl:
                        widget
                            .resumeUrl, // This will be updated on the profile page
                    isMyProfile: widget.isMyProfile,
                    profile: widget.profile,
                    onResumeUpdated: widget.onResumeUpdated,
                  ),
            ),
          );
        } else {
          throw Exception("Failed to upload resume: ${response.statusCode}");
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to replace resume: $e')));
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text('Resume', style: TextStyle(color: Colors.white)),
        actions: [
          if (widget.isMyProfile)
            PopupMenuButton<String>(
              icon: const Icon(Icons.more_vert, color: Colors.white),
              onSelected: (value) async {
                if (value == 'download') {
                  await _downloadResume();
                } else if (value == 'replace') {
                  await _replaceResume();
                } else if (value == 'delete') {
                  // Show confirmation dialog
                  showDialog(
                    context: context,
                    builder:
                        (context) => AlertDialog(
                          title: const Text('Delete Resume'),
                          content: const Text(
                            'Are you sure you want to delete your resume?',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Cancel'),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                                _deleteResume();
                              },
                              child: const Text(
                                'Delete',
                                style: TextStyle(color: Colors.red),
                              ),
                            ),
                          ],
                        ),
                  );
                }
              },
              itemBuilder:
                  (BuildContext context) => <PopupMenuEntry<String>>[
                    const PopupMenuItem<String>(
                      value: 'download',
                      child: ListTile(
                        leading: Icon(Icons.download),
                        title: Text('Download'),
                      ),
                    ),
                    const PopupMenuItem<String>(
                      value: 'replace',
                      child: ListTile(
                        leading: Icon(Icons.upload_file),
                        title: Text('Replace'),
                      ),
                    ),
                    const PopupMenuItem<String>(
                      value: 'delete',
                      child: ListTile(
                        leading: Icon(Icons.delete, color: Colors.red),
                        title: Text(
                          'Delete',
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    ),
                  ],
            ),
          if (!widget.isMyProfile)
            IconButton(
              icon: const Icon(Icons.download, color: Colors.white),
              onPressed: _downloadResume,
            ),
        ],
      ),
      body: Stack(
        children: [
          GestureDetector(
            onTap: _toggleControls,
            child: SfPdfViewer.network(
              widget.resumeUrl,
              controller: _pdfViewerController,
              enableDoubleTapZooming: true,
              canShowScrollHead: true,
              canShowScrollStatus: true,
              pageSpacing: 8,
              onZoomLevelChanged: (PdfZoomDetails details) {
                setState(() {
                  _zoomLevel = details.newZoomLevel;
                });
              },
            ),
          ),

          // Loading indicator
          if (_isLoading) const Center(child: LoadingIndicator()),

          // Controls overlay that fades out
          if (_showControls)
            Positioned(
              bottom: 20,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                color: Colors.black.withOpacity(0.7),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.zoom_out, color: Colors.white),
                      onPressed: () {
                        _pdfViewerController.zoomLevel = _zoomLevel - 0.25;
                      },
                    ),
                    Text(
                      '${(_zoomLevel * 100).toInt()}%',
                      style: const TextStyle(color: Colors.white),
                    ),
                    IconButton(
                      icon: const Icon(Icons.zoom_in, color: Colors.white),
                      onPressed: () {
                        _pdfViewerController.zoomLevel = _zoomLevel + 0.25;
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.first_page, color: Colors.white),
                      onPressed: () {
                        _pdfViewerController.firstPage();
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.last_page, color: Colors.white),
                      onPressed: () {
                        _pdfViewerController.lastPage();
                      },
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
