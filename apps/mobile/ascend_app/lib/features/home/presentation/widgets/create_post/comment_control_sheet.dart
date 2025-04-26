import 'package:flutter/material.dart';

class CommentControlSheet extends StatefulWidget {
  final String initialCommentControl;
  final ValueChanged<String> onCommentControlConfirmed;

  const CommentControlSheet({
    super.key,
    required this.initialCommentControl,
    required this.onCommentControlConfirmed,
  });

  @override
  State<CommentControlSheet> createState() => _CommentControlSheetState();
}

class _CommentControlSheetState extends State<CommentControlSheet> {
  late String _tempCommentControl;

  @override
  void initState() {
    super.initState();
    _tempCommentControl = widget.initialCommentControl;
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
              'Comment control',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Row(
              children: [
                Icon(Icons.info_outline, size: 16, color: Colors.grey[600]),
                const SizedBox(width: 8),
                Text(
                  'Your selection will be saved',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          RadioListTile<String>(
            secondary: const Icon(Icons.public),
            title: const Text('Anyone'),
            value: 'Anyone',
            groupValue: _tempCommentControl,
            onChanged: (String? value) {
              if (value != null) {
                setState(() {
                  _tempCommentControl = value;
                });
              }
            },
            activeColor: Colors.green,
            controlAffinity: ListTileControlAffinity.trailing,
          ),
          RadioListTile<String>(
            secondary: const Icon(Icons.people_outline),
            title: const Text('Connections only'),
            value: 'Connections only',
            groupValue: _tempCommentControl,
            onChanged: (String? value) {
              if (value != null) {
                setState(() {
                  _tempCommentControl = value;
                });
              }
            },
            activeColor: Colors.green,
            controlAffinity: ListTileControlAffinity.trailing,
          ),
          RadioListTile<String>(
            secondary: const Icon(Icons.no_accounts_outlined),
            title: const Text('No one'),
            value: 'No one',
            groupValue: _tempCommentControl,
            onChanged: (String? value) {
              if (value != null) {
                setState(() {
                  _tempCommentControl = value;
                });
              }
            },
            activeColor: Colors.green,
            controlAffinity: ListTileControlAffinity.trailing,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  widget.onCommentControlConfirmed(_tempCommentControl);
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text('Done'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
