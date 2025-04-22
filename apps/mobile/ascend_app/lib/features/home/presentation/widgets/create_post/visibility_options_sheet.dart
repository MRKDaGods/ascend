import 'package:flutter/material.dart';

class VisibilityOptionsSheet extends StatefulWidget {
  final String initialSelectedVisibility;
  final String initialCommentControl;
  final bool initialBrandPartnership;
  final ValueChanged<String> onVisibilityChanged;
  final VoidCallback onCommentControlTap;
  final ValueChanged<bool> onBrandPartnershipChanged;

  const VisibilityOptionsSheet({
    super.key,
    required this.initialSelectedVisibility,
    required this.initialCommentControl,
    required this.initialBrandPartnership,
    required this.onVisibilityChanged,
    required this.onCommentControlTap,
    required this.onBrandPartnershipChanged,
  });

  @override
  State<VisibilityOptionsSheet> createState() => _VisibilityOptionsSheetState();
}

class _VisibilityOptionsSheetState extends State<VisibilityOptionsSheet> {
  late String _selectedVisibility;
  late bool _brandPartnership;

  @override
  void initState() {
    super.initState();
    _selectedVisibility = widget.initialSelectedVisibility;
    _brandPartnership = widget.initialBrandPartnership;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Wrap(
        children: <Widget>[
          Center(
            child: Container(
              width: 40,
              height: 5,
              margin: const EdgeInsets.symmetric(vertical: 8.0),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0),
            child: Text(
              'Who can see your post?',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          RadioListTile<String>(
            secondary: const Icon(Icons.public),
            title: const Text('Anyone'),
            subtitle: const Text('Anyone on or off LinkedIn'),
            value: 'Anyone',
            groupValue: _selectedVisibility,
            onChanged: (String? value) {
              if (value != null) {
                widget.onVisibilityChanged(value);
                Navigator.pop(context);
              }
            },
            activeColor: Colors.green,
          ),
          RadioListTile<String>(
            secondary: const Icon(Icons.people_outline),
            title: const Text('Connections only'),
            value: 'Connections only',
            groupValue: _selectedVisibility,
            onChanged: (String? value) {
              if (value != null) {
                widget.onVisibilityChanged(value);
                Navigator.pop(context);
              }
            },
            activeColor: Colors.green,
          ),
          RadioListTile<String>(
            secondary: const Icon(Icons.group_work_outlined),
            title: Row(
              children: const [
                Text('Group'),
                Icon(Icons.arrow_forward_ios, size: 14),
              ],
            ),
            value: 'Group',
            groupValue: _selectedVisibility,
            onChanged: (String? value) {
              // TODO: Implement group selection logic
              // Potentially call a specific callback or navigate
            },
            activeColor: Colors.green,
          ),
          const Divider(),
          ListTile(
            title: const Text('Comment control'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(widget.initialCommentControl),
                const Icon(Icons.arrow_forward_ios, size: 16),
              ],
            ),
            onTap: () {
              Navigator.pop(context); // Close this sheet first
              widget.onCommentControlTap(); // Then trigger opening the other sheet
            },
          ),
          ListTile(
            title: Row(
              children: const [
                Text('Brand partnership'),
                SizedBox(width: 4),
                Icon(Icons.info_outline, size: 16, color: Colors.grey),
              ],
            ),
            subtitle: Text(_brandPartnership ? 'On' : 'Off'),
            trailing: Switch(
              value: _brandPartnership,
              onChanged: (bool value) {
                setState(() {
                  _brandPartnership = value;
                });
                widget.onBrandPartnershipChanged(value);
              },
            ),
            onTap: () {
              final newValue = !_brandPartnership;
              setState(() {
                _brandPartnership = newValue;
              });
              widget.onBrandPartnershipChanged(newValue);
            },
          ),
        ],
      ),
    );
  }
}
