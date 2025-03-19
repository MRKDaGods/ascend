import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/home/domain/models/post_model.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/post_bloc.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/post_event.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_header.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_content.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_image_section.dart';
import 'package:ascend_app/features/home/presentation/widgets/reaction_button.dart';

class Post extends StatelessWidget {
  final PostModel post;
  final VoidCallback? onPostTap;
  final Function(int)? onImageTap;
  
  const Post({
    super.key,
    required this.post,
    this.onPostTap,
    this.onImageTap,
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
            // Post Header section
            PostHeader(
              post: post,
            ),
            
            const SizedBox(height: 12),
            
            // Post Content section (title, description)
            PostContent(
              title: post.title,
              description: post.description,
              onTap: onPostTap,
            ),
            
            // Images Section (if present)
            if (post.images.isNotEmpty) ...[
              const SizedBox(height: 12),
              PostImageSection(
                images: post.images,
                useCarousel: post.useCarousel,
                isSponsored: post.isSponsored,
                onTap: onImageTap ?? (_) {},
              ),
            ],
            
            const SizedBox(height: 12),
            
            Divider(color: Colors.grey[300], height: 1),
            
            // Reactions and Comments row
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ReactionButton(
                    isLiked: post.isLiked,
                    reaction: post.currentReaction,
                    likesCount: post.likesCount,
                    onReactionSelected: (String reaction) {
                      context.read<PostBloc>().add(LikePost(
                        postId: post.id,
                        reactionType: reaction,
                      ));
                    },
                  ),
                  
                  // Comment button
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chat_bubble_outline),
                        onPressed: onPostTap,
                      ),
                      Text(
                        '${post.commentsCount}',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
