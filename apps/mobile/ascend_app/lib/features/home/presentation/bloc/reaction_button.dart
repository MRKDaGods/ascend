import 'package:flutter/material.dart';

class ReactionButton extends StatefulWidget {
  final IconData icon;
  final String label;
  final Color color;

  const ReactionButton({super.key, required this.icon, required this.label, Color? color})
    : color = color ?? Colors.grey;

  @override
  _ReactionButtonState createState() => _ReactionButtonState();
}

class _ReactionButtonState extends State<ReactionButton> {
  bool _showLabel = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Normal tap - Just react (no label)
        print("${widget.label} tapped");
      },
      onTapDown: (_) {
        // Long press starts - Show label
        setState(() {
          _showLabel = true;
        });
      },
      onTapUp: (_) {
        // Released - Hide label
        setState(() {
          _showLabel = false;
        });
      },
      onTapCancel: () {
        // If touch is canceled, hide the label
        setState(() {
          _showLabel = false;
        });
      },
      child: Column(
        children: [
          Icon(widget.icon, size: 30, color: widget.color),
          const SizedBox(height: 4),
          AnimatedOpacity(
            duration: Duration(milliseconds: 150),
            opacity: _showLabel ? 1.0 : 0.0,
            child: Text(widget.label, style: TextStyle(color: widget.color, fontSize: 12)),
          ),
        ],
      ),
    );
  }
}
