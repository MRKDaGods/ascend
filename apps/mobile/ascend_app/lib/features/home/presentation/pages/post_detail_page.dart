import 'package:ascend_app/features/home/presentation/widgets/common';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_header.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_content.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_image_section.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_engagement_stats.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_reaction_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_action_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_comments_section.dart';
import 'package:ascend_app/features/home/managers/comment_manager.dart';
import 'package:ascend_app/features/home/managers/reaction_manager.dart';
import 'package:ascend_app/features/home/presentation/utils/full_screen_image_viewer.dart';

class PostDetailPage extends StatefulWidget {
  final String title;
  final String description;
  final List<String> images;
  final bool useCarousel;
  final bool isSponsored;
  final String ownerName;
  final String ownerImageUrl;
  final String ownerOccupation;
  final String timePosted;
  final int initialLikes;
  final int initialComments;
  final int followers;
  final List<Comment> comments;
  
  const PostDetailPage({
    super.key,
    required this.title,
    required this.description,
    required this.images,
    required this.useCarousel,
    required this.isSponsored,
    required this.ownerName,
    required this.ownerImageUrl,
    required this.ownerOccupation,
    required this.timePosted,
    required this.initialLikes,
    required this.initialComments,
    required this.followers,
    required this.comments,
  });

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  bool _isLiked = false;
  late int _likesCount;
  late int _commentsCount;
  final TextEditingController _commentController = TextEditingController();
  final FocusNode _commentFocusNode = FocusNode();
  late List<Comment> _comments;
  
  // Reaction state
  String _currentReaction = 'like';
  
  // Create managers
  late CommentManager _commentManager;
  late ReactionManager _reactionManager;

  @override
  void initState() {
    super.initState();
    _likesCount = widget.initialLikes;
    _commentsCount = widget.initialComments;
    _comments = List<Comment>.from(widget.comments);
    
    // Initialize managers
    _commentManager = CommentManager(
      comments: _comments,
      onCommentsChanged: (updatedComments) {
        setState(() {
          _comments.clear();
          _comments.addAll(updatedComments);
          _commentsCount = _getCommentCount(_comments);
        });
      },
    );
    
    _reactionManager = ReactionManager(
      isLiked: _isLiked,
      currentReaction: _currentReaction,
      likesCount: _likesCount,
      onReactionChanged: (isLiked, reaction, count) {
        setState(() {
          _isLiked = isLiked;
          _currentReaction = reaction;
          _likesCount = count;
        });
      },
    );
    
    // Auto-focus comment field
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        _commentFocusNode.requestFocus();
      }
    });
  }
  
  // Calculate total comments including replies
  int _getCommentCount(List<Comment> comments) {
    int count = comments.length;
    for (var comment in comments) {
      count += _getCommentCount(comment.replies);
    }
    return count;
  }
  
  @override
  void dispose() {
    _commentController.dispose();
    _commentFocusNode.dispose();
    super.dispose();
  }

  void _showReactionsPopup() {
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
            _reactionManager.toggleReaction(type);
          },
        );
      },
    );
  }
  
  // Add this new method to handle image taps
  void _handleImageTap(int index) {
    print("Image tapped at index: $index in detail page");
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => FullScreenImageViewer(
          images: widget.images,
          initialIndex: index,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Post Header
              PostHeader(
                ownerName: widget.ownerName,
                ownerImageUrl: widget.ownerImageUrl,
                ownerOccupation: widget.ownerOccupation,
                timePosted: widget.timePosted,
                isSponsored: widget.isSponsored,
                followers: widget.followers,
                onFeedbackSubmitted: (reason) {
                  print("Post removed due to: $reason");
                  Navigator.pop(context); // Close the detail page if post is removed
                },
              ),
              
              // Post Content (Title and Description) - show full description without truncation
              PostContent(
                title: widget.title,
                description: widget.description,
                showFullDescription: true,
              ),

              // Images Section - Make sure to pass the _handleImageTap callback
              if (widget.images.isNotEmpty) ...[
                const SizedBox(height: 10),
                PostImageSection(
                  images: widget.images,
                  useCarousel: widget.useCarousel,
                  isSponsored: widget.isSponsored, // Pass the isSponsored flag
                  onTap: _handleImageTap, // Pass the handler here
                ),
              ],

              // Engagement Stats
              PostEngagementStats(
                likesCount: _likesCount,
                commentsCount: _commentsCount,
                reactionIcon: _reactionManager.getCurrentReactionIcon(),
                reactionColor: _reactionManager.getCurrentReactionColor(),
              ),

              // Divider
              Divider(color: Colors.grey[300], height: 1),
              
              // Reaction Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  PostReactionButton(
                    isLiked: _isLiked,
                    currentReaction: _currentReaction,
                    onTap: () => _reactionManager.toggleReaction(_currentReaction),
                    onLongPress: _showReactionsPopup,
                    reactionIcons: ReactionManager.reactionIcons,
                    reactionColors: ReactionManager.reactionColors,
                  ),
                  PostActionButton(
                    icon: Icons.comment_outlined,
                    label: "Comment",
                    onTap: () {
                      _commentFocusNode.requestFocus();
                    },
                  ),
                  PostActionButton(
                    icon: Icons.repeat,
                    label: "Repost",
                    onTap: () {},
                  ),
                  PostActionButton(
                    icon: Icons.send,
                    label: "Send",
                    onTap: () {},
                  ),
                ],
              ),
              
              // Divider
              Divider(color: Colors.grey[300], height: 1),

              // Comments Section - always visible on detail page
              PostCommentsSection(
                comments: _comments,
                commentController: _commentController,
                commentFocusNode: _commentFocusNode,
                onAddComment: () {
                  if (_commentController.text.trim().isNotEmpty) {
                    _commentManager.addComment(_commentController.text);
                    _commentController.clear();
                  }
                },
                onAddReply: (text, parentId) {
                  if (parentId != null && text.trim().isNotEmpty) {
                    _commentManager.addReply(text, parentId);
                  }
                },
                onReaction: (commentId, reactionType) {
                  // Call the CommentManager's toggleReaction method
                  _commentManager.toggleReaction(commentId, reactionType);
                },
                onTapCommentArea: () {
                  _commentFocusNode.requestFocus();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}