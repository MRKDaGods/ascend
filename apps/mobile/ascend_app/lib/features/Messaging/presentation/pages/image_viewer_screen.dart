import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ImageViewerScreen extends StatefulWidget {
  final String imageUrl;

  const ImageViewerScreen({required this.imageUrl, super.key});

  @override
  State<ImageViewerScreen> createState() => _ImageViewerScreenState();
}

class _ImageViewerScreenState extends State<ImageViewerScreen>
    with SingleTickerProviderStateMixin {
  late TransformationController _transformationController;
  late AnimationController _animationController;
  Animation<Matrix4>? _animation;
  final double _minScale = 0.5;
  final double _maxScale = 4.0;
  bool _isLoading = true; // Start with loading state

  @override
  void initState() {
    super.initState();
    _transformationController = TransformationController();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    )..addListener(() {
      if (_animation != null) {
        _transformationController.value = _animation!.value;
      }
    });

    debugPrint('ImageViewerScreen: Loading image from URL: ${widget.imageUrl}');
  }

  // Add this method to update loading state
  void _setLoading(bool loading) {
    if (_isLoading != loading) {
      setState(() {
        _isLoading = loading;
      });
    }
  }

  @override
  void dispose() {
    _transformationController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  // Reset to initial scale when double tap
  void _handleDoubleTap() {
    if (_transformationController.value != Matrix4.identity()) {
      // Reset to identity (original size)
      _resetAnimation();
    } else {
      // Zoom in to 2x on double tap
      final position =
          _transformationController.value.clone()..scale(2.0, 2.0, 2.0);

      _animateMatrix(position);
    }
  }

  void _resetAnimation() {
    _animation = Matrix4Tween(
      begin: _transformationController.value,
      end: Matrix4.identity(),
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
    _animationController.forward(from: 0);
  }

  void _animateMatrix(Matrix4 end) {
    _animation = Matrix4Tween(
      begin: _transformationController.value,
      end: end,
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
    _animationController.forward(from: 0);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarBrightness: Brightness.dark,
          statusBarIconBrightness: Brightness.light,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Stack(
          children: [
            // Image
            Center(
              child: GestureDetector(
                onDoubleTap: _handleDoubleTap,
                child: InteractiveViewer(
                  transformationController: _transformationController,
                  minScale: _minScale,
                  maxScale: _maxScale,
                  child: Image.network(
                    widget.imageUrl,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) {
                        WidgetsBinding.instance.addPostFrameCallback((_) {
                          _setLoading(false);
                        });
                        return child;
                      }
                      return Center(
                        child: CircularProgressIndicator(
                          value:
                              loadingProgress.expectedTotalBytes != null
                                  ? loadingProgress.cumulativeBytesLoaded /
                                      loadingProgress.expectedTotalBytes!
                                  : null,
                          color: Colors.white,
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      // FIXED: Schedule setState for the next frame
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        _setLoading(false);
                      });
                      debugPrint('Error loading image: $error');
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.error_outline,
                              color: Colors.red,
                              size: 60,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Image failed to load\nError: $error',
                              textAlign: TextAlign.center,
                              style: const TextStyle(color: Colors.white70),
                            ),
                            const SizedBox(height: 24),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Go Back'),
                            ),
                          ],
                        ),
                      );
                    },
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ),

            // Loading indicator
            if (_isLoading)
              const Center(
                child: CircularProgressIndicator(color: Colors.white),
              ),
          ],
        ),
      ),
    );
  }
}
