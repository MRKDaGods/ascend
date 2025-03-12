
import 'package:ascend_app/features/home/presentation/widgets/build_image.dart';
import 'package:flutter/material.dart';

class ImagesGridShape extends StatelessWidget {
  const ImagesGridShape({
    super.key,
    required this.imageCount,
    required this.images,
  });

  final int imageCount;
  final List<String> images;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (imageCount == 1) PostImage(image: images[0], height: 250),
        if (imageCount == 2)
          Row(
            children: [
              Expanded(
                flex: 7, // 70% of the width
                child: PostImage(image: images[0], height: 250),
              ),
              const SizedBox(width: 4),
              Expanded(
                flex: 3, // 30% of the width
                child: PostImage(image: images[1], height: 250),
              ),
            ],
          ),
        if (imageCount == 3)
          Row(
            children: [
              Expanded(flex: 2, child: PostImage(image: images[0], height: 250)),
              const SizedBox(width: 4),
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    PostImage(image: images[1], height: 120),
                    const SizedBox(height: 4),
                    PostImage(image: images[2], height: 120),
                  ],
                ),
              ),
            ],
          ),
        if (imageCount == 4)
          Row(
            children: [
              Expanded(flex: 2, child: PostImage(image: images[0], height: 250)),
              const SizedBox(width: 4),
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    PostImage(image: images[1], height: 80),
                    const SizedBox(height: 4),
                    PostImage(image: images[2], height: 80),
                    const SizedBox(height: 4),
                    PostImage(image: images[3], height: 80),
                  ],
                ),
              ),
            ],
          ),
        if (imageCount >= 5)
          Row(
            children: [
              Expanded(flex: 2, child: PostImage(image: images[0], height: 250)),
              const SizedBox(width: 4),
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    PostImage(image: images[1], height: 120),
                    const SizedBox(height: 4),
                    Stack(
                      children: [
                        PostImage(image: images[2], height: 120),
                        if (imageCount > 4)
                          Positioned.fill(
                            child: Container(
                              alignment: Alignment.center,
                              child: Text(
                                "+${imageCount - 4}",
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
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
    );
  }
}
