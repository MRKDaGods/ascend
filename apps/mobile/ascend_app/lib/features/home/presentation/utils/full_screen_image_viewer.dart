import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';

class FullScreenImageViewer extends StatefulWidget {
  final List<String> images;
  final int initialIndex;

  const FullScreenImageViewer({
    super.key,
    required this.images,
    this.initialIndex = 0,
  });

  @override
  State<FullScreenImageViewer> createState() => _FullScreenImageViewerState();
}

class _FullScreenImageViewerState extends State<FullScreenImageViewer> {
  late PageController _pageController;
  late int _currentIndex;
  
  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
    
    // Debug print to check image paths
    print("FullScreenImageViewer images: ${widget.images}");
    print("Initial index: ${widget.initialIndex}");
    
    // Set system overlay to be transparent for immersive viewing
    SystemChrome.setEnabledSystemUIMode(
      SystemUiMode.immersiveSticky,
    );
  }
  
  @override
  void dispose() {
    // Restore normal UI mode when leaving the viewer
    SystemChrome.setEnabledSystemUIMode(
      SystemUiMode.edgeToEdge,
    );
    _pageController.dispose();
    super.dispose();
  }

  // Helper method to determine if the image is from network or asset
  ImageProvider _getImageProvider(String imagePath) {
    print("Getting image provider for: $imagePath");
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return NetworkImage(imagePath);
    } else {
      return AssetImage(imagePath);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: widget.images.length > 1 
            ? Text("${_currentIndex + 1}/${widget.images.length}") 
            : const Text("Image Viewer"),
      ),
      body: PhotoViewGallery.builder(
        scrollPhysics: const BouncingScrollPhysics(),
        builder: (BuildContext context, int index) {
          String imagePath = widget.images[index];
          print("Building photo view for image at index $index: $imagePath");
          
          return PhotoViewGalleryPageOptions(
            imageProvider: _getImageProvider(imagePath),
            initialScale: PhotoViewComputedScale.contained,
            minScale: PhotoViewComputedScale.contained * 0.8,
            maxScale: PhotoViewComputedScale.covered * 2.0,
            errorBuilder: (context, error, stackTrace) {
              print("Error loading fullscreen image: $error");
              return Container(
                color: Colors.grey[900],
                child: const Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.broken_image, color: Colors.white70, size: 48),
                      SizedBox(height: 8),
                      Text(
                        "Failed to load image",
                        style: TextStyle(color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
        itemCount: widget.images.length,
        backgroundDecoration: const BoxDecoration(color: Colors.black),
        pageController: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}