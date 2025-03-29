import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/utils/full_screen_image_viewer.dart';
import 'package:ascend_app/features/home/presentation/widgets/common';
import 'package:ascend_app/features/home/presentation/widgets/post/post_action_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_engagement_stats.dart';
import 'package:ascend_app/features/home/presentation/widgets/reaction/post_reaction_button.dart';
import 'package:ascend_app/features/home/managers/reaction_manager.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/data/sample_comments.dart';
import 'package:ascend_app/features/home/presentation/pages/post_detail_page.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_header.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_content.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_image_section.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_feedback_options.dart';

class Post extends StatefulWidget {
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
  final VoidCallback? onRemove;
  
  const Post({
    super.key,
    this.title = '',
    this.description = '',
    this.images = const [],
    this.useCarousel = false,
    this.isSponsored = false,
    this.ownerName = 'Anonymous User',
    this.ownerImageUrl = 'assets/logo.jpg',
    this.ownerOccupation = '',
    this.timePosted = '2h ago',
    this.initialLikes = 0,
    this.initialComments = 0,
    this.followers = 0,
    this.onRemove,
  });

  @override
  State<Post> createState() => _PostState();
}

class _PostState extends State<Post> {
  bool _showFeedbackOptions = false;
  bool _isLiked = false;
  late int _likesCount;
  late int _commentsCount;
  final List<Comment> _comments = [];
  
  // Reaction state
  String _currentReaction = 'like';
  
  // Create managers
  late ReactionManager _reactionManager;

  @override
  void initState() {
    super.initState();
    _likesCount = widget.initialLikes;
    _commentsCount = widget.initialComments;
    
    // Initialize managers
    
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
    
    // Add sample comments from the dedicated class
    _comments.addAll(SampleComments.getDefaultComments());
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

  void _navigateToPostDetail() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => PostDetailPage(
          title: widget.title,
          description: widget.description,
          images: widget.images,
          useCarousel: widget.useCarousel,
          isSponsored: widget.isSponsored,
          ownerName: widget.ownerName,
          ownerImageUrl: widget.ownerImageUrl,
          ownerOccupation: widget.ownerOccupation,
          timePosted: widget.timePosted,
          initialLikes: _likesCount,
          initialComments: _commentsCount,
          followers: widget.followers,
          comments: List<Comment>.from(_comments),
        ),
      ),
    );
  }
  
  // Add this new method to handle image taps
  void _handleImageTap(int index) {
    print("Image tapped at index: $index");
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
    if (_showFeedbackOptions) {
      // Show feedback options when X is clicked
      return PostFeedbackOptions(
        ownerName: widget.ownerName,
        onFeedbackSubmitted: (reason) {
          // Handle feedback submission
          print('Feedback submitted: $reason');
          
          // Call the parent's onRemove callback if it exists
          if (widget.onRemove != null) {
            widget.onRemove!();
          }
        },
        onUndo: () {
          // Restore the post to its original state
          setState(() {
            _showFeedbackOptions = false;
          });
        },
      );
    }

    // Show normal post
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Post Header with options and remove functionality
            PostHeader(
              ownerName: widget.ownerName,
              ownerImageUrl: widget.ownerImageUrl,
              ownerOccupation: widget.ownerOccupation,
              timePosted: widget.timePosted,
              isSponsored: widget.isSponsored,
              followers: widget.followers,
              // onOptionsPressed removed to use default behavior
              onFeedbackSubmitted: (reason) {
                print("Post removed due to: $reason");
                // Handle the removal based on the reason
                
                // Call the parent's onRemove callback if it exists
                if (widget.onRemove != null) {
                  widget.onRemove!();
                }
              },
              onShowFeedbackOptions: () {
                setState(() {
                  _showFeedbackOptions = true;
                });
              },
            ),
            
            // Post Content (Title and Description)
            PostContent(
              title: widget.title,
              description: widget.description,
              onTap: _navigateToPostDetail,
            ),

            // Images Section - now using the grid layout
            if (widget.images.isNotEmpty) ...[
              const SizedBox(height: 10),
              PostImageSection(
                images: widget.images,
                useCarousel: widget.useCarousel,
                isSponsored: widget.isSponsored, // Pass the isSponsored flag
                onTap: _handleImageTap,
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
                  onTap: _navigateToPostDetail,
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
          ],
        ),
      ),
    );
  }
}
