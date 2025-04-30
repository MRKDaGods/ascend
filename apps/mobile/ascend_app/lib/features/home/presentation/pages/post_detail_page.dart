import 'package:ascend_app/features/home/bloc/post_bloc/post_event.dart'; // Import PostEvent
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
import 'package:ascend_app/features/home/presentation/utils/sheet_helpers.dart';

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
  void initState() {
    super.initState();
    // Dispatch LoadComments when the page initializes
    // Use addPostFrameCallback to ensure context is available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) { // Check if the widget is still in the tree
        // Check if comments are already loaded or partially loaded to avoid redundant calls (optional)
        final currentState = context.read<PostBloc>().state;
        bool shouldLoad = true;
        if (currentState is PostsLoaded) {
          final post = currentState.getPostById(widget.postId);
          // Example: Only load if comments list is empty
          if (post != null && post.comments.isNotEmpty) {
             debugPrint('🔄 [PostDetailPage] Comments already present for post ${widget.postId}. Skipping initial LoadComments.');
             shouldLoad = false;
          }
        }

        if (shouldLoad) {
           debugPrint('🔄 [PostDetailPage] Dispatching initial LoadComments for post ${widget.postId}');
           context.read<PostBloc>().add(LoadComments(widget.postId));
        }
      }
    });
  }

  @override
  void dispose() {
    _commentController.dispose();
    _commentFocusNode.dispose();
    super.dispose();
  }

  void _showPostOptionsBottomSheet(BuildContext context, PostModel post) {
    final postBloc = BlocProvider.of<PostBloc>(context);
    final state = postBloc.state;
    PostModel? currentPost;

    if (state is PostsLoaded) {
      currentPost = state.posts.firstWhere(
        (p) => p.id == post.id,
        orElse: () => post,
      );
    } else {
      currentPost = post;
    }

    final bool isCurrentlySaved = currentPost.isSaved ?? post.isSaved;

    SheetHelpers.showPostOptionsSheet(
      context: context,
      ownerName: post.ownerName,
      showSave: true,
      showShare: true,
      showNotInterested: true,
      showUnfollow: true,
      showReport: true,
      showMessage: false,
      reportText: 'Report Post',
      onSave: () {
        if (isCurrentlySaved) {
          postBloc.add(UnsavePost(post.id));
          debugPrint("[PostDetailPage] Dispatching UnsavePost for ${post.id}");
        } else {
          postBloc.add(SavePost(post.id));
          debugPrint("[PostDetailPage] Dispatching SavePost for ${post.id}");
        }
      },
      onShare: () {
        postBloc.add(SharePost(post.id));
        debugPrint("[PostDetailPage] Dispatching SharePost for ${post.id}");
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Sharing post...')));
      },
      onNotInterested: () {
        _showHideConfirmationDialog(context, post.id);
      },
      onUnfollow: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Unfollow ${post.ownerName} (not implemented)'),
          ),
        );
      },
      onReport: () {
        Navigator.of(context).pop();
        _showReportReasonDialog(context, post.id);
      },
    );
  }

  void _showReportReasonDialog(BuildContext context, String postId) {
    String selectedReason = 'General report'; // Initial value

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        // Use StatefulBuilder to manage the state within the dialog
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Report Post'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const Text('Please select a reason for reporting:'),
                  ListTile(
                    title: const Text('Spam'),
                    leading: Radio<String>(
                      value: 'Spam',
                      groupValue: selectedReason,
                      onChanged: (String? value) {
                        if (value != null) {
                          // Use setState from StatefulBuilder to update the selection
                          setState(() {
                            selectedReason = value;
                          });
                        }
                      },
                    ),
                    onTap: () {
                      // Allow tapping the whole row
                      setState(() {
                        selectedReason = 'Spam';
                      });
                    },
                  ),
                  ListTile(
                    title: const Text('Inappropriate Content'),
                    leading: Radio<String>(
                      value: 'Inappropriate Content',
                      groupValue: selectedReason,
                      onChanged: (String? value) {
                        if (value != null) {
                          // Use setState from StatefulBuilder to update the selection
                          setState(() {
                            selectedReason = value;
                          });
                        }
                      },
                    ),
                    onTap: () {
                      // Allow tapping the whole row
                      setState(() {
                        selectedReason = 'Inappropriate Content';
                      });
                    },
                  ),
                  // Add more reasons as needed following the same pattern
                ],
              ),
              actions: <Widget>[
                TextButton(
                  child: const Text('Cancel'),
                  onPressed: () {
                    Navigator.of(dialogContext).pop();
                  },
                ),
                TextButton(
                  child: const Text('Submit Report'),
                  onPressed: () {
                    // Now selectedReason will hold the user's choice
                    BlocProvider.of<PostBloc>(
                      context,
                    ).add(ReportPost(postId, selectedReason));
                    debugPrint(
                      "[PostDetailPage] Dispatching ReportPost for $postId with reason: $selectedReason",
                    );
                    Navigator.of(dialogContext).pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Post reported. Thank you.'),
                      ),
                    );
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showHideConfirmationDialog(BuildContext context, String postId) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: const Text('Hide Post?'),
          content: const Text(
            'Are you sure you want to hide this post? You will not see it again.',
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(dialogContext).pop();
              },
            ),
            TextButton(
              child: const Text('Hide'),
              onPressed: () {
                BlocProvider.of<PostBloc>(
                  context,
                ).add(HidePost(postId, 'User chose to hide'));
                Navigator.of(dialogContext).pop();
                if (Navigator.canPop(context)) {
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostBloc, PostState>(
      builder: (context, state) {
        debugPrint(
          '🔄 [PostDetailPage] BlocBuilder running. State type: ${state.runtimeType}',
        );

        if (state is PostsLoaded) {
          final post = state.posts.firstWhere(
            (p) => p.id == widget.postId,
            orElse: () => PostModel.empty(),
          );

          debugPrint(
            '📄 [PostDetailPage] Displaying post ${post.id}. Comments count: ${post.commentsCount}, Comments list size: ${post.comments.length}',
          );
          if (post.comments.isNotEmpty) {
            debugPrint(
              '📄 [PostDetailPage] Last comment ID: ${post.comments.last.id}, Text: ${post.comments.last.text}',
            );
          }

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
                    Expanded(
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: PostHeader(
                                ownerName: post.ownerName,
                                userId: post.userId,
                                ownerImageUrl: post.ownerImageUrl,
                                timePosted: post.timePosted,
                                ownerOccupation: post.ownerOccupation,
                                isSponsored: post.isSponsored,
                                followers: post.followers,
                                onOptionsPressed:
                                    () => _showPostOptionsBottomSheet(
                                      context,
                                      post,
                                    ),
                                onHidePost: (reason) {
                                  context.read<PostBloc>().add(
                                    HidePost(post.id, reason),
                                  );
                                },
                              ),
                            ),
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
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16.0,
                                vertical: 8.0,
                              ),
                              child: PostEngagementStats(
                                likesCount: post.likesCount,
                                sharesCount: post.sharedCount,
                                commentsCount: post.commentsCount,
                                postId: post.id,
                              ),
                            ),
                            const Divider(height: 1),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8.0,
                              ),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceEvenly,
                                children: [
                                  ReactionButton(
                                    key: _reactionButtonKey,
                                    manager: ReactionManager(
                                      currentReaction: post.currentReaction,
                                      postId: post.id, // Keep for Bloc updates
                                      context: context, // Keep for Bloc updates
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
                                  PostActionButton(
                                    icon: Icons.comment_outlined,
                                    label: 'Comment',
                                    onTap: () {
                                      _commentFocusNode.requestFocus();
                                    },
                                  ),
                                  PostActionButton(
                                    icon: Icons.share_outlined,
                                    label: 'Share',
                                    onTap: () {
                                      context.read<PostBloc>().add(
                                        SharePost(post.id),
                                      );
                                      debugPrint(
                                        'Share button tapped for post ${post.id} from detail page',
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                            const Divider(),
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: PostCommentsSection(
                                currentUserName:
                                    userProfile.name.isNotEmpty
                                        ? userProfile.name
                                        : "You",
                                currentUserAvatarUrl:
                                    userProfile.avatarUrl.isNotEmpty
                                        ? userProfile.avatarUrl
                                        : 'assets/images/profile/EmptyUser.png',
                                comments: post.comments,
                                commentController: _commentController,
                                commentFocusNode: _commentFocusNode,
                                currentUserId:
                                    userProfile.id.isNotEmpty
                                        ? userProfile.id
                                        : 'default_user_id',
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
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) => CommentDetailPage(
                                            parentComment: parentComment,
                                            replyingTo: replyingTo,
                                            currentUserId:
                                                userProfile.id.isNotEmpty
                                                    ? userProfile.id
                                                    : 'default_user_id',
                                            onAddReply: (text, parentId) {
                                              context.read<PostBloc>().add(
                                                AddCommentReply(
                                                  post.id,
                                                  parentId,
                                                  text,
                                                  userProfile.id.isNotEmpty
                                                      ? userProfile.id
                                                      : 'default_user_id',
                                                  userProfile.name.isNotEmpty
                                                      ? userProfile.name
                                                      : "You",
                                                  userProfile
                                                          .avatarUrl
                                                          .isNotEmpty
                                                      ? userProfile.avatarUrl
                                                      : 'assets/images/profile/EmptyUser.png',
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
                                            postId: post.id,
                                          ),
                                    ),
                                  );
                                },
                                postId: post.id,
                                onAddComment: (text, parentId) {
                                  final userId =
                                      userProfile.id.isNotEmpty
                                          ? userProfile.id
                                          : 'default_user_id';
                                  final userName =
                                      userProfile.name.isNotEmpty
                                          ? userProfile.name
                                          : "You";
                                  final userAvatar =
                                      userProfile.avatarUrl.isNotEmpty
                                          ? userProfile.avatarUrl
                                          : 'assets/images/profile/EmptyUser.png';

                                  if (parentId == null) {
                                    context.read<PostBloc>().add(
                                      AddComment(
                                        post.id,
                                        text,
                                        userId,
                                        userName,
                                        userAvatar,
                                      ),
                                    );
                                  } else {
                                    context.read<PostBloc>().add(
                                      AddCommentReply(
                                        post.id,
                                        parentId,
                                        text,
                                        userId,
                                        userName,
                                        userAvatar,
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
}
