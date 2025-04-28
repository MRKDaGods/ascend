import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../bloc/post_bloc/post_bloc.dart';
import '../../../bloc/post_bloc/post_state.dart';

class PostEngagementStats extends StatelessWidget {
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final IconData reactionIcon;
  final Color reactionColor;
  final String? postId;

  const PostEngagementStats({
    super.key,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.reactionIcon,
    required this.reactionColor,
    this.postId,
  });

  @override
  Widget build(BuildContext context) {
    // If no postId is provided, just show the static counts
    if (postId == null) {
      return _buildStatsRow(likesCount, commentsCount, sharesCount);
    }

    // Use BlocBuilder to listen for changes in the post's engagement stats
    return BlocBuilder<PostBloc, PostState>(
      buildWhen: (previous, current) {
        if (previous is PostsLoaded && current is PostsLoaded) {
          final prevPost = previous.getPostById(postId!);
          final currPost = current.getPostById(postId!);

          if (prevPost == null || currPost == null) return false;

          // Rebuild if likes count, shares count, or comments count changed
          return prevPost.likesCount != currPost.likesCount ||
              prevPost.sharedCount != currPost.sharedCount ||
              prevPost.commentsCount != currPost.commentsCount;
        }
        return false;
      },
      builder: (context, state) {
        if (state is PostsLoaded) {
          final post = state.getPostById(postId!);
          final currentLikesCount = post?.likesCount ?? likesCount;
          final currentSharesCount = post?.sharedCount ?? sharesCount;
          final currentCommentsCount = post?.commentsCount ?? commentsCount;

          return _buildStatsRow(
            currentLikesCount,
            currentCommentsCount,
            currentSharesCount,
          );
        }
        return _buildStatsRow(likesCount, commentsCount, sharesCount);
      },
    );
  }

  Widget _buildStatsRow(int likes, int comments, int shares) {
    return Row(
      children: [
        Icon(reactionIcon, size: 16, color: reactionColor),
        const SizedBox(width: 4),
        Text('$likes', style: const TextStyle(color: Colors.grey)),
        const Spacer(),
        Text('$comments comments', style: const TextStyle(color: Colors.grey)),
        const SizedBox(width: 8),
        Icon(Icons.share, size: 16, color: Colors.grey),
        const SizedBox(width: 4),
        Text('$shares shares', style: const TextStyle(color: Colors.grey)),
      ],
    );
  }
}
