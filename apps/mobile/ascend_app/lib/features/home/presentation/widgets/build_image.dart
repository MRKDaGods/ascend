import 'package:flutter/material.dart';

class PostImage extends StatelessWidget {
  final String image;
  final double height;

  const PostImage({
    super.key,
    required this.image,
    required this.height,
  });

  @override
  Widget build(BuildContext context) {
    print("PostImage building: $image");
    
    Widget imageWidget;
    
    if (image.startsWith('http://') || image.startsWith('https://')) {
      // Network image
      imageWidget = Image.network(
        image,
        fit: BoxFit.cover,
        height: height,
        width: double.infinity,
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Container(
            height: height,
            color: Colors.grey[200],
            child: Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded / 
                      loadingProgress.expectedTotalBytes!
                    : null,
              ),
            ),
          );
        },
        errorBuilder: (context, error, stackTrace) {
          print("Error loading network image: $error");
          return Container(
            height: height,
            color: Colors.grey[300],
            child: const Center(child: Text('Image not available')),
          );
        },
      );
    } else {
      // Asset image
      imageWidget = Image.asset(
        image,
        fit: BoxFit.cover,
        height: height,
        width: double.infinity,
        errorBuilder: (context, error, stackTrace) {
          print("Error loading asset image: $error");
          return Container(
            height: height,
            color: Colors.grey[300],
            child: const Center(child: Text('Image not available')),
          );
        },
      );
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(8.0),
      child: imageWidget,
    );
  }
}