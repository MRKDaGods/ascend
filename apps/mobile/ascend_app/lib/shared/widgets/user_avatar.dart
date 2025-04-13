import 'package:flutter/material.dart';

class UserAvatar extends StatelessWidget {
  final String? imageUrl;
  final double radius;
  final String defaultAsset;

  const UserAvatar({
    Key? key,
    this.imageUrl,
    this.radius = 16.0,
    this.defaultAsset = 'assets/logo.jpg',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool hasValidImage = imageUrl != null && imageUrl!.isNotEmpty;

    return CircleAvatar(
      radius: radius,
      backgroundImage: hasValidImage
          ? NetworkImage(imageUrl!, 
              headers: const {
                // Add any headers if needed for your API
              })
          : AssetImage(defaultAsset) as ImageProvider,
      onBackgroundImageError: hasValidImage 
          ? (exception, stackTrace) {
              // You can log the error here if needed
            } 
          : null,
    );
  }
}