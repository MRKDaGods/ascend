import 'package:ascend_app/features/UserPage/blue_button.dart';
import 'package:flutter/material.dart';
import 'bottom_options_sheet.dart';
import 'grey_button.dart';

class ProfileButtons extends StatelessWidget {
  const ProfileButtons(
    this._isConnect,
    this._isPending,
    this._toggleConnect,
    this._withdrawRequest, { // Function to handle withdraw action
    super.key,
  });

  final bool _isConnect;
  final bool _isPending;
  final void Function() _toggleConnect;
  final void Function(BuildContext) _withdrawRequest; // Function to show dialog

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        if (_isConnect)
          Expanded(child: BlueButton(text: "Message", icon: Icons.send))
        else ...[
          Expanded(
            child:
                _isPending
                    ? GreyButton(
                      text: "Pending",
                      action: _withdrawRequest,
                      icon: Icons.access_time,
                    )
                    : BlueButton(
                      text: "Connect",
                      action: _toggleConnect,
                      icon: Icons.person_add,
                    ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: GreyButton(
              text: "Message",
              action: (context) {},
              icon: Icons.send,
            ),
          ),
        ],
        SizedBox(width: 8),
        SizedBox(
          height: 40,
          width: 40,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.grey[900],
              border: Border.all(color: Colors.white70),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: Icon(Icons.more_horiz, color: Colors.white),
              onPressed:
                  () => _showProfileOptionsSheet(context), // Show Bottom Sheet
            ),
          ),
        ),
      ],
    );
  }

  void _showProfileOptionsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.grey[900],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      isScrollControlled: true, // Allows the sheet to expand properly
      builder: (BuildContext context) {
        return ProfileOptionsSheet();
      },
    );
  }
}
