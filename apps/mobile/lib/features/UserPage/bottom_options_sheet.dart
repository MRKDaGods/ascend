import 'package:ascend_app/features/UserPage/contact_info_section.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class ProfileOptionsSheet extends StatelessWidget {
  const ProfileOptionsSheet({
    this.isMyProfile = false,
    this.isConnect,
    this.isfollowing,
    this.isPending,
    this.toggleConnect,
    this.withdrawRequest,
    this.toggleFollow,
    this.removeConnection,
    this.isImageSheet = false,
    this.showImage,
    this.imageUrl,
    this.imageType,
    this.profile, // Pass the profile object
    this.onUpload,
    super.key,
  });

  final bool? isConnect;
  final bool? isImageSheet;
  final bool? isfollowing;
  final bool? isPending;
  final bool? isMyProfile;
  final void Function()? toggleConnect;
  final void Function()? toggleFollow;
  final void Function(BuildContext)? withdrawRequest;
  final void Function(BuildContext)? removeConnection;
  final void Function(BuildContext, String, bool)? showImage;
  final String? imageType; // 'profile' or 'cover'
  final String? imageUrl;
  final Profile? profile; // Profile object to fetch data
  final VoidCallback? onUpload;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Custom Drag Handle
        Stack(
          children: [
            SizedBox(width: double.infinity, height: 35),

            SizedBox(
              width: double.infinity, // Full width background
              height: 35, // Slightly taller to match reference
              // Slightly darker background
            ),

            Center(
              child: Container(
                width: 54,
                height: 7,
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: BorderRadius.circular(3),
                ),
                margin: const EdgeInsets.symmetric(vertical: 10),
              ),
            ),
          ],
        ),

        // Main content with padding
        Padding(
          padding: const EdgeInsets.only(bottom: 16, left: 16, right: 16),
          child: Wrap(
            children:
                isImageSheet == true
                    ? [
                      _buildSheetOption(
                        context,
                        Icons.photo_camera,
                        'View or edit $imageType photo',
                        showImage,
                        imageUrl: imageUrl,
                      ),
                      _buildSheetOption(
                        context,
                        Icons.image_outlined,
                        'Edit frame',
                        null,
                      ),
                      if (onUpload != null)
                        _buildSheetOption(
                          context,
                          Icons.upload_outlined,
                          'Upload new $imageType image',
                          onUpload,
                        ),
                    ]
                    : [
                      _buildSheetOption(
                        context,
                        Icons.send,
                        "Send profile in a message",
                        null,
                      ),
                      _buildSheetOption(
                        context,
                        Icons.share,
                        "Share via...",
                        null,
                      ),
                      _buildSheetOption(
                        context,
                        Icons.perm_contact_calendar,
                        "Contact info",
                        () => {
                          // Display bottom sheet with contact info
                          showModalBottomSheet(
                            context: context,
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.vertical(
                                top: Radius.circular(12),
                              ),
                            ),
                            isScrollControlled: true,
                            builder: (BuildContext context) {
                              return ContactInfoSection(
                                profile: profile!,
                                isMyProfile: isMyProfile ?? false,
                              );
                            },
                          ),
                        },
                      ),
                      if (isMyProfile!) ...[
                        _buildSheetOption(
                          context,
                          Icons.newspaper,
                          "Activity",
                          null,
                        ),
                        _buildSheetOption(
                          context,
                          Icons.bookmark,
                          "Saved Items",
                          null,
                        ),
                      ],
                      if (!isMyProfile!) ...[
                        if (isConnect!) ...[
                          _buildSheetOption(
                            context,
                            Icons.request_page,
                            "Request a recommendation",
                            null,
                          ),
                          _buildSheetOption(
                            context,
                            Icons.thumb_up,
                            "Recommend",
                            null,
                          ),
                        ],
                        isfollowing!
                            ? _buildSheetOption(
                              context,
                              Icons.remove,
                              "Unfollow",
                              toggleFollow,
                            )
                            : _buildSheetOption(
                              context,
                              Icons.add,
                              "Follow",
                              toggleFollow,
                            ),
                        isConnect!
                            ? _buildSheetOption(
                              context,
                              Icons.person_off,
                              "Remove connection",
                              removeConnection,
                            )
                            : isPending!
                            ? _buildSheetOption(
                              context,
                              Icons.access_time,
                              "Pending",
                              withdrawRequest,
                            )
                            : _buildSheetOption(
                              context,
                              Icons.person_add,
                              "Connect",
                              toggleConnect,
                            ),
                        _buildSheetOption(
                          context,
                          Icons.edit_square,
                          "Personalize invite",
                          toggleConnect,
                        ),
                        _buildSheetOption(
                          context,
                          Icons.flag,
                          "Report or block",
                          null,
                        ),
                      ],
                      _buildSheetOption(
                        context,
                        Icons.info,
                        "About this profile",
                        () => _showAboutProfileDialog(context),
                      ),
                    ],
          ),
        ),
      ],
    );
  }

  Widget _buildSheetOption(
    BuildContext context,
    IconData icon,
    String text,
    dynamic onTap, {
    String? imageUrl,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(text),
      onTap: () {
        Navigator.pop(context);
        if (onTap != null) {
          if (onTap is Function(BuildContext)) {
            onTap(context);
          } else if (onTap is Function(BuildContext, String, bool)) {
            onTap(context, imageUrl!, imageType == 'profile');
          } else if (onTap is Function(BuildContext, IconData)) {
            onTap(context, icon);
          } else {
            onTap();
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("This feature is not available yet")),
          );
        }
      },
    );
  }

  void _showAboutProfileDialog(BuildContext context) {
    if (profile == null) {
      debugPrint("profile is null");
      return;
    }
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      isScrollControlled: true, // Allows the sheet to expand properly
      builder: (BuildContext context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Custom Drag Handle
            Stack(
              children: [
                SizedBox(width: double.infinity, height: 35),
                Center(
                  child: Container(
                    width: 54,
                    height: 7,
                    decoration: BoxDecoration(
                      color: Colors.grey[400],
                      borderRadius: BorderRadius.circular(3),
                    ),
                    margin: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ],
            ),

            // Main content with padding
            Padding(
              padding: const EdgeInsets.only(bottom: 16, left: 16, right: 16),
              child: Wrap(
                children: [
                  Row(
                    children: [
                      Text(
                        "${profile!.firstName} ${profile!.lastName}",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(width: 8),
                      profile!.namePronunciation != null
                          ? Icon(Icons.volume_up, size: 20)
                          : const SizedBox(width: 2),
                    ],
                  ),
                  const SizedBox(height: 20),
                  _buildInfoRow(
                    "Joined",
                    profile!.createdAt != null
                        ? "${profile!.createdAt!.month} ${profile!.createdAt!.year}"
                        : "N/A",
                  ),
                  _buildInfoRow(
                    "Contact information",
                    profile!.contactInfo?.updatedAt != null
                        ? "Updated over ${_calculateTimeAgo(profile!.contactInfo!.updatedAt!)}"
                        : "N/A",
                  ),
                  _buildInfoRow(
                    "Profile photo",
                    profile!.profilePictureUrl != null
                        ? "Updated over ${_calculateTimeAgo(profile!.updatedAt!)}"
                        : "N/A",
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [Text(value, style: const TextStyle(color: Colors.grey))],
          ),
        ],
      ),
    );
  }

  String _calculateTimeAgo(DateTime date) {
    final Duration difference = DateTime.now().difference(date);
    if (difference.inDays >= 365) {
      return "${difference.inDays ~/ 365} year(s) ago";
    } else if (difference.inDays >= 30) {
      return "${difference.inDays ~/ 30} month(s) ago";
    } else if (difference.inDays >= 1) {
      return "${difference.inDays} day(s) ago";
    } else {
      return "less than a day ago";
    }
  }
}
