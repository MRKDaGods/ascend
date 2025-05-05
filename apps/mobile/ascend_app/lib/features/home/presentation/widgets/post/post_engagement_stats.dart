import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../bloc/post_bloc/post_bloc.dart';
import '../../../bloc/post_bloc/post_state.dart';
import 'package:ascend_app/features/home/managers/reaction_manager.dart'; // Import ReactionManager for static maps

class PostEngagementStats extends StatelessWidget {
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final String? postId;
  // Remove reactionIcon and reactionColor from constructor if they are determined dynamically
  // final IconData reactionIcon;
  // final Color reactionColor;

  const PostEngagementStats({
    super.key,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    // required this.reactionIcon, // Removed
    // required this.reactionColor, // Removed
    this.postId,
  });

  @override
  Widget build(BuildContext context) {
    // If no postId is provided, show static counts with default reaction icon/color
    if (postId == null) {
      return _buildStatsRow(
        likesCount,
        commentsCount,
        sharesCount,
        null, // Pass null for currentReaction
      );
    }

    // Use BlocBuilder to listen for changes in the post's engagement stats
    return BlocBuilder<PostBloc, PostState>(
      buildWhen: (previous, current) {
        if (previous is PostsLoaded && current is PostsLoaded) {
          final prevPost = previous.getPostById(postId!);
          final currPost = current.getPostById(postId!);

          if (prevPost == null || currPost == null) return false;

          // Rebuild if counts OR reaction changed - use isLiked.reactionType now
          return prevPost.likesCount != currPost.likesCount ||
              prevPost.sharedCount != currPost.sharedCount ||
              prevPost.commentsCount != currPost.commentsCount ||
              prevPost.isLiked.reactionType != currPost.isLiked.reactionType; // Updated to use isLiked structure
        }
        return false;
      },
      builder: (context, state) {
        if (state is PostsLoaded) {
          final post = state.getPostById(postId!);
          final currentLikesCount = post?.likesCount ?? likesCount;
          final currentSharesCount = post?.sharedCount ?? sharesCount;
          final currentCommentsCount = post?.commentsCount ?? commentsCount;
          final currentReaction = post?.isLiked.reactionType; // Updated to use isLiked.reactionType

          return _buildStatsRow(
            currentLikesCount,
            currentCommentsCount,
            currentSharesCount,
            currentReaction, // Pass the reaction string
          );
        }
        // Fallback to initial counts and null reaction
        return _buildStatsRow(
          likesCount,
          commentsCount,
          sharesCount,
          null,
        );
      },
    );
  }

  // Updated _buildStatsRow to accept currentReaction and determine icon/color
  Widget _buildStatsRow(
    int likes,
    int comments,
    int shares,
    String? currentReaction, // Added parameter
  ) {
    // Determine icon and color based on currentReaction
    IconData reactionIcon;
    Color reactionColor;

    if (currentReaction != null && ReactionManager.reactionIcons.containsKey(currentReaction)) {
      // Use icon/color from ReactionManager's maps
      reactionIcon = ReactionManager.reactionIcons[currentReaction]!;
      reactionColor = ReactionManager.reactionColors[currentReaction]!;
    } else {
      // Default icon/color if no reaction or unknown reaction
      reactionIcon = Icons.thumb_up; // Default icon
      reactionColor = const Color.fromARGB(255, 173, 173, 173); // Default color for count display
    }

    // Build the Row using the determined icon/color
    return Row(
      children: [
        // Only show icon and count if likes > 0
        
          Icon(reactionIcon, size: 14, color: reactionColor), // Use determined icon/color
          const SizedBox(width: 3),
          Text('$likes', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
        
        const Spacer(), // Pushes comments/shares to the right
        // Display comments count if > 0
        
          Text('$comments comments', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
        // Add spacer if both comments and shares are shown
        
           const Padding(
             padding: EdgeInsets.symmetric(horizontal: 4.0),
             child: Text('·', style: TextStyle(color: Colors.grey)),
           ),
        // Display shares count if > 0
        
          Text('$shares shares', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
      ],
    );
  }
}
