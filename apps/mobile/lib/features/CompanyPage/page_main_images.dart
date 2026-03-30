import 'package:flutter/material.dart';

class ProfileMainImages extends StatelessWidget {
  const ProfileMainImages({
    super.key,
    this.profilePic = 'assets/company_placeholder.png',
    this.coverPic = 'assets/company_placeholder.png',
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

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.bottomLeft,
      children: [
        GestureDetector(
          onTap: () {},
          child: Container(
            height: 100,
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
            onTap: () {},
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
