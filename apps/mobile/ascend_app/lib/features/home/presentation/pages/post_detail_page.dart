import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/core/di/service_locator.dart';
import 'package:ascend_app/features/home/domain/models/post_model.dart';
import 'package:ascend_app/features/home/domain/repositories/post_repository.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/post_bloc.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/post_event.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/post_state.dart';
import 'package:ascend_app/features/home/presentation/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_header.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_content.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_image_section.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_engagement_stats.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_action_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_comments_section.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_reactions_popup.dart';
import 'package:ascend_app/features/home/presentation/widgets/full_screen_image_viewer.dart';
import 'package:ascend_app/features/home/presentation/managers/comment_manager.dart';
import 'package:ascend_app/features/home/presentation/managers/reaction_manager.dart';

class PostDetailPage extends StatefulWidget {
  final String postId;
  
  const PostDetailPage({
    super.key,
    required this.postId,
  });

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  final TextEditingController _commentController = TextEditingController();
  final FocusNode _commentFocusNode = FocusNode();
  late CommentManager _commentManager;
  
  List<Comment> _comments = [];
  bool _isLiked = false;
  String _currentReaction = 'like';
  int _likesCount = 0;
  int _commentsCount = 0;
  
  @override
  void initState() {
    super.initState();
    _commentManager = CommentManager(
      comments: _comments,
      onCommentsChanged: (updatedComments) {
        setState(() {
          _comments = updatedComments;
          _commentsCount = _getCommentCount(_comments);
        });
      },
    );
    
    // Initial focus for comment field (optional)
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        _commentFocusNode.requestFocus();
      }
    });
  }
  
  @override
  void dispose() {
    _commentController.dispose();
    _commentFocusNode.dispose();
    super.dispose();
  }
  
  // Calculate total comments including replies
  int _getCommentCount(List<Comment> comments) {
    int count = comments.length;
    for (var comment in comments) {
      count += _getCommentCount(comment.replies);
    }
    return count;
  }
  
  void _showReactionsPopup(BuildContext context) {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final position = renderBox.localToGlobal(Offset.zero);
    
    showDialog(
      context: context,
      barrierColor: Colors.transparent,
      builder: (BuildContext context) {
        return PostReactionsPopup(
          reactionIcons: ReactionManager.reactionIcons,
          reactionColors: ReactionManager.reactionColors,
          position: position,
          onReactionSelected: (type) {
            Navigator.of(context).pop();
            context.read<PostBloc>().add(LikePost(
              postId: widget.postId,
              reactionType: type,
            ));
          },
        );
      },
    );
  }
  
  void _handleImageTap(int index, List<String> images) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => FullScreenImageViewer(
          images: images,
          initialIndex: index,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => PostBloc(
        postRepository: serviceLocator<PostRepository>(),
      )..add(FetchPosts()),
      child: Builder(
        builder: (context) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Post'),
              leading: IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
            body: BlocBuilder<PostBloc, PostState>(
              builder: (context, state) {
                if (state is PostsLoading) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is PostsLoaded) {
                  // Find the post with the matching ID
                  final post = state.posts.firstWhere(
                    (p) => p.id == widget.postId,
                    orElse: () => throw Exception('Post not found'),
                  );
                  
                  // Update local state from post
                  _isLiked = post.isLiked;
                  _currentReaction = post.currentReaction;
                  _likesCount = post.likesCount;
                  _commentsCount = post.commentsCount;
                  
                  return _buildPostDetail(context, post);
                } else if (state is PostError) {
                  return Center(child: Text('Error: ${state.message}'));
                }
                return const Center(child: Text('Loading post...'));
              },
            ),
          );
        }
      ),
    );
  }
  
  Widget _buildPostDetail(BuildContext context, PostModel post) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Post Header
            PostHeader(
              post: post,
            ),
            
            const SizedBox(height: 12),
            
            // Post Content
            PostContent(
              title: post.title,
              description: post.description,
              showFullDescription: true,
            ),

            // Images Section
            if (post.images.isNotEmpty) ...[
              const SizedBox(height: 12),
              PostImageSection(
                images: post.images,
                useCarousel: post.useCarousel,
                isSponsored: post.isSponsored,
                onTap: (index) => _handleImageTap(index, post.images),
              ),
            ],

            const SizedBox(height: 16),
            
            // Engagement Stats
            PostEngagementStats(
              likesCount: post.likesCount,
              commentsCount: post.commentsCount,
              reactionIcon: _getReactionIcon(post.currentReaction),
              reactionColor: _getReactionColor(post.currentReaction),
            ),

            // Divider
            Divider(color: Colors.grey[300], height: 1),
            
            // Reaction Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                // Like/React button
                GestureDetector(
                  onTap: () {
                    context.read<PostBloc>().add(LikePost(
                      postId: post.id,
                      reactionType: post.currentReaction,
                    ));
                  },
                  onLongPress: () => _showReactionsPopup(context),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      children: [
                        Icon(
                          _getReactionIcon(post.currentReaction),
                          color: post.isLiked 
                            ? _getReactionColor(post.currentReaction) 
                            : Colors.grey,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          post.isLiked 
                            ? post.currentReaction.capitalize() 
                            : 'Like',
                          style: TextStyle(
                            color: post.isLiked 
                              ? _getReactionColor(post.currentReaction) 
                              : Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Comment button
                PostActionButton(
                  icon: Icons.comment_outlined,
                  label: "Comment",
                  onTap: () {
                    _commentFocusNode.requestFocus();
                  },
                ),
                
                // Repost button
                PostActionButton(
                  icon: Icons.repeat,
                  label: "Repost",
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Repost feature coming soon')),
                    );
                  },
                ),
                
                // Share button
                PostActionButton(
                  icon: Icons.send,
                  label: "Send",
                  onTap: () {
                    context.read<PostBloc>().add(SharePost(postId: post.id));
                  },
                ),
              ],
            ),
            
            // Divider
            Divider(color: Colors.grey[300], height: 1),

            // Comments Section
            PostCommentsSection(
              comments: _comments,
              commentController: _commentController,
              commentFocusNode: _commentFocusNode,
              onAddComment: () {
                if (_commentController.text.trim().isNotEmpty) {
                  // Add comment through BLoC
                  context.read<PostBloc>().add(AddComment(
                    postId: post.id,
                    comment: _commentController.text,
                  ));
                  
                  // Also update local state through manager
                  _commentManager.addComment(_commentController.text);
                  _commentController.clear();
                }
              },
              onAddReply: (text, parentId) {
                if (parentId != null && text.trim().isNotEmpty) {
                  _commentManager.addReply(text, parentId);
                }
              },
              onTapCommentArea: () {
                _commentFocusNode.requestFocus();
              },
            ),
          ],
        ),
      ),
    );
  }
  
  // Helper methods for reactions
  IconData _getReactionIcon(String reaction) {
    return ReactionManager.reactionIcons[reaction] ?? ReactionManager.reactionIcons['like']!;
  }
  
  Color _getReactionColor(String reaction) {
    return ReactionManager.reactionColors[reaction] ?? ReactionManager.reactionColors['like']!;
  }
}

// String utility extension
extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1)}";
  }
}