import 'package:ascend_app/features/home/presentation/utils/full_screen_image_viewer.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_state.dart';
import 'package:ascend_app/features/profile/models/user_profile_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/post_bloc/post_bloc.dart';
import '../../bloc/post_bloc/post_event.dart';
import '../../bloc/post_bloc/post_state.dart';
import '../../models/post_model.dart';
import 'package:ascend_app/features/home/managers/reaction_manager.dart';
import 'package:ascend_app/features/home/presentation/utils/reaction_utils.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_header.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_content.dart';
import 'package:ascend_app/features/home/presentation/widgets/image/post_image_section.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_engagement_stats.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_action_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/reaction/reaction_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/post_comments_section.dart';
import 'package:ascend_app/features/home/presentation/pages/comment_detail_page.dart';

class PostDetailPage extends StatefulWidget {
  final String postId;

  const PostDetailPage({super.key, required this.postId});

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  final TextEditingController _commentController = TextEditingController();
  final FocusNode _commentFocusNode = FocusNode();
  final GlobalKey _reactionButtonKey = GlobalKey();

  @override
  void dispose() {
    _commentController.dispose();
    _commentFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostBloc, PostState>(
      builder: (context, state) {
        if (state is PostsLoaded) {
          final post = state.posts.firstWhere(
            (p) => p.id == widget.postId,
            orElse: () => PostModel.empty(),
          );

          return BlocBuilder<UserProfileBloc, UserProfileState>(
            builder: (context, profileState) {
              final userProfile =
                  profileState is UserProfileLoaded
                      ? profileState.profile
                      : UserProfileModel.empty();

              if (post.id.isEmpty) {
                return Scaffold(
                  appBar: AppBar(title: const Text('Post not found')),
                  body: const Center(child: Text('Post not found')),
                );
              }

              return Scaffold(
                appBar: AppBar(
                  title: const Text('Post'),
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  elevation: 1,
                ),
                body: Column(
                  children: [
                    // Scrollable content
                    Expanded(
                      child: SingleChildScrollView(
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
                                onOptionsPressed: () {},
                                onHidePost: (reason) {
                                  context.read<PostBloc>().add(
                                    HidePost(post.id, reason),
                                  );
                                },
                              ),
                            ),

                            // Post content
                            if (post.description.isNotEmpty)
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16.0,
                                ),
                                child: PostContent(
                                  title: post.title,
                                  description: post.description,
                                ),
                              ),

                            // Post images
                            if (post.images.isNotEmpty)
                              PostImageSection(
                                images: post.images,
                                useCarousel: post.useCarousel,
                                onTapImage: (index) {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (_) => FullScreenImageViewer(
                                            images: post.images,
                                            initialIndex: index,
                                            postId: post.id,
                                          ),
                                    ),
                                  );
                                },
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
                                postId: post.id,
                              ),
                            ),

                            const Divider(height: 1),

                            // Action buttons
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8.0,
                              ),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceEvenly,
                                children: [
                                  // Like/React button
                                  ReactionButton(
                                    key: _reactionButtonKey,
                                    manager: ReactionManager(
                                      isLiked: post.isLiked,
                                      currentReaction: post.currentReaction,
                                      postId: post.id,
                                      context: context,
                                    ),
                                    onLongPressStart: () {
                                      final RenderBox box =
                                          _reactionButtonKey.currentContext!
                                                  .findRenderObject()
                                              as RenderBox;
                                      final position = box.localToGlobal(
                                        Offset.zero,
                                      );

                                      ReactionUtils.showReactionsPopup(
                                        context: context,
                                        position: position,
                                        itemId: post.id,
                                        isComment: false,
                                        onReactionSelected:
                                            (id, reaction) =>
                                                context.read<PostBloc>().add(
                                                  TogglePostReaction(
                                                    id,
                                                    reaction,
                                                  ),
                                                ),
                                      );
                                    },
                                    onLongPressEnd: () {},
                                  ),

                                  // Comment button
                                  PostActionButton(
                                    icon: Icons.comment_outlined,
                                    label: 'Comment',
                                    onTap: () {
                                      _commentFocusNode.requestFocus();
                                    },
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

                            const Divider(),

                            // Comments section - Using PostCommentsSection widget
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: PostCommentsSection(
                                currentUserName: userProfile.name,
                                currentUserAvatarUrl: userProfile.avatarUrl,
                                comments: post.comments,
                                commentController: _commentController,
                                commentFocusNode: _commentFocusNode,
                                currentUserId: userProfile.id,
                                onCommentsChanged: (updatedComments) {
                                  context.read<PostBloc>().add(
                                    UpdatePostComments(
                                      post.id,
                                      updatedComments,
                                    ),
                                  );
                                },
                                onTapCommentArea: () {
                                  _commentFocusNode.requestFocus();
                                },
                                onReaction: (commentId, reactionType) {
                                  context.read<PostBloc>().add(
                                    ToggleCommentReaction(
                                      post.id,
                                      commentId,
                                      reactionType,
                                    ),
                                  );
                                },
                                onNavigateToReply: (parentComment, replyingTo) {
                                  // Navigate to CommentDetailPage
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) => CommentDetailPage(
                                            parentComment: parentComment,
                                            replyingTo: replyingTo,
                                            currentUserId: userProfile.id,
                                            onAddReply: (text, parentId) {
                                              context.read<PostBloc>().add(
                                                AddCommentReply(
                                                  post.id,
                                                  parentId,
                                                  text,
                                                  userProfile.id,
                                                  userProfile.name,
                                                  userProfile.avatarUrl,
                                                ),
                                              );
                                            },
                                            onReaction: (
                                              commentId,
                                              reactionType,
                                            ) {
                                              context.read<PostBloc>().add(
                                                ToggleCommentReaction(
                                                  post.id,
                                                  commentId,
                                                  reactionType,
                                                ),
                                              );
                                            },
                                            postId: '',
                                          ),
                                    ),
                                  );
                                },
                                postId: post.id,
                                onAddComment: (text, parentId) {
                                  if (parentId == null) {
                                    // Adding a top-level comment
                                    context.read<PostBloc>().add(
                                      AddComment(
                                        post.id,
                                        text,
                                        userProfile.id,
                                        userProfile.name,
                                        userProfile.avatarUrl,
                                      ),
                                    );
                                  } else {
                                    // Adding a reply
                                    context.read<PostBloc>().add(
                                      AddCommentReply(
                                        post.id,
                                        parentId,
                                        text,
                                        userProfile.id,
                                        userProfile.name,
                                        userProfile.avatarUrl,
                                      ),
                                    );
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        }

        return Scaffold(
          appBar: AppBar(title: const Text('Loading...')),
          body: const Center(child: CircularProgressIndicator()),
        );
      },
    );
  }

  IconData _getReactionIcon(PostModel post) {
    if (!post.isLiked) return Icons.thumb_up_outlined;
    return ReactionManager.reactionIcons[post.currentReaction] ??
        Icons.thumb_up;
  }

  Color _getReactionColor(PostModel post) {
    if (!post.isLiked) return Colors.grey;
    return ReactionManager.reactionColors[post.currentReaction] ?? Colors.blue;
  }
}
