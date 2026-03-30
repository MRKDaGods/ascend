import 'package:flutter/material.dart';
import 'post_options_sheet.dart'; // Ensure this import is correct

class SheetHelpers {
  static Future<dynamic> showPostOptionsSheet({
    required BuildContext context,
    required String ownerName,
    VoidCallback? onSave,
    VoidCallback? onUnsave, // Add onUnsave
    VoidCallback? onShare,
    VoidCallback? onNotInterested,
    VoidCallback? onUnfollow,
    VoidCallback? onReport,
    VoidCallback? onMessage,
    bool showSave = true,
    bool showUnsave = false, // Add showUnsave
    bool showShare = true,
    bool showNotInterested = true,
    bool showUnfollow = true,
    bool showReport = true,
    bool showMessage = false,
    String reportText = 'Report post',
  }) async {
    // Debug print the flags being received
    debugPrint("[SheetHelpers] showPostOptionsSheet called. showSave: $showSave, showUnsave: $showUnsave");

    return showModalBottomSheet(
      context: context,
      isScrollControlled: true, // Allows sheet to take up more height if needed
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (BuildContext context) {
        return PostOptionsSheet(
          ownerName: ownerName,
          onSave: onSave,
          onUnsave: onUnsave, // Pass onUnsave
          onShare: onShare,
          onNotInterested: onNotInterested,
          onUnfollow: onUnfollow,
          onReport: onReport,
          onMessage: onMessage,
          showSave: showSave,
          showUnsave: showUnsave, // Pass showUnsave
          showShare: showShare,
          showNotInterested: showNotInterested,
          showUnfollow: showUnfollow,
          showReport: showReport,
          showMessage: showMessage,
          reportText: reportText,
        );
      },
    );
  }

  // ... other sheet helper methods ...
}