import 'package:flutter/material.dart';
import 'package:readmore/readmore.dart';

class PostContent extends StatelessWidget {
  final String title;
  final String description;

  const PostContent({
    super.key,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title.isNotEmpty) ...[
          const SizedBox(height: 10),
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
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
      ],
    );
  }
}