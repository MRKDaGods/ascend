import 'package:flutter/material.dart';

class PostImage extends StatelessWidget {
  const PostImage({
    super.key,
    required this.image,
    required this.height,
  });

  final String image;
  final double height;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        image: DecorationImage(
          image:
              image.startsWith("http")
                  ? NetworkImage(image)
                  : AssetImage(image) as ImageProvider,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}