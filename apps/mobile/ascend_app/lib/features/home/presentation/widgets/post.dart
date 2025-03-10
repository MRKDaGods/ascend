import 'package:ascend_app/features/home/presentation/widgets/post_images_grid_shape.dart';
import 'package:ascend_app/features/home/presentation/widgets/reactions_post.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:readmore/readmore.dart';

class Post extends StatelessWidget {
  final String title;
  final String description;
  final List<String> images; // List of image URLs or asset paths
  final bool useCarousel; // Flag to determine if carousel should be used
  final bool isSponsored;

  const Post({
    super.key,
    required this.title,
    required this.description,
    this.images = const [],
    this.useCarousel = false, // Default to grid layout
    this.isSponsored = false,
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
            /// **Title with Sponsored badge if necessary**
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                if (isSponsored)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'Sponsored',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  ),
              ],
            ),

            /// **Description with Read More**
            if (description.isNotEmpty) ...[
              const SizedBox(height: 8),
              SizedBox(
                width: MediaQuery.of(context).size.width * 0.9,
                child: ReadMoreText(
                  description,
                  trimMode: TrimMode.Line,
                  trimLines: 4,
                  trimCollapsedText: 'Show more',
                  trimExpandedText: 'Show less',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.normal),
                  moreStyle: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                  lessStyle: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],

            /// **Images - Either Grid or Carousel based on choice**
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

  /// **📸 Image Grid or Carousel based on useCarousel flag**
  Widget _buildImageSection() {
    if (useCarousel) {
      return CarouselSlider(
        options: CarouselOptions(
          height: 200,
          viewportFraction: 0.9,
          enlargeCenterPage: true,
          enableInfiniteScroll: images.length > 1,
          autoPlay: false,
        ),
        items: images.map((imageUrl) {
          return Builder(
            builder: (BuildContext context) {
              return Container(
                width: MediaQuery.of(context).size.width,
                margin: const EdgeInsets.symmetric(horizontal: 5.0),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.asset(
                    imageUrl,
                    fit: BoxFit.cover,
                  ),
                ),
              );
            },
          );
        }).toList(),
      );
    } else {
      // Use grid layout
      return ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: ImagesGridShape(imageCount: images.length, images: images),
      );
    }
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
  Widget _postButton(IconData icon, String label) {
    return GestureDetector(
      onTap: () => print("$label tapped"),
      child: Column(
        mainAxisSize: MainAxisSize.min, // Ensures the column takes minimal height
        children: [
          Icon(icon, size: 24), // Adjusted size for a compact layout
          const SizedBox(height: 2), // Reduced spacing
          Text(
            label,
            style: const TextStyle(fontSize: 12),
          ), // Smaller font for better alignment
        ],
      ),
    );
  }

  /// **💬 Show Reaction Popup**
  void _showReactionPopup(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final popupWidth = screenWidth < 300 ? screenWidth - 40 : 300; // 40 for padding
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return ReactionsPost(popupWidth: popupWidth);
      },
    );
  }
}
