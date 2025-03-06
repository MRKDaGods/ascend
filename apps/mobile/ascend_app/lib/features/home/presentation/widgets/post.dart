import 'package:flutter/material.dart';

class Post extends StatelessWidget {
  final String title;
  final String description;
  final List<String> images; // List of image URLs or asset paths

  const Post({
    super.key,
    required this.title,
    required this.description,
    this.images = const [],
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// **Title**
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),

            /// **Description**
            if (description.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(description),
            ],

            /// **Image Grid (if there are images)**
            if (images.isNotEmpty) ...[
              const SizedBox(height: 10),
              _buildImageSection(),
            ],

            /// **Reactions**
            const SizedBox(height: 12),
            _buildReactionRow(context),
          ],
        ),
      ),
    );
  }

  /// **📸 Image Grid with Fixed Layout Issues**
  Widget _buildImageSection() {
    int imageCount = images.length;

    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Column(
        children: [
          if (imageCount == 1) _buildImage(images[0], height: 250),
          if (imageCount == 2)
            Row(
              children: [
                Expanded(
                  flex: 7, // 70% of the width
                  child: _buildImage(images[0], height: 250),
                ),
                const SizedBox(width: 4),
                Expanded(
                  flex: 3, // 30% of the width
                  child: _buildImage(images[1], height: 250),
                ),
              ],
            ),
          if (imageCount == 3)
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: _buildImage(images[0], height: 250),
                ),
                const SizedBox(width: 4),
                Expanded(
                  flex: 1,
                  child: Column(
                    children: [
                      _buildImage(images[1], height: 120),
                      const SizedBox(height: 4),
                      _buildImage(images[2], height: 120),
                    ],
                  ),
                ),
              ],
            ),
          if (imageCount == 4)
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: _buildImage(images[0], height: 250),
                ),
                const SizedBox(width: 4),
                Expanded(
                  flex: 1,
                  child: Column(
                    children: [
                      _buildImage(images[1], height: 80),
                      const SizedBox(height: 4),
                      _buildImage(images[2], height: 80),
                      const SizedBox(height: 4),
                      _buildImage(images[3], height: 80),
                    ],
                  ),
                ),
              ],
            ),
          if (imageCount >= 5)
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: _buildImage(images[0], height: 250),
                ),
                const SizedBox(width: 4),
                Expanded(
                  flex: 1,
                  child: Column(
                    children: [
                      _buildImage(images[1], height: 120),
                      const SizedBox(height: 4),
                      Stack(
                        children: [
                          _buildImage(images[2], height: 120),
                          if (imageCount > 4)
                            Positioned.fill(
                              child: Container(
                                color: Colors.black.withOpacity(0.5),
                                alignment: Alignment.center,
                                child: Text(
                                  "+${imageCount - 4}",
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold),
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
        ],
      ),
    );
  }

  /// **🖼 Image Loader with Fixes**
  Widget _buildImage(String image, {double height = 100}) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        image: DecorationImage(
          image: image.startsWith("http")
              ? NetworkImage(image)
              : AssetImage(image) as ImageProvider,
          fit: BoxFit.cover,
        ),
      ),
    );
  }

  /// **💙 Post Bottom Row**
  Widget _buildReactionRow(BuildContext context) {
    return Builder(
      builder: (context) => Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          GestureDetector(
            onLongPress: () => _showReactionPopup(context),
            child: _postButton(Icons.thumb_up, "Like"),
          ),
          _postButton(Icons.comment, "Comment"),
          _postButton(Icons.repeat, "Repost"),
          _postButton(Icons.send, "Send"),
        ],
      ),
    );
  }

  /// **🏷 Single Reaction Button**
  Widget _postButton(IconData icon, String label, {Color color = Colors.grey}) {
    return GestureDetector(
      onTap: () => print("$label tapped"),
      child: Column(
        mainAxisSize:
            MainAxisSize.min, // Ensures the column takes minimal height
        children: [
          Icon(icon,
              color: color, size: 24), // Adjusted size for a compact layout
          const SizedBox(height: 2), // Reduced spacing
          Text(label,
              style:
                  TextStyle(fontSize: 12)), // Smaller font for better alignment
        ],
      ),
    );
  }

  /// **💬 Show Reaction Popup**
  void _showReactionPopup(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final popupWidth =
        screenWidth < 300 ? screenWidth - 40 : 300; // 40 for padding

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          content: Container(
            width: popupWidth.toDouble(),
            height: 51, // Adjust height as needed
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ReactionButton(icon: Icons.thumb_up, label: "Like"),
                ReactionButton(
                    icon: Icons.celebration,
                    label: "Celebrate",
                    color: Colors.purple),
                ReactionButton(
                    icon: Icons.volunteer_activism,
                    label: "Support",
                    color: Colors.green),
                ReactionButton(
                    icon: Icons.favorite, label: "Love", color: Colors.red),
                ReactionButton(
                    icon: Icons.lightbulb,
                    label: "Insightful",
                    color: Colors.yellow),
                ReactionButton(
                    icon: Icons.emoji_emotions,
                    label: "Funny",
                    color: Colors.orange),
              ],
            ),
          ),
        );
      },
    );
  }
}

class ReactionButton extends StatefulWidget {
  final IconData icon;
  final String label;
  final Color color;

  const ReactionButton({
    required this.icon,
    required this.label,
    this.color = Colors.grey,
  });

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
            child: Text(widget.label,
                style: TextStyle(color: widget.color, fontSize: 12)),
          ),
        ],
      ),
    );
  }
}
