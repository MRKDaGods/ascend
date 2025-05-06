// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import 'package:ascend_app/core/di/dependency_injection.dart';
import 'dart:convert';

class AddFeaturedPage extends StatefulWidget {
  final Function(String) onSave;

  const AddFeaturedPage({super.key, required this.onSave});

  @override
  State<AddFeaturedPage> createState() => _AddFeaturedPageState();
}

class _AddFeaturedPageState extends State<AddFeaturedPage> {
  File? _selectedFile;
  bool _isUploading = false;
  String? _errorMessage;

  Future<void> _pickFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.any,
        //allowedExtensions: ['pdf'],
      );

      if (result != null) {
        setState(() {
          _selectedFile = File(result.files.single.path!);
          _errorMessage = null;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Error selecting file: $e";
      });
    }
  }

  Future<void> _uploadResume() async {
    if (_selectedFile == null) {
      setState(() {
        _errorMessage = "Please select a file first";
      });
      return;
    }

    setState(() {
      _isUploading = true;
      _errorMessage = null;
    });

    try {
      // Upload resume using ApiClient
      final response = await ServiceLocator().apiClient.uploadFile(
        "/user/profile/resume",
        _selectedFile!,
        'resume',
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Parse response
        final responseData = jsonDecode(response.body);
        final resumeUrl = responseData['resume_url'];

        if (resumeUrl != null) {
          // Call onSave with the new resume URL
          widget.onSave(resumeUrl);

          // Show success message
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Resume uploaded successfully")),
          );

          // Go back to previous screen
          Navigator.pop(context);
        } else {
          throw Exception("Resume URL not found in response");
        }
      } else {
        final responseData = jsonDecode(response.body);
        throw Exception(responseData['message'] ?? "Failed to upload resume");
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Error uploading resume: $e";
      });
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Resume')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Upload your resume',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Supported file types: PDF, DOC, DOCX',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: Colors.grey[600]),
            ),
            const SizedBox(height: 24),

            // File selection button
            Center(
              child: ElevatedButton.icon(
                onPressed: _pickFile,
                icon: const Icon(Icons.upload_file),
                label: const Text('Select File'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
              ),
            ),

            // Selected file info
            if (_selectedFile != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: ListTile(
                  leading: const Icon(Icons.description),
                  title: Text(_selectedFile!.path.split('/').last),
                  subtitle: Text(
                    '${(_selectedFile!.lengthSync() / 1024).toStringAsFixed(2)} KB',
                  ),
                  tileColor: Colors.grey[200],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),

            // Error message
            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(top: 16.0),
                child: Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              ),

            const Spacer(),

            // Upload button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isUploading ? null : _uploadResume,
                child:
                    _isUploading
                        ? const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                            SizedBox(width: 12),
                            Text('Uploading...'),
                          ],
                        )
                        : const Text('Upload Resume'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
