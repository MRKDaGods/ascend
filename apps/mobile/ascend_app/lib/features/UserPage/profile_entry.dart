import 'package:flutter/material.dart';

class ProfileEntryWidget extends StatefulWidget {
  final String? title;
  final String? subtitle;
  final String? description;
  final String? imageUrl;
  final Icon? icon;
  final List<Widget>? extraContent;

  const ProfileEntryWidget({
    super.key,
    this.title,
    this.subtitle,
    this.description,
    this.imageUrl,
    this.icon,
    this.extraContent,
  });

  @override
  _ProfileEntryWidgetState createState() => _ProfileEntryWidgetState();
}

class _ProfileEntryWidgetState extends State<ProfileEntryWidget> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    final bool shouldShowMore =
        widget.description != null && widget.description!.length > 100;
    final String displayedText =
        shouldShowMore && !_isExpanded
            ? '${widget.description!.substring(0, 100)}...'
            : widget.description ?? '';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.imageUrl != null)
              Padding(
                padding: const EdgeInsets.only(right: 8.0, top: 3),
                child: Image.asset(widget.imageUrl!, width: 40, height: 40),
              )
            else if (widget.icon != null) // Display icon if icon is provided
              Padding(
                padding: const EdgeInsets.only(right: 8.0, top: 3),
                child: Icon(widget.icon!.icon, size: 28, color: Colors.white70),
              ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (widget.title != null)
                    Text(
                      widget.title!,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                  if (widget.subtitle != null)
                    Text(
                      widget.subtitle!,
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  if (widget.description != null)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          displayedText,
                          style: TextStyle(
                            color:
                                (widget.title != null)
                                    ? Colors.white54
                                    : Colors.white,
                            fontSize: 14,
                          ),
                        ),
                        if (shouldShowMore)
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                _isExpanded = !_isExpanded;
                              });
                            },
                            child: Text(
                              _isExpanded ? "Show less" : "Show more",
                              style: TextStyle(
                                color:
                                    (widget.title == null)
                                        ? Colors.white54
                                        : Colors.white,
                              ),
                            ),
                          ),
                      ],
                    ),
                ],
              ),
            ),
          ],
        ),
        if (widget.extraContent != null) ...widget.extraContent!,
        SizedBox(height: 10),
      ],
    );
  }
}
