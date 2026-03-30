import 'package:flutter/material.dart';

class ChatAppBar extends StatefulWidget {
  final String userName;
  final bool isOnline;
  final bool isTyping;
  final String? conversationId;
  final VoidCallback? onBackPressed;

  const ChatAppBar({
    super.key,
    required this.userName,
    this.isOnline = false,
    this.isTyping = false,
    this.conversationId,
    this.onBackPressed,
  });

  @override
  State<ChatAppBar> createState() => _ChatAppBarState();
}

class _ChatAppBarState extends State<ChatAppBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _typingAnimationController;
  bool starClicked = false;

  @override
  void initState() {
    super.initState();

    // Set up typing animation
    _typingAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    // First stop the animation
    _typingAnimationController.stop();
    // Then dispose it
    _typingAnimationController.dispose();
    // Call super.dispose() last
    super.dispose();
  }

  @override
  void didUpdateWidget(ChatAppBar oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Check if typing status has changed
    if (oldWidget.isTyping != widget.isTyping) {
      debugPrint('[ChatAppBar] Typing status changed: ${widget.isTyping}');

      if (widget.isTyping) {
        // Start or continue animation
        if (!_typingAnimationController.isAnimating) {
          _typingAnimationController.repeat();
        }
      } else {
        // Stop animation
        _typingAnimationController.stop();
        _typingAnimationController.reset();
      }
    }
  }

  void _toggleStar() {
    if (mounted) {
      // Add mounted check before setState
      setState(() {
        starClicked = !starClicked;
      });
    }
  }

  void showOptionsModal(BuildContext context) {
    // Add a mounted check
    if (!mounted) return;

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return SingleChildScrollView(
          scrollDirection: Axis.vertical,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle indicator at top
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              // Option items
              _buildModalOption(
                icon: Icons.folder,
                label: 'Move to Other',
                onTap: () {
                  Navigator.pop(context);
                  // Add your move to other logic here
                },
              ),

              _buildModalOption(
                icon: Icons.label,
                label: 'Label as Jobs',
                onTap: () {
                  Navigator.pop(context);
                  // Add your label as jobs logic here
                },
              ),

              _buildModalOption(
                icon: Icons.mark_email_unread,
                label: 'Mark as unread',
                onTap: () {
                  Navigator.pop(context);
                  // Add your mark as unread logic here
                },
              ),

              _buildModalOption(
                icon: Icons.star,
                label: 'Star',
                onTap: () {
                  Navigator.pop(context);
                  _toggleStar();
                },
              ),

              _buildModalOption(
                icon: Icons.notifications_off,
                label: 'Mute',
                onTap: () {
                  Navigator.pop(context);
                  // Add your mute logic here
                },
              ),

              _buildModalOption(
                icon: Icons.archive,
                label: 'Archive',
                onTap: () {
                  Navigator.pop(context);
                  // Add your archive logic here
                },
              ),

              _buildModalOption(
                icon: Icons.group,
                label: 'Create group chat',
                onTap: () {
                  Navigator.pop(context);
                  // Add your create group chat logic here
                },
              ),

              _buildModalOption(
                icon: Icons.flag,
                label: 'Report / Block',
                onTap: () {
                  Navigator.pop(context);
                  // Add your report/block logic here
                },
              ),

              _buildModalOption(
                icon: Icons.delete,
                label: 'Delete conversation',
                onTap: () {
                  Navigator.pop(context);
                  // Add your delete conversation logic here
                },
              ),

              _buildModalOption(
                icon: Icons.settings,
                label: 'Manage settings',
                onTap: () {
                  Navigator.pop(context);
                  // Add your manage settings logic here
                },
              ),

              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  Widget _buildModalOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[600]),
      title: Text(
        label,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: Colors.grey[800],
        ),
      ),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Remove this local variable and use widget.isTyping directly
    // bool isRemoteTyping = widget.isTyping;
    debugPrint('[ChatAppBar] Building with isTyping=${widget.isTyping}');

    return AppBar(
      elevation: 1,
      leading: BackButton(
        onPressed: () {
          if (widget.onBackPressed != null) {
            widget.onBackPressed!();
          }
          Navigator.pop(context);
        },
      ),
      title: Row(
        children: [
          // User name and status
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.userName,
                style: const TextStyle(
                  color: Colors.black87,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),

              // Status text - typing or online
              widget.isTyping
                  ? _buildTypingIndicator()
                  : widget.isOnline
                  ? Text(
                    'Active now',
                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                  )
                  : const SizedBox.shrink(),
            ],
          ),
        ],
      ),
      centerTitle: false,
      actions: [
        IconButton(
          icon: const Icon(Icons.more_horiz, color: Colors.black87),
          onPressed: () {
            showOptionsModal(context);
          },
        ),
        IconButton(
          icon: Icon(
            Icons.star,
            color: starClicked ? const Color(0xFFD4AF37) : Colors.grey,
          ),
          onPressed: _toggleStar,
        ),
      ],
    );
  }

  // Animated typing indicator
  Widget _buildTypingIndicator() {
    // Check if widget is mounted before animating
    if (!mounted) return const SizedBox.shrink();

    return Row(
      children: [
        Text('Typing', style: TextStyle(fontSize: 14, color: Colors.grey[600])),
        const SizedBox(width: 4),
        AnimatedBuilder(
          animation: _typingAnimationController,
          builder: (context, child) {
            return Row(
              children: [_buildDot(0.0), _buildDot(0.2), _buildDot(0.4)],
            );
          },
        ),
      ],
    );
  }

  Widget _buildDot(double delay) {
    final double animValue =
        (((_typingAnimationController.value + delay) % 1.0) < 0.6)
            ? ((_typingAnimationController.value + delay) % 1.0) / 0.6
            : 0;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 1),
      height: 3 + (animValue * 3),
      width: 3 + (animValue * 3),
      decoration: BoxDecoration(
        color: Colors.grey[600],
        borderRadius: BorderRadius.circular(5),
      ),
    );
  }
}
