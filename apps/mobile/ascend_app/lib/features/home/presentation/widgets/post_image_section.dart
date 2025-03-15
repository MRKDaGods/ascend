import 'package:ascend_app/features/home/presentation/widgets/post_images_grid_shape.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';

class PostImageSection extends StatelessWidget {
  final List<String> images;
  final bool useCarousel;

  const PostImageSection({
    super.key,
    required this.images,
    this.useCarousel = false,
  });

  @override
  Widget build(BuildContext context) {
    if (images.isEmpty) return const SizedBox.shrink();

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
      return ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: ImagesGridShape(imageCount: images.length, images: images),
      );
    }
  }
}