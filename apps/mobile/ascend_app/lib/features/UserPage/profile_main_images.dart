import 'package:flutter/material.dart';
import 'full_screen_image.dart';

class ProfileMainImages extends StatelessWidget {
  const ProfileMainImages({
    super.key,
    this.profilePic = 'https://picsum.photos/150/150',
    this.coverPic = 'https://picsum.photos/1500/500',
  });
  final String profilePic;
  final String coverPic;
  void _showFullScreenImage(BuildContext context, String imageUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FullScreenImage(imageUrl: imageUrl),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.bottomLeft,
      children: [
        GestureDetector(
          onTap: () => _showFullScreenImage(context, coverPic),
          child: Container(
            height: 120,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(coverPic),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
        Positioned(
          left: 20,
          bottom: -40,
          child: GestureDetector(
            onTap: () => _showFullScreenImage(context, profilePic),
            child: CircleAvatar(
              radius: 60,
              backgroundColor: Colors.black,
              child: CircleAvatar(
                radius: 58,
                backgroundImage: NetworkImage(profilePic),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
