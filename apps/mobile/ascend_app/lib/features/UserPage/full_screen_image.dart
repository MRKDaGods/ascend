import 'package:flutter/material.dart';

class FullScreenImage extends StatelessWidget {
  final String imageUrl;
  final bool isMyProfile;
  const FullScreenImage({
    super.key,
    required this.imageUrl,
    required this.isMyProfile,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Full-screen image
          GestureDetector(
            onTap: () {
              Navigator.pop(context);
            },
            child: Center(
              child: InteractiveViewer(
                // Allows pinch-to-zoom
                child: Image.network(imageUrl),
              ),
            ),
          ),
          // Bottom options
          if (isMyProfile)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                // ignore: deprecated_member_use
                color: Colors.black, // Semi-transparent background
                padding: const EdgeInsets.symmetric(
                  vertical: 10,
                  horizontal: 20,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Visibility option
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Icon(Icons.visibility, color: Colors.white),
                        const SizedBox(width: 8),
                        Text(
                          "Anyone",
                          style: TextStyle(color: Colors.white, fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    // Action buttons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildOptionButton(
                          context,
                          icon: Icons.edit_outlined,
                          label: "Edit",
                          onTap: () {
                            // Add edit functionality here
                          },
                        ),
                        _buildOptionButton(
                          context,
                          icon: Icons.photo_camera,
                          label: "Add photo",
                          onTap: () {
                            // Add photo functionality here
                          },
                        ),
                        _buildOptionButton(
                          context,
                          icon: Icons.image,
                          label: "Frames",
                          onTap: () {
                            // Add frame functionality here
                          },
                        ),
                        _buildOptionButton(
                          context,
                          icon: Icons.delete,
                          label: "Delete",
                          onTap: () {
                            // Add delete functionality here
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildOptionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 28),
          const SizedBox(height: 5),
          Text(label, style: TextStyle(color: Colors.white, fontSize: 14)),
        ],
      ),
    );
  }
}
