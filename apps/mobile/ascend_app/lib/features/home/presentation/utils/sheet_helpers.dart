import 'package:ascend_app/features/home/presentation/utils/post_options_sheet.dart';
import 'package:flutter/material.dart';


class SheetHelpers {
  static Future<void> showPostOptionsSheet({
    required BuildContext context,
    required String ownerName,
    VoidCallback? onSave,
    VoidCallback? onShare,
    VoidCallback? onNotInterested,
    VoidCallback? onUnfollow,
    VoidCallback? onReport,
    VoidCallback? onMessage, // Add this parameter
    bool showSave = true,
    bool showShare = true,
    bool showNotInterested = true,
    bool showUnfollow = true,
    bool showReport = true,
    bool showMessage = false, // Default to false
    String reportText = 'Report post',
  }) async {
    return showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (BuildContext context) {
        return PostOptionsSheet(
          ownerName: ownerName,
          onSave: onSave,
          onShare: onShare,
          onNotInterested: onNotInterested,
          onUnfollow: onUnfollow,
          onReport: onReport,
          onMessage: onMessage, // Pass this parameter
          showSave: showSave,
          showShare: showShare,
          showNotInterested: showNotInterested,
          showUnfollow: showUnfollow,
          showReport: showReport,
          showMessage: showMessage, // Pass this parameter
          reportText: reportText,
        );
      },
    );
  }
}