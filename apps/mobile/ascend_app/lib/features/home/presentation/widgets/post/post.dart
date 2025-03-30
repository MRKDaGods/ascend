import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../bloc/post_bloc/post_bloc.dart';
import '../../../bloc/post_bloc/post_event.dart';
import '../../../bloc/post_bloc/post_state.dart';
import '../../../models/post_model.dart';
import '../../../models/comment_model.dart';
import '../../../managers/reaction_manager.dart';
import '../../pages/post_detail_page.dart';
import '../../utils/reaction_utils.dart';
import '../post/post_header.dart';
import '../post/post_content.dart';
import '../image/post_image_section.dart';
import '../post/post_action_button.dart';
import '../post/post_engagement_stats.dart';
import '../reaction/reaction_button.dart';
import '../comment/comment_preview.dart';
import '../../utils/full_screen_image_viewer.dart'; // Add this import

class Post extends StatefulWidget {
  final String postId;
  final Comment? previewComment;

  const Post({Key? key, required this.postId, this.previewComment})
    : super(key: key);

  @override
  State<Post> createState() => _PostState();
}

class _PostState extends State<Post> {
  final GlobalKey _reactionButtonKey = GlobalKey();

  // Navigate to post details page
  void _navigateToPostDetail(BuildContext context, PostModel post) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => PostDetailPage(postId: post.id)),
    );
  }

  // New method to navigate to image viewer
  void _navigateToImageViewer(
    BuildContext context,
    PostModel post,
    int imageIndex,
  ) {
    print("Navigating to image viewer: index=$imageIndex");

    Navigator.of(context).push(
      MaterialPageRoute(
        builder:
            (context) => FullScreenImageViewer(
              images: post.images,
              initialIndex: imageIndex,
              postId: post.id,
            ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostBloc, PostState>(
      builder: (context, state) {
        if (state is PostsLoaded) {
          final post = state.getPostById(widget.postId);

          if (post == null) {
            return const SizedBox.shrink();
          }

          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8.0),
            elevation: 0.5,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Post header
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: PostHeader(
                    ownerName: post.ownerName,
                    ownerImageUrl: post.ownerImageUrl,
                    timePosted: post.timePosted,
                    ownerOccupation: post.ownerOccupation,
                    isSponsored: post.isSponsored,
                    followers: post.followers,
                    onOptionsPressed: null, // Set to null explicitly
                    onHidePost: (reason) {
                      context.read<PostBloc>().add(HidePost(post.id, reason));
                    },
                  ),
                ),

                // Post content
                if (post.description.isNotEmpty)
                  InkWell(
                    onTap: () => _navigateToPostDetail(context, post),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: PostContent(
                        title: post.title,
                        description: post.description,
                      ),
                    ),
                  ),

                // Post image if present - UPDATED with correct padding
                if (post.images.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12.0,
                      vertical: 7.0,
                    ),
                    child: PostImageSection(
                      images: post.images,
                      useCarousel: post.useCarousel,
                      isSponsored: post.isSponsored, // Add this parameter
                      // Send index to open the specific image in full screen
                      onTapImage: (index) {
                        print("Image tapped at index: $index");
                        _navigateToImageViewer(context, post, index);
                      },
                    ),
                  ),

                // Comment preview if provided
                if (widget.previewComment != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                      vertical: 8.0,
                    ),
                    child: CommentPreview(
                      comment: widget.previewComment!,
                      onTap: () => _navigateToPostDetail(context, post),
                    ),
                  ),

                // Engagement stats
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16.0,
                    vertical: 8.0,
                  ),
                  child: PostEngagementStats(
                    likesCount: post.likesCount,
                    commentsCount: post.commentsCount,
                    reactionIcon: _getReactionIcon(post),
                    reactionColor: _getReactionColor(post),
                  ),
                ),

                const Divider(height: 1),

                // Action buttons
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Like/React button - Using the key directly on the ReactionButton
                      ReactionButton(
                        key: _reactionButtonKey,
                        manager: ReactionManager(
                          isLiked: post.isLiked,
                          currentReaction: post.currentReaction,
                        ),
                        onTap:
                            () => context.read<PostBloc>().add(
                              TogglePostReaction(
                                post.id,
                                post.isLiked ? null : 'like',
                              ),
                            ),
                        onLongPressStart: () {
                          final RenderBox box =
                              _reactionButtonKey.currentContext!
                                      .findRenderObject()
                                  as RenderBox;
                          final position = box.localToGlobal(Offset.zero);

                          ReactionUtils.showReactionsPopup(
                            context: context,
                            position: position,
                            itemId: post.id,
                            isComment: false,
                            onReactionSelected:
                                (id, reaction) => context.read<PostBloc>().add(
                                  TogglePostReaction(id, reaction),
                                ),
                          );
                        },
                        onLongPressEnd: () {},
                      ),

                      // Comment button
                      PostActionButton(
                        icon: Icons.comment_outlined,
                        label: 'Comment',
                        onTap: () => _navigateToPostDetail(context, post),
                      ),

                      // Share button
                      PostActionButton(
                        icon: Icons.share_outlined,
                        label: 'Share',
                        onTap: () {},
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }

        // Loading state
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8.0),
          child: const SizedBox(
            height: 150,
            child: Center(child: CircularProgressIndicator()),
          ),
        );
      },
    );
  }

  IconData _getReactionIcon(PostModel post) {
    if (!post.isLiked) {
      return Icons.thumb_up_outlined;
    }

    if (post.currentReaction != null &&
        ReactionManager.reactionIcons.containsKey(post.currentReaction)) {
      return ReactionManager.reactionIcons[post.currentReaction]!;
    }

    return Icons.thumb_up;
  }

  Color _getReactionColor(PostModel post) {
    if (!post.isLiked) {
      return Colors.grey;
    }

    if (post.currentReaction != null &&
        ReactionManager.reactionColors.containsKey(post.currentReaction)) {
      return ReactionManager.reactionColors[post.currentReaction]!;
    }

    return Colors.blue;
  }
}
