import 'package:flutter/material.dart';
import 'full_screen_image.dart';
import 'bottom_options_sheet.dart';

class ProfileMainImages extends StatelessWidget {
  ProfileMainImages({
    super.key,
    this.profilePic = 'https://picsum.photos/150/150',
    this.coverPic = 'https://picsum.photos/1500/500',
    this.isMyProfile = false,
    this.profileImageProvider,
    this.coverImageProvider,
  });
  final String profilePic;
  final String coverPic;
  final bool isMyProfile;
  final ImageProvider?
  profileImageProvider; //= AssetImage('assets/company_placeholder.png',); // Add this for testing
  final ImageProvider? coverImageProvider; //= AssetImage(
  //   'assets/company_placeholder.png',
  // ); // Add this for testing

  void _showFullScreenImage(BuildContext context, String imageUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) =>
                FullScreenImage(imageUrl: imageUrl, isMyProfile: isMyProfile),
      ),
    );
  }

  void _showOptionsSheet(
    BuildContext context,
    String imageUrl,
    bool isProfilePic,
  ) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      isScrollControlled: true, // Allows the sheet to expand properly
      builder: (BuildContext context) {
        return ProfileOptionsSheet(
          isImageSheet: true,
          showImage: _showFullScreenImage, // Go full screen
          imageUrl: imageUrl,
          imageType: isProfilePic ? 'profile' : 'cover',
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.bottomLeft,
      children: [
        GestureDetector(
          onTap: () {
            if (isMyProfile) {
              _showOptionsSheet(
                context,
                coverPic,
                false,
              ); // Show options for cover pic
            } else {
              _showFullScreenImage(
                context,
                coverPic,
              ); // Go full screen directly
            }
          },
          child: Container(
            height: 120,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: coverImageProvider ?? NetworkImage(coverPic),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
        Positioned(
          left: 20,
          bottom: -40,
          child: GestureDetector(
            onTap: () {
              if (isMyProfile) {
                _showOptionsSheet(
                  context,
                  profilePic,
                  true,
                ); // Show options for profile pic
              } else {
                _showFullScreenImage(
                  context,
                  profilePic,
                ); // Go full screen directly
              }
            },
            child: Container(
              width: 80, // Width of the square
              height: 80, // Height of the square
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(0), // Rounded corners
                image: DecorationImage(
                  image: profileImageProvider ?? NetworkImage(profilePic),
                  fit: BoxFit.cover,
                ),
                border: Border.all(
                  color: Colors.white, // Border color
                  width: 2, // Border width
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
