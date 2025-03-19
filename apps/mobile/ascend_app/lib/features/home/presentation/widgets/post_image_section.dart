import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class PostImageSection extends StatelessWidget {
  final List<String> images;
  final bool useCarousel;
  final bool isSponsored;
  final Function(int) onTap;

  const PostImageSection({
    super.key,
    required this.images,
    this.useCarousel = false,
    this.isSponsored = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // For a single image
    if (images.length == 1) {
      return _buildSingleImage(context, images[0]);
    }

    // For multiple images with carousel
    if (useCarousel) {
      return _buildCarousel(context);
    }

    // For multiple images in a grid
    return _buildImageGrid(context);
  }

  Widget _buildSingleImage(BuildContext context, String imageUrl) {
    return GestureDetector(
      onTap: () => onTap(0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Image.asset(
          imageUrl,
          width: double.infinity,
          height: 200,
          fit: BoxFit.cover,
        ),
      ),
    );
  }

  Widget _buildCarousel(BuildContext context) {
    return CarouselSlider(
      options: CarouselOptions(
        height: 200,
        viewportFraction: 1.0,
        enableInfiniteScroll: images.length > 1,
        autoPlay: isSponsored, // Auto-play for sponsored posts
        autoPlayInterval: const Duration(seconds: 4),
      ),
      items: List.generate(images.length, (index) {
        return GestureDetector(
          onTap: () => onTap(index),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset(
                images[index],
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildImageGrid(BuildContext context) {
    // Maximum of 4 images in grid view
    final displayImages = images.length > 4 ? images.sublist(0, 4) : images;
    final hasMoreImages = images.length > 4;
    
    return LayoutBuilder(
      builder: (context, constraints) {
        return GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: displayImages.length == 1 ? 1 : 2,
          mainAxisSpacing: 4,
          crossAxisSpacing: 4,
          children: List.generate(displayImages.length, (index) {
            bool isLastTile = index == 3 && hasMoreImages;
            
            return GestureDetector(
              onTap: () => onTap(index),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.asset(
                      displayImages[index],
                      fit: BoxFit.cover,
                    ),
                  ),
                  if (isLastTile)
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          '+${images.length - 3}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            );
          }),
        );
      },
    );
  }
}