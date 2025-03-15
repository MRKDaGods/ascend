import 'package:ascend_app/features/home/presentation/models/comment_model.dart';
// Add this import
import 'package:ascend_app/features/home/presentation/widgets/comment_form.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment_item.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_action_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_content.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_engagement_stats.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_header.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_image_section.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_reaction_button.dart';
import 'package:ascend_app/features/home/presentation/widgets/post_reactions_popup.dart';
import 'package:flutter/material.dart';

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
  final int followers; // Add followers field
  
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
    this.followers = 0, // Default to 0
  });

  @override
  State<Post> createState() => _PostState();
}

class _PostState extends State<Post> {
  // Add a static property to track the currently active post
  static _PostState? _currentActivePost;
  
  bool _isLiked = false;
  bool _showComments = false;
  late int _likesCount;
  late int _commentsCount;
  final TextEditingController _commentController = TextEditingController();
  final List<Comment> _comments = [];
  final FocusNode _commentFocusNode = FocusNode();
  
  // Add a variable to track the current reaction
  String _currentReaction = 'like'; // Default reaction type

  // Map reactions to their icons
  final Map<String, IconData> _reactionIcons = {
    'like': Icons.thumb_up,
    'love': Icons.favorite,
    'laugh': Icons.sentiment_very_satisfied,
    'wow': Icons.sentiment_satisfied_alt,
    'sad': Icons.sentiment_dissatisfied,
    'angry': Icons.sentiment_very_dissatisfied,
  };
  
  // Map reactions to their colors
  final Map<String, Color> _reactionColors = {
    'like': Colors.blue,
    'love': Colors.red,
    'laugh': Colors.amber,
    'wow': Colors.orange,
    'sad': Colors.blueGrey,
    'angry': Colors.deepOrange,
  };

  @override
  void initState() {
    super.initState();
    _likesCount = widget.initialLikes;
    _commentsCount = widget.initialComments;
    
    // Add some sample comments for demonstration
    _comments.addAll([
      Comment(
        authorName: 'Jane Doe',
        authorImage: 'assets/logo.jpg',
        text: 'Great post! Thanks for sharing.',
        timePosted: '1h ago',
      ),
      Comment(
        authorName: 'John Smith',
        authorImage: 'assets/logo.jpg',
        text: 'I found this very helpful.',
        timePosted: '30m ago',
      ),
    ]);
  }
  
  @override
  void dispose() {
    _commentController.dispose();
    _commentFocusNode.dispose();
    super.dispose();
  }

  // Modified to handle different reaction types
  void _toggleReaction(String reactionType) {
    setState(() {
      if (_isLiked) {
        // If already liked but using a different reaction, just change the reaction
        if (_currentReaction != reactionType) {
          _currentReaction = reactionType;
        } else {
          // If clicking the same reaction, unlike the post
          _likesCount--;
          _isLiked = false;
          _currentReaction = 'like'; // Reset to default
        }
      } else {
        // If not liked, add a like with the selected reaction
        _likesCount++;
        _isLiked = true;
        _currentReaction = reactionType;
      }
    });
  }

  void _addComment() {
    if (_commentController.text.isNotEmpty) {
      setState(() {
        _comments.add(
          Comment(
            authorName: 'You',
            authorImage: 'assets/logo.jpg',
            text: _commentController.text,
            timePosted: 'Just now',
          ),
        );
        _commentsCount++;
        _commentController.clear();
      });
    }
  }

  void _showReactionsPopup() {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final position = renderBox.localToGlobal(Offset.zero);
    
    showDialog(
      context: context,
      barrierColor: Colors.transparent,
      builder: (BuildContext context) {
        return PostReactionsPopup(
          reactionIcons: _reactionIcons,
          reactionColors: _reactionColors,
          position: position,
          onReactionSelected: (type) {
            Navigator.of(context).pop();
            _toggleReaction(type);
          },
        );
      },
    );
  }

  // Update the _toggleComments method:
  void _toggleComments() {
    setState(() {
      _showComments = !_showComments;
      
      // If comments are now showing
      if (_showComments) {
        // If there's another active post, close its comments
        if (_currentActivePost != null && _currentActivePost != this) {
          _currentActivePost!._showComments = false;
          _currentActivePost!.setState(() {});
        }
        
        // Set this as the current active post
        _currentActivePost = this;
        
        // Focus the comment field after rendering
        Future.delayed(const Duration(milliseconds: 300), () {
          if (mounted) {
            _commentFocusNode.requestFocus();
          }
        });
      } else {
        // If comments are hidden and this was the active post, clear it
        if (_currentActivePost == this) {
          _currentActivePost = null;
        }
        
        // Ensure the keyboard is dismissed when comments are closed
        _commentFocusNode.unfocus();
      }
    });
  }
  
  // Add a tap handler for the comment area to allow clicking without focusing
  void _handleCommentAreaTap() {
    // Only set current active post, but don't focus input
    if (_currentActivePost != null && _currentActivePost != this) {
      _currentActivePost!._showComments = false;
      _currentActivePost!.setState(() {});
    }
    _currentActivePost = this;
  }
  
  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Post Header with followers for sponsored posts
            PostHeader(
              ownerName: widget.ownerName,
              ownerImageUrl: widget.ownerImageUrl,
              ownerOccupation: widget.ownerOccupation,
              timePosted: widget.timePosted,
              isSponsored: widget.isSponsored,
              followers: widget.followers, // Pass followers count
            ),
            
            // Post Content (Title and Description)
            PostContent(
              title: widget.title,
              description: widget.description,
            ),

            // Images Section
            if (widget.images.isNotEmpty) ...[
              const SizedBox(height: 10),
              PostImageSection(
                images: widget.images,
                useCarousel: widget.useCarousel,
              ),
            ],

            // Engagement Stats
            PostEngagementStats(
              likesCount: _likesCount,
              commentsCount: _commentsCount,
              reactionIcon: _isLiked ? _reactionIcons[_currentReaction]! : Icons.thumb_up,
              reactionColor: _isLiked ? _reactionColors[_currentReaction] : null,
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
                  onTap: () => _toggleReaction(_currentReaction),
                  onLongPress: _showReactionsPopup,
                  reactionIcons: _reactionIcons,
                  reactionColors: _reactionColors,
                ),
                PostActionButton(
                  icon: Icons.comment_outlined,
                  label: "Comment",
                  onTap: _toggleComments, // Use the new method
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

            // Comments Section
            if (_showComments) ...[
              const SizedBox(height: 10),
              GestureDetector(
                // This allows tapping on the comments area without focusing the input
                onTap: _handleCommentAreaTap,
                // Make sure it doesn't interfere with actual comment interaction
                behavior: HitTestBehavior.translucent,
                child: Column(
                  children: _comments.map((comment) => CommentItem(comment: comment)).toList(),
                ),
              ),
              
              // Add Comment Form
              CommentForm(
                controller: _commentController,
                focusNode: _commentFocusNode, // Add this line
                onSubmit: _addComment,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
