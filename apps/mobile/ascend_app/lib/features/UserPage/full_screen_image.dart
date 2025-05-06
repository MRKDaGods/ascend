import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:ascend_app/core/di/dependency_injection.dart';
import 'dart:convert';

class FullScreenImage extends StatefulWidget {
  final String imageUrl;
  final bool isMyProfile;
  final void Function()? delete;
  final void Function()? onImageUpdated;
  final bool isProfilePic;

  const FullScreenImage({
    super.key,
    required this.imageUrl,
    required this.isMyProfile,
    this.delete,
    this.onImageUpdated,
    this.isProfilePic = true,
  });

  @override
  State<FullScreenImage> createState() => _FullScreenImageState();
}

class _FullScreenImageState extends State<FullScreenImage> {
  bool _isUploading = false;
  String? _errorMessage;

  Future<void> _pickAndUploadImage({bool fromCamera = false}) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(
      source: fromCamera ? ImageSource.camera : ImageSource.gallery,
      maxWidth: widget.isProfilePic ? 500 : 1500,
      maxHeight: widget.isProfilePic ? 500 : 500,
      imageQuality: 85,
    );

    if (image != null) {
      await _uploadImage(File(image.path));
    }
  }

  Future<void> _uploadImage(File file) async {
    setState(() {
      _isUploading = true;
      _errorMessage = null;
    });

    try {
      // Show loading indicator
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Uploading image...")));

      final String endpoint =
          widget.isProfilePic ? "/user/profile/picture" : "/user/profile/cover";

      final String uploadContext =
          widget.isProfilePic ? 'profile_picture' : 'cover_photo';

      // Upload file using ApiClient
      final response = await ServiceLocator().apiClient.uploadFile(
        endpoint,
        file,
        uploadContext,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              "${widget.isProfilePic ? 'Profile picture' : 'Cover photo'} updated successfully",
            ),
          ),
        );

        // Notify parent widget
        if (widget.onImageUpdated != null) {
          widget.onImageUpdated!();
        }

        // Return to previous screen
        Navigator.pop(context);
      } else {
        final responseData = jsonDecode(response.body);
        throw Exception(responseData['message'] ?? "Failed to upload image");
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Error uploading image: $e";
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error uploading image: $e")));
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  void _showImagePickerModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.black87,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library, color: Colors.white),
                title: const Text(
                  'Choose from Gallery',
                  style: TextStyle(color: Colors.white),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _pickAndUploadImage(fromCamera: false);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_camera, color: Colors.white),
                title: const Text(
                  'Take a Photo',
                  style: TextStyle(color: Colors.white),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _pickAndUploadImage(fromCamera: true);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Full-screen image
          GestureDetector(
            onTap: () {
              Navigator.pop(context);
            },
            child: Center(
              child: InteractiveViewer(
                // Allows pinch-to-zoom
                child: Image.network(widget.imageUrl),
              ),
            ),
          ),

          // Upload progress indicator
          if (_isUploading)
            const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),

          // Error message
          if (_errorMessage != null)
            Positioned(
              top: 50,
              left: 0,
              right: 0,
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                ),
              ),
            ),

          // Bottom options
          if (widget.isMyProfile)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                color: Colors.black, // Semi-transparent background
                padding: const EdgeInsets.symmetric(
                  vertical: 10,
                  horizontal: 20,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Visibility option
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        const Icon(Icons.visibility, color: Colors.white),
                        const SizedBox(width: 8),
                        const Text(
                          "Anyone",
                          style: TextStyle(color: Colors.white, fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    // Action buttons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildOptionButton(
                          context,
                          icon: Icons.edit_outlined,
                          label: "Edit",
                          onTap: () {
                            _showImagePickerModal();
                          },
                        ),
                        _buildOptionButton(
                          context,
                          icon: Icons.photo_camera,
                          label: "Add photo",
                          onTap: () {
                            _pickAndUploadImage(fromCamera: true);
                          },
                        ),
                        _buildOptionButton(
                          context,
                          icon: Icons.image,
                          label: "Frames",
                          onTap: () {
                            // Add frame functionality here
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text("Frame feature coming soon"),
                              ),
                            );
                          },
                        ),
                        _buildOptionButton(
                          context,
                          icon: Icons.delete,
                          label: "Delete",
                          onTap: () {
                            if (widget.delete != null) {
                              widget.delete!();
                            }
                            Navigator.pop(context);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildOptionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 28),
          const SizedBox(height: 5),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 14),
          ),
        ],
      ),
    );
  }
}
