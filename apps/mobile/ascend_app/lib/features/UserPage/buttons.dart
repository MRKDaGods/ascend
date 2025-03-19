import 'package:flutter/material.dart';
import 'bottom_options_sheet.dart';

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
          Expanded(
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.white70),
                padding: EdgeInsets.symmetric(vertical: 8),
              ),
              child: Text('Message', style: TextStyle(color: Colors.white)),
            ),
          )
        else ...[
          Expanded(
            child:
                _isPending
                    ? OutlinedButton.icon(
                      icon: Icon(Icons.access_time, color: Colors.white),
                      onPressed: () => _withdrawRequest(context),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(color: Colors.white70),
                        padding: EdgeInsets.symmetric(vertical: 8),
                      ),
                      label: Text('Pending'),
                    )
                    : ElevatedButton.icon(
                      label: Text('Connect'),
                      icon: Icon(Icons.add, color: Colors.black),
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.black,
                        backgroundColor: Colors.blue,
                        padding: EdgeInsets.symmetric(vertical: 8),
                      ),
                      onPressed: _toggleConnect,
                    ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.white70),
                padding: EdgeInsets.symmetric(vertical: 8),
              ),
              child: Text('Message', style: TextStyle(color: Colors.white)),
            ),
          ),
        ],
        SizedBox(width: 8),
        SizedBox(
          height: 40,
          width: 40,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black,
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
