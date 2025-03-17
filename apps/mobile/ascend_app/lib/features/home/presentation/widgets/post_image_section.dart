import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_images_grid_shape.dart';

class PostImageSection extends StatelessWidget {
  final List<String> images;
  final bool useCarousel;
  final bool isSponsored; // Add this parameter to check if the post is sponsored
  final Function(int)? onTap;

  const PostImageSection({
    super.key,
    required this.images,
    this.useCarousel = false,
    this.isSponsored = false, // Default to false
    this.onTap,
  });


  @override
  Widget build(BuildContext context) {
    if (images.isEmpty) {
      return const SizedBox.shrink();
    }

    // Only use carousel for sponsored posts AND if useCarousel is true
    if (isSponsored && useCarousel) {
      return CarouselSlider(
        options: CarouselOptions(
          height: 200.0,
          viewportFraction: 1.0,
          enableInfiniteScroll: images.length > 1,
          enlargeCenterPage: false,
          autoPlay: true, // Auto-play for sponsored posts
          autoPlayInterval: const Duration(seconds: 5),
          autoPlayAnimationDuration: const Duration(milliseconds: 800),
        ),
        items: List.generate(images.length, (index) {
          return Builder(
            builder: (BuildContext context) {
              return GestureDetector(
                onTap: () => onTap?.call(index),
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  margin: const EdgeInsets.symmetric(horizontal: 5.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8.0),
                    child: Image.asset(
                      images[index],
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        print("Error loading image: $error");
                        return Container(
                          height: 200,
                          color: Colors.grey[300],
                          child: const Center(child: Text('Image not available')),
                        );
                      },
                    ),
                  ),
                ),
              );
            },
          );
        }),
      );
    } 
    // For all non-sponsored posts, always use grid layout
    else {
      return ImagesGridShape(
        imageCount: images.length,
        images: images,
        onTap: onTap,
      );
    }
  }
}