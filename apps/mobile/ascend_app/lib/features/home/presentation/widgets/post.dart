import 'package:ascend_app/features/home/presentation/widgets/post_images_grid_shape.dart';
import 'package:ascend_app/features/home/presentation/widgets/reactions_post.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:readmore/readmore.dart';

class Post extends StatefulWidget {
  final String title;
  final String description;
  final List<String> images;
  final bool useCarousel;
  final bool isSponsored;
  final String ownerName;
  final String ownerImageUrl;
  final String timePosted;
  final int initialLikes;
  final int initialComments;
  
  const Post({
    super.key,
    this.title = '',  // Default empty string
    this.description = '',  // Default empty string
    this.images = const [],  // Default empty list
    this.useCarousel = false,  // Default false
    this.isSponsored = false,  // Default false
    this.ownerName = 'Anonymous User',  // Default name
    this.ownerImageUrl = 'assets/logo.jpg',  // Default avatar
    this.timePosted = '2h ago',  // Default time
    this.initialLikes = 0,  // Default 0
    this.initialComments = 0,  // Default 0
  });

  @override
  State<Post> createState() => _PostState();
}

class _PostState extends State<Post> {
  bool _isLiked = false;
  bool _showComments = false;
  late int _likesCount;
  late int _commentsCount;
  final TextEditingController _commentController = TextEditingController();
  final List<Comment> _comments = [];
  
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
    'wow': Colors.amber,
    'sad': Colors.amber,
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

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// **Post Owner Info**
            Row(
              children: [
                CircleAvatar(
                  backgroundImage: AssetImage(widget.ownerImageUrl),
                  radius: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.ownerName,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        widget.timePosted,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                if (widget.isSponsored)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'Sponsored',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  ),
              ],
            ),

            /// **Title**
            if (widget.title.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                widget.title,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],

            /// **Description with Read More**
            if (widget.description.isNotEmpty) ...[
              const SizedBox(height: 8),
              SizedBox(
                width: MediaQuery.of(context).size.width * 0.9,
                child: ReadMoreText(
                  widget.description,
                  trimMode: TrimMode.Line,
                  trimLines: 4,
                  trimCollapsedText: 'Show more',
                  trimExpandedText: 'Show less',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.normal),
                  moreStyle: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                  lessStyle: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],

            /// **Images - Either Grid or Carousel based on choice**
            if (widget.images.isNotEmpty) ...[
              const SizedBox(height: 10),
              _buildImageSection(),
            ],

            /// **Engagement Stats**
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Row(
                children: [
                  Icon(
                    _isLiked ? _reactionIcons[_currentReaction] : Icons.thumb_up,
                    size: 16,
                    color: _isLiked ? _reactionColors[_currentReaction] : Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$_likesCount likes',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    '$_commentsCount comments',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                ],
              ),
            ),

            /// **Divider**
            Divider(color: Colors.grey[300], height: 1),
            
            /// **Reaction Buttons**
            _buildReactionRow(context),
            
            /// **Divider**
            Divider(color: Colors.grey[300], height: 1),

            /// **Comments Section**
            if (_showComments) ...[
              const SizedBox(height: 10),
              ..._comments.map((comment) => _buildCommentItem(comment)),
              
              /// **Add Comment Form**
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Row(
                  children: [
                    const CircleAvatar(
                      backgroundImage: AssetImage('assets/logo.jpg'),
                      radius: 16,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _commentController,
                        decoration: const InputDecoration(
                          hintText: 'Add a comment...',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.symmetric(
                            vertical: 8.0,
                            horizontal: 12.0,
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.send),
                      onPressed: _addComment,
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  /// **📸 Image Grid or Carousel based on useCarousel flag**
  Widget _buildImageSection() {
    if (widget.useCarousel) {
      return CarouselSlider(
        options: CarouselOptions(
          height: 200,
          viewportFraction: 0.9,
          enlargeCenterPage: true,
          enableInfiniteScroll: widget.images.length > 1,
          autoPlay: false,
        ),
        items: widget.images.map((imageUrl) {
          return Builder(
            builder: (BuildContext context) {
              return Container(
                width: MediaQuery.of(context).size.width,
                margin: const EdgeInsets.symmetric(horizontal: 5.0),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.asset(
                    imageUrl,
                    fit: BoxFit.cover,
                  ),
                ),
              );
            },
          );
        }).toList(),
      );
    } else {
      // Use grid layout
      return ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: ImagesGridShape(imageCount: widget.images.length, images: widget.images),
      );
    }
  }

  /// **💙 Post Bottom Row with Reaction Buttons**
  Widget _buildReactionRow(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildReactionButton(),
        _postButton(
          Icons.comment_outlined,
          "Comment",
          null,
          () => setState(() => _showComments = !_showComments),
        ),
        _postButton(Icons.repeat, "Repost", null, () {}),
        _postButton(Icons.send, "Send", null, () {}),
      ],
    );
  }

  /// **👍 Reaction Button with Popup**
  Widget _buildReactionButton() {
    return GestureDetector(
      onTap: () => _toggleReaction(_currentReaction),
      onLongPress: _showReactionsPopup,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: [
            Icon(
              _isLiked ? _reactionIcons[_currentReaction] : Icons.thumb_up_outlined,
              size: 20,
              color: _isLiked ? _reactionColors[_currentReaction] : null,
            ),
            const SizedBox(width: 4),
            Text(
              _isLiked ? _currentReaction.capitalize() : "Like",
              style: TextStyle(
                fontSize: 12,
                color: _isLiked ? _reactionColors[_currentReaction] : null,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// **🏷 Single Action Button**
  Widget _postButton(IconData icon, String label, Color? color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(fontSize: 12, color: color),
            ),
          ],
        ),
      ),
    );
  }

  /// **💬 Show Reactions Popup**
  void _showReactionsPopup() {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final position = renderBox.localToGlobal(Offset.zero);
    
    // Show reactions popup
    showDialog(
      context: context,
      barrierColor: Colors.transparent,
      builder: (BuildContext context) {
        final screenWidth = MediaQuery.of(context).size.width;
        
        return Stack(
          children: [
            Positioned(
              // Center horizontally on the screen, but with some constraints
              // This will make it dynamically sized but centered
              left: 0,
              right: 0,
              // Position above the like button with some spacing
              top: position.dy +280,
              child: Center(
                child: Material(
                  color: Colors.transparent,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
                    height: 71, // Fixed height for better visual appearance
                    constraints: BoxConstraints(
                      maxWidth: screenWidth * 0.9, // Maximum of 90% of screen width
                      minWidth: screenWidth * 0.6, // Minimum of 60% of screen width
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          spreadRadius: 1,
                          blurRadius: 5,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        _buildReactionOption('like', Icons.thumb_up),
                        _buildReactionOption('love', Icons.favorite),
                        _buildReactionOption('laugh', Icons.sentiment_very_satisfied),
                        _buildReactionOption('wow', Icons.sentiment_satisfied_alt),
                        _buildReactionOption('sad', Icons.sentiment_dissatisfied),
                        _buildReactionOption('angry', Icons.sentiment_very_dissatisfied),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  /// **😄 Individual Reaction Option with Animation**
  Widget _buildReactionOption(String type, IconData icon) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pop(); // Close the popup
        _toggleReaction(type);
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.grey[100],
              ),
              padding: const EdgeInsets.all(8.0),
              child: Icon(
                icon,
                color: _reactionColors[type],
                size: 20,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              type.capitalize(),
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.bold,
                color: _reactionColors[type],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// **💬 Comment Item Widget**
  Widget _buildCommentItem(Comment comment) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundImage: AssetImage(comment.authorImage),
            radius: 16,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        comment.authorName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                      const SizedBox(height: 2),
                      Text(comment.text),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 2.0, left: 8.0),
                  child: Row(
                    children: [
                      Text(
                        comment.timePosted,
                        style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        'Like',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        'Reply',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// **📝 Comment Model Class**
class Comment {
  final String authorName;
  final String authorImage;
  final String text;
  final String timePosted;

  Comment({
    required this.authorName,
    required this.authorImage,
    required this.text,
    required this.timePosted,
  });
}

/// **🔤 String Extension**
extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${this.substring(1)}";
  }
}
