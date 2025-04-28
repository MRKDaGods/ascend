import 'package:flutter/material.dart';

class FullScreenImageViewer extends StatefulWidget {
  final List<String> images;
  final int initialIndex;
  final String postId;

  const FullScreenImageViewer({
    super.key,
    required this.images,
    this.initialIndex = 0,
    required this.postId,
  });

  @override
  State<FullScreenImageViewer> createState() => _FullScreenImageViewerState();
}

class _FullScreenImageViewerState extends State<FullScreenImageViewer> {
  late int _currentIndex;
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: PageView.builder(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() => _currentIndex = index);
        },
        itemCount: widget.images.length,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Center(child: _buildImage(widget.images[index])),
          );
        },
      ),
      bottomNavigationBar:
          widget.images.length > 1
              ? Container(
                color: Colors.black,
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  '${_currentIndex + 1} / ${widget.images.length}',
                  style: const TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                ),
              )
              : null,
    );
  }

  Widget _buildImage(String imagePath) {
    print("Building image in viewer: $imagePath");
    try {
      if (imagePath.startsWith('assets/')) {
        return Image.asset(
          imagePath,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            print("Error loading image in viewer: $error");
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.broken_image, size: 64, color: Colors.white54),
                  const SizedBox(height: 16),
                  Text(
                    "Image not available",
                    style: TextStyle(color: Colors.white54),
                  ),
                ],
              ),
            );
          },
        );
      } else {
        return Image.network(
          imagePath,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            print("Error loading image in viewer: $error");
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.broken_image, size: 64, color: Colors.white54),
                  const SizedBox(height: 16),
                  Text(
                    "Image not available",
                    style: TextStyle(color: Colors.white54),
                  ),
                ],
              ),
            );
          },
        );
      }
    } catch (e) {
      print("Exception in image viewer: $e");
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.white54),
            const SizedBox(height: 16),
            Text(
              "Error loading image",
              style: TextStyle(color: Colors.white54),
            ),
          ],
        ),
      );
    }
  }
}
