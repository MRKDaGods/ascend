import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../bloc/post_bloc/post_bloc.dart';
import '../../../bloc/post_bloc/post_state.dart';

class PostEngagementStats extends StatelessWidget {
  final int likesCount;
  final int commentsCount;
  final IconData reactionIcon;
  final Color reactionColor;
  final String? postId; // Add postId parameter

  const PostEngagementStats({
    Key? key,
    required this.likesCount,
    required this.commentsCount,
    required this.reactionIcon,
    required this.reactionColor,
    this.postId, // Make it optional for backward compatibility
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // If no postId is provided, just show the static counts
    if (postId == null) {
      return _buildStatsRow(likesCount, commentsCount);
    }

    // Use BlocBuilder to listen for changes in the post's likes count
    return BlocBuilder<PostBloc, PostState>(
      buildWhen: (previous, current) {
        if (previous is PostsLoaded && current is PostsLoaded) {
          final prevPost = previous.getPostById(postId!);
          final currPost = current.getPostById(postId!);

          if (prevPost == null || currPost == null) return false;

          // Only rebuild if likes count changed
          return prevPost.likesCount != currPost.likesCount;
        }
        return false;
      },
      builder: (context, state) {
        if (state is PostsLoaded) {
          final post = state.getPostById(postId!);
          final currentLikesCount = post?.likesCount ?? likesCount;

          return _buildStatsRow(currentLikesCount, commentsCount);
        }
        return _buildStatsRow(likesCount, commentsCount);
      },
    );
  }

  Widget _buildStatsRow(int likes, int comments) {
    return Row(
      children: [
        Icon(reactionIcon, size: 16, color: reactionColor),
        const SizedBox(width: 4),
        Text('$likes', style: const TextStyle(color: Colors.grey)),
        const Spacer(),
        Text('$comments comments', style: const TextStyle(color: Colors.grey)),
      ],
    );
  }
}