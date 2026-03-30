// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'full_screen_image.dart';
import 'bottom_options_sheet.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:ascend_app/core/di/dependency_injection.dart';
import 'dart:convert';
import 'package:get/get.dart';

class ProfileMainImages extends StatelessWidget {
  const ProfileMainImages({
    super.key,
    this.profilePic = 'https://picsum.photos/150/150',
    this.coverPic = 'https://picsum.photos/1500/500',
    this.isMyProfile = false,
    this.profileImageProvider,
    this.coverImageProvider,
    this.deleteCover,
    this.deleteProfile,
    this.onProfileUpdated,
  });
  final String profilePic;
  final String coverPic;
  final bool isMyProfile;
  final ImageProvider? profileImageProvider;
  final ImageProvider? coverImageProvider;
  final void Function()? deleteCover;
  final void Function()? deleteProfile;
  final void Function()? onProfileUpdated;

  void _showFullScreenImage(
    BuildContext context,
    String imageUrl,
    bool? isProfilePic,
  ) {
    isProfilePic ??= imageUrl == profilePic;

    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => FullScreenImage(
              imageUrl: imageUrl,
              isMyProfile: isMyProfile,
              delete: isProfilePic! ? deleteProfile : deleteCover,
              onImageUpdated: onProfileUpdated,
              isProfilePic: isProfilePic,
            ),
      ),
    );
  }

  Future<void> _uploadImage(BuildContext context, bool isProfilePic) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: isProfilePic ? 500 : 1500,
      maxHeight: isProfilePic ? 500 : 500,
      imageQuality: 85,
    );

    if (image != null) {
      try {
        // Show loading indicator
        ScaffoldMessenger.of(
          Get.context!,
        ).showSnackBar(const SnackBar(content: Text("Uploading image...")));

        final String endpoint =
            isProfilePic ? "/user/profile/picture" : "/user/profile/cover";

        final File file = File(image.path);
        final String uploadContext =
            isProfilePic ? 'profile_picture' : 'cover_photo';

        // Upload file using ApiClient
        final response = await ServiceLocator().apiClient.uploadFile(
          endpoint,
          file,
          uploadContext,
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          ScaffoldMessenger.of(Get.context!).showSnackBar(
            SnackBar(
              content: Text(
                "${isProfilePic ? 'Profile picture' : 'Cover photo'} updated successfully",
              ),
            ),
          );

          // Refresh profile
          if (onProfileUpdated != null) {
            onProfileUpdated!();
          }
        } else {
          final responseData = jsonDecode(response.body);
          throw Exception(responseData['message'] ?? "Failed to upload image");
        }
      } catch (e) {
        ScaffoldMessenger.of(
          Get.context!,
        ).showSnackBar(SnackBar(content: Text("Error uploading image: $e")));
      }
    }
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
      isScrollControlled: true,
      builder: (BuildContext context) {
        return ProfileOptionsSheet(
          isImageSheet: true,
          showImage: _showFullScreenImage,
          imageUrl: imageUrl,
          imageType: isProfilePic ? 'profile' : 'cover',
          onUpload: () {
            //Navigator.pop(context);
            _uploadImage(context, isProfilePic);
          },
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
                null,
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
                  null,
                ); // Go full screen directly
              }
            },
            child: CircleAvatar(
              radius: 60,
              child: CircleAvatar(
                radius: 58,
                backgroundImage:
                    profileImageProvider ?? NetworkImage(profilePic),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
