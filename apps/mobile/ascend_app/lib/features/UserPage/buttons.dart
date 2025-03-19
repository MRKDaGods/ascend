import 'package:flutter/material.dart';

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
        // Check if isConnected is true, show a single full-width Message button
        if (_isConnect)
          Expanded(
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.white70),
                padding: EdgeInsets.symmetric(vertical: 8), // Reduced height
              ),
              child: Text('Message', style: TextStyle(color: Colors.white)),
            ),
          )
        else ...[
          // Connection / Pending Button
          Expanded(
            child:
                _isPending
                    ? OutlinedButton.icon(
                      icon: Icon(Icons.access_alarm, color: Colors.white),
                      onPressed: () => _withdrawRequest(context), // Show dialog

                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(color: Colors.white70),
                        padding: EdgeInsets.symmetric(
                          vertical: 8,
                        ), // Reduced height
                      ),
                      label: Text('Pending'),
                    )
                    : ElevatedButton.icon(
                      label: Text('Connect'),
                      icon: Icon(Icons.add, color: Colors.black),
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.black,
                        backgroundColor: Colors.blue,
                        padding: EdgeInsets.symmetric(
                          vertical: 8,
                        ), // Reduced height
                      ),
                      onPressed: _toggleConnect,
                    ),
          ),
          SizedBox(width: 8),
          // Message Button
          Expanded(
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.white70),
                padding: EdgeInsets.symmetric(vertical: 8), // Reduced height
              ),
              child: Text('Message', style: TextStyle(color: Colors.white)),
            ),
          ),
        ],
        SizedBox(width: 8),
        // Three-dotted menu button with same height as others
        SizedBox(
          height: 40, // Same height as buttons
          width: 40, // Keep width fixed for circle shape
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black,
              border: Border.all(color: Colors.white70),
              shape: BoxShape.circle,
            ),
            child: PopupMenuButton<String>(
              icon: Icon(Icons.more_horiz, color: Colors.white),
              color: Colors.grey[800],
              onSelected: (String value) {
                // Handle menu actions
                print("Selected: $value");
              },
              itemBuilder:
                  (BuildContext context) => <PopupMenuEntry<String>>[
                    PopupMenuItem<String>(
                      value: 'Report',
                      child: Text(
                        'Report',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                    PopupMenuItem<String>(
                      value: 'Block',
                      child: Text(
                        'Block',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                    PopupMenuItem<String>(
                      value: 'Share Profile',
                      child: Text(
                        'Share Profile',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
            ),
          ),
        ),
      ],
    );
  }
}
