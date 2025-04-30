import 'package:ascend_app/features/home/presentation/widgets/post/post_feedback_options.dart';
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
import '../../utils/full_screen_image_viewer.dart';
import '../../utils/sheet_helpers.dart'; 

class Post extends StatefulWidget {
  final String postId;
  final Comment? previewComment;

  const Post({super.key, required this.postId, this.previewComment});

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

  // Method to show the post options bottom sheet
  void _showPostOptions(BuildContext context, PostModel post) {
    // --- MODIFICATION START ---
    // Read the latest state from the bloc to get the most current post status
    final postBloc = context.read<PostBloc>();
    final currentState = postBloc.state;
    PostModel currentPost = post; // Default to the post passed in

    if (currentState is PostsLoaded) {
      currentPost = currentState.getPostById(post.id) ?? post; // Find the latest version or use the old one
    }

    final bool isCurrentlySaved = currentPost.isSaved;
    debugPrint("Showing options sheet for post: ${currentPost.id}, isSaved: $isCurrentlySaved from Post widget");

    // --- MODIFICATION START ---
    // Explicitly check the flags being passed
    final bool showSaveFlag = !isCurrentlySaved;
    final bool showUnsaveFlag = isCurrentlySaved;
    debugPrint("Sheet parameters: showSave=$showSaveFlag, showUnsave=$showUnsaveFlag");
    // --- MODIFICATION END ---


    SheetHelpers.showPostOptionsSheet(
      context: context,
      ownerName: currentPost.ownerName, // Use currentPost
      // --- MODIFICATION START ---
      showSave: showSaveFlag, // Use the debugged flag
      showUnsave: showUnsaveFlag, // Use the debugged flag
      // --- MODIFICATION END ---
      showShare: true, // Control visibility as needed
      showNotInterested: true, // Control visibility as needed
      showUnfollow: true, // Control visibility as needed
      showReport: false, // Control visibility as needed
      // Add other show flags based on your sheet implementation

      onSave: () {
        print("Save selected for post ${currentPost.id}");
        // --- MODIFICATION START ---
        postBloc.add(SavePost(currentPost.id)); // Use postBloc directly
        // --- MODIFICATION END ---
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Post saved'), duration: Duration(seconds: 1)),
        );
      },
      onUnsave: () {
        print("Unsave selected for post ${currentPost.id}");
        // --- MODIFICATION START ---
        postBloc.add(UnsavePost(currentPost.id)); // Use postBloc directly
        // --- MODIFICATION END ---
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Post unsaved'), duration: Duration(seconds: 1)),
        );
      },
      onShare: () {
        print("Share selected for post ${currentPost.id}");
        // --- MODIFICATION START ---
        postBloc.add(SharePost(currentPost.id)); // Use postBloc directly
        // --- MODIFICATION END ---
        // Add sharing logic or feedback
         ScaffoldMessenger.of(context).showSnackBar(
           const SnackBar(content: Text('Sharing...'), duration: Duration(seconds: 1)),
         );
      },
      onNotInterested: () {
        print("Not interested selected for post ${currentPost.id}");
        // --- MODIFICATION START ---
        postBloc.add(HidePost(currentPost.id, "Not interested")); // Use postBloc directly
        // --- MODIFICATION END ---
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Post hidden'), duration: Duration(seconds: 1)),
        );
      },
      onUnfollow: () {
        print("Unfollow selected for user ${currentPost.ownerName}");
        // Add unfollow logic (likely involves a different BLoC)
        // --- MODIFICATION START ---
        // Example: Dispatch event to FollowBloc if available
        // context.read<FollowBloc>().add(UnfollowUser(currentPost.userId));
        // --- MODIFICATION END ---
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Unfollow ${currentPost.ownerName} (not implemented)')),
        );
      },
      onReport: () {
        print("Report selected for post ${currentPost.id}");
        // Show report reason dialog, then dispatch event
        // For now, just dispatch with a placeholder reason
        // --- MODIFICATION START ---
        postBloc.add(ReportPost(currentPost.id, "Reason from dialog")); // Use postBloc directly
        // --- MODIFICATION END ---
         ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Post reported'), duration: Duration(seconds: 1)),
        );
      },
      // Add other callbacks corresponding to your sheet options
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

          // Check the feedback options from the post model
          if (post.showFeedbackOptions) {
            return PostFeedbackOptions(
              ownerName: post.ownerName,
              onReportSubmitted: (reason) {
                // Dispatch ReportPost event instead of HidePost
                context.read<PostBloc>().add(ReportPost(post.id, reason));
              },
              onUndo: () {
                context.read<PostBloc>().add(HidePostFeedbackOptions(post.id));
                // --- MODIFICATION START ---
                // Add closing parenthesis
              },
            );
            // --- MODIFICATION END ---
          }

          // Normal post view
          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8.0),
            elevation: 0.5,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Post header with onShowFeedbackOptions callback
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: PostHeader(
                    ownerName: post.ownerName,
                    ownerImageUrl: post.ownerImageUrl,
                    timePosted: post.timePosted,
                    ownerOccupation: post.ownerOccupation,
                    isSponsored: post.isSponsored,
                    followers: post.followers,
                    userId: post.userId, // Pass the userId here
                    onOptionsPressed: () => _showPostOptions(context, post), // Use the new method
                    onShowFeedbackOptions: () {
                      // Use BLoC event instead of setState
                      context.read<PostBloc>().add(
                        ShowPostFeedbackOptions(post.id),
                      );
                    },
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
                    sharesCount: post.sharedCount,
                    postId: post.id, // Add this line
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
                          currentReaction: post.currentReaction,
                          // Pass postId and context if manager needs to dispatch BLoC events directly
                          // postId: post.id,
                          // context: context,
                        ),
                        onTap: () {
                           // Determine next state based on current reaction
                           final nextReaction = post.currentReaction == null ? 'like' : null;
                           context.read<PostBloc>().add(
                             TogglePostReaction(post.id, nextReaction),
                           );
                        },
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
                        onTap: () {
                          // Dispatch the SharePost event
                          context.read<PostBloc>().add(SharePost(post.id));
                          debugPrint('Share button tapped for post ${post.id}');
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }

        // --- MODIFICATION START ---
        // Add return statement for other states or if post is null
        return const SizedBox.shrink(); // Or a loading indicator/error message
        // --- MODIFICATION END ---
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
