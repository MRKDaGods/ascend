import 'package:ascend_app/features/UserPage/blue_button.dart';
import 'package:flutter/material.dart';
import 'bottom_options_sheet.dart';
import 'package:ascend_app/features/UserPage/grey_button.dart';

class ProfileButtons extends StatelessWidget {
  const ProfileButtons({
    required this.websiteExists,
    required this.isfollowing,
    required this.isPending,
    required this.toggleConnect,
    required this.withdrawRequest,
    required this.toggleFollow,
    required this.unFollowPage,
    required this.isMyProfile,
    super.key,
  });

  final bool websiteExists;
  final bool isfollowing;
  final bool isPending;
  final void Function() toggleConnect;
  final void Function() toggleFollow;
  final void Function(BuildContext) withdrawRequest; // Function to show dialog
  final void Function(BuildContext) unFollowPage; // Function to show dialog
  final bool isMyProfile;

  @override
  Widget build(BuildContext context) {
    return !isMyProfile
        ? Row(
          children: [
            if (isfollowing) ...[
              Expanded(
                child:
                    websiteExists
                        ? BlueButton(
                          text: "Visit website",
                          icon: Icons.ios_share_outlined,
                          isMyProfile: true,
                        )
                        : BlueButton(
                          text: "Message",
                          icon: Icons.send,
                          isMyProfile: true,
                        ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: GreyButton(
                  text: "Following",
                  icon: Icons.check,
                  action: unFollowPage,
                  isMyProfile: true,
                ),
              ),
            ] else ...[
              Expanded(
                child: BlueButton(
                  text: "Follow",
                  action: toggleFollow,
                  icon: Icons.add,
                  isMyProfile: true,
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child:
                    websiteExists
                        ? GreyButton(
                          text: "Visit website",
                          action: withdrawRequest,
                          icon: Icons.ios_share_outlined,
                          isMyProfile: true,
                        )
                        : GreyButton(
                          text: "Message",
                          action: withdrawRequest,
                          icon: Icons.send,
                          isMyProfile: true,
                        ),
              ),
            ],
            SizedBox(width: 8),
            SizedBox(
              height: 40,
              width: 40,
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: Icon(Icons.more_horiz),
                  onPressed:
                      () => _showProfileOptionsSheet(
                        context,
                        websiteExists,
                        isfollowing,
                        isPending,
                        toggleConnect,
                        toggleFollow,
                        withdrawRequest,
                        unFollowPage,
                      ), // Show Bottom Sheet
                ),
              ),
            ),
          ],
        )
        : Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: BlueButton(text: "Open to", isMyProfile: isMyProfile),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: GreyButton(
                    text: "Add Section",
                    action: (context) {},
                    isMyProfile: isMyProfile,
                  ),
                ),
                SizedBox(width: 8),
                SizedBox(
                  height: 38,
                  width: 38,
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border.all(),
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.more_horiz), // Smaller icon
                      padding: EdgeInsets.zero, // Removes internal padding
                      onPressed:
                          () => _showProfileOptionsSheet(
                            context,
                            websiteExists,
                            isfollowing,
                            isPending,
                            toggleConnect,
                            toggleFollow,
                            withdrawRequest,
                            unFollowPage,
                          ),
                    ),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Expanded(
                  child: GreyButton(
                    text: "Enhance Profile",
                    action: (context) {},
                    isMyProfile: isMyProfile,
                  ),
                ),
              ],
            ),
          ],
        );
  }

  void _showProfileOptionsSheet(
    BuildContext context,
    bool isConnect,
    bool isfollowing,
    bool isPending,
    void Function() toggleConnect,
    void Function() toggleFollow,
    void Function(BuildContext) withdrawRequest,
    void Function(BuildContext) removeConnectionAlert,
  ) {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      isScrollControlled: true, // Allows the sheet to expand properly
      builder: (BuildContext context) {
        return ProfileOptionsSheet(
          isConnect: isConnect,
          isfollowing: isfollowing,
          isPending: isPending,
          toggleConnect: toggleConnect,
          toggleFollow: toggleFollow,
          withdrawRequest: withdrawRequest,
          removeConnection: removeConnectionAlert,
          isMyProfile: isMyProfile,
          isImageSheet: false, // Not an image sheet
        );
      },
    );
  }
}
