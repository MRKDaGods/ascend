import 'package:ascend_app/features/home/presentation/utils/build_image.dart';
import 'package:flutter/material.dart';

class ImagesGridShape extends StatelessWidget {
  const ImagesGridShape({
    super.key,
    required this.imageCount,
    required this.images,
    this.onTap,
  });

  final int imageCount;
  final List<String> images;
  final Function(int)? onTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (imageCount == 1) 
          GestureDetector(
            onTap: () => onTap?.call(0),
            child: PostImage(image: images[0], height: 250),
          ),
        if (imageCount == 2)
          Row(
            children: [
              Expanded(
                flex: 7, // 70% of the width
                child: GestureDetector(
                  onTap: () => onTap?.call(0),
                  child: PostImage(image: images[0], height: 250),
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                flex: 3, // 30% of the width
                child: GestureDetector(
                  onTap: () => onTap?.call(1),
                  child: PostImage(image: images[1], height: 250),
                ),
              ),
            ],
          ),
        if (imageCount == 3)
          Row(
            children: [
              Expanded(
                flex: 2, 
                child: GestureDetector(
                  onTap: () => onTap?.call(0),
                  child: PostImage(image: images[0], height: 250),
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    GestureDetector(
                      onTap: () => onTap?.call(1),
                      child: PostImage(image: images[1], height: 120),
                    ),
                    const SizedBox(height: 4),
                    GestureDetector(
                      onTap: () => onTap?.call(2),
                      child: PostImage(image: images[2], height: 120),
                    ),
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
                child: GestureDetector(
                  onTap: () => onTap?.call(0),
                  child: PostImage(image: images[0], height: 250),
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    GestureDetector(
                      onTap: () => onTap?.call(1),
                      child: PostImage(image: images[1], height: 80),
                    ),
                    const SizedBox(height: 4),
                    GestureDetector(
                      onTap: () => onTap?.call(2),
                      child: PostImage(image: images[2], height: 80),
                    ),
                    const SizedBox(height: 4),
                    GestureDetector(
                      onTap: () => onTap?.call(3),
                      child: PostImage(image: images[3], height: 80),
                    ),
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
                child: GestureDetector(
                  onTap: () => onTap?.call(0),
                  child: PostImage(image: images[0], height: 250),
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    GestureDetector(
                      onTap: () => onTap?.call(1),
                      child: PostImage(image: images[1], height: 80),
                    ),
                    const SizedBox(height: 4),
                    GestureDetector(
                      onTap: () => onTap?.call(2),
                      child: PostImage(image: images[2], height: 80),
                    ),
                    const SizedBox(height: 4),
                    GestureDetector(
                      onTap: () => onTap?.call(3),
                      child: Stack(
                        children: [
                          PostImage(image: images[3], height: 80),
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
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
      ],
    );
  }
}