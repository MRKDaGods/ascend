import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/Messaging/presentation/pages/chat_page.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

class Conversation extends StatefulWidget {
  final String conversationId;
  final String otherUserId;
  final String otherUserName;
  final String? otherUserProfileImageUrl;
  final String latestMessage;
  final String latestTimestamp;
  final bool isOnline;
  final int unseenCount;
  final bool isTyping;
  final Function()? onTap;

  const Conversation({
    super.key,
    required this.conversationId,
    required this.otherUserId,
    required this.otherUserName,
    required this.otherUserProfileImageUrl,
    required this.latestMessage,
    required this.latestTimestamp,
    required this.isOnline,
    required this.unseenCount,
    required this.isTyping,
    this.onTap,
  });

  @override
  State<Conversation> createState() => _ConversationState();
}

class _ConversationState extends State<Conversation>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);
    _controller.forward();

    // If typing, repeat the animation for the typing dots
    if (widget.isTyping) {
      _controller.repeat();
    }

    debugPrint('Animation started for conversation: ${widget.conversationId}');
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(Conversation oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Start/stop typing animation when typing status changes
    if (widget.isTyping != oldWidget.isTyping) {
      debugPrint('Typing status changed to: ${widget.isTyping}');

      if (widget.isTyping) {
        if (!_controller.isAnimating) {
          _controller.repeat();
        }
      } else {
        _controller.forward(from: 0); // Reset and do one cycle
      }
    }
  }

  void _markAsRead() {
    // Use bloc to mark messages as read
    context.read<MessagingBloc>().add(
      MarkMessagesasRead(widget.conversationId),
    );
  }

  void _markAsUnread() {
    // For marking as unread, you'd need to add this event to your bloc
    // This would typically be a custom event specific to this functionality
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Marked as unread')));

    // Mark as unread action
    context.read<MessagingBloc>().add(MarkasUnRead(widget.conversationId));

    // Force rebuild after a small delay
    Future.delayed(Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {});
      }
    });
  }

  void _moveToOther() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Moved to Other')));

    // Refresh conversations after action
    context.read<MessagingBloc>().add(LoadConversations());
  }

  Widget _buildTypingIndicator() {
    return Row(
      children: [
        Text(
          "typing",
          style: TextStyle(
            color: Colors.green.shade600,
            fontWeight: FontWeight.w500,
          ),
        ),
        SizedBox(width: 5),
        _buildTypingDots(),
      ],
    );
  }

  Widget _buildTypingDots() {
    // Use the animation controller for the typing dots
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Row(
          children: [
            _buildAnimatedDot(0.0),
            SizedBox(width: 2),
            _buildAnimatedDot(0.2),
            SizedBox(width: 2),
            _buildAnimatedDot(0.4),
          ],
        );
      },
    );
  }

  Widget _buildAnimatedDot(double delay) {
    final double animValue =
        (((_controller.value - delay) % 1.0) < 0.6)
            ? ((_controller.value - delay) % 1.0) / 0.6
            : 0;

    return Container(
      height: 4 + (animValue * 3),
      width: 4 + (animValue * 3),
      decoration: BoxDecoration(
        color: Colors.green.shade600,
        borderRadius: BorderRadius.circular(5),
      ),
    );
  }

  void _navigateToChat() async {
    // Get and store the bloc reference before navigation
    final messagingBloc = context.read<MessagingBloc>();

    // Set active conversation in bloc
    messagingBloc.add(SetActiveConversation(widget.conversationId));

    if (widget.unseenCount > 0) {
      // Mark messages as read when opening the conversation
      _markAsRead();
    }

    final myUserId = await SecureStorageHelper.getUserId();

    // Use the custom onTap handler if provided, otherwise use default navigation
    if (widget.onTap != null) {
      widget.onTap!();
    } else {
      // Navigate to the chat screen when tapped

      debugPrint(
        'Navigating to chat page with conversationId: ${widget.conversationId} ,  otherUserId: ${widget.otherUserId} , myUserId: $myUserId',
      );

      Navigator.push(
        // ignore: use_build_context_synchronously
        context,
        MaterialPageRoute(
          builder:
              (context) => BlocProvider.value(
                // Pass the existing bloc instance to the new route
                value: messagingBloc,
                child: ChatPage(
                  conversationId: widget.conversationId,
                  converstaionName: widget.otherUserName,
                  conversationAvatar: widget.otherUserProfileImageUrl,
                  isOnline: widget.isOnline,
                  myUserId: myUserId!,
                  otherUserId: widget.otherUserId,
                  isTyping: widget.isTyping,
                ),
              ),
        ),
      ).then((_) {
        // When returning from chat, refresh conversations
        if (mounted) {
          messagingBloc.add(LoadConversations());
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Slidable(
      key: Key(widget.conversationId),
      endActionPane: ActionPane(
        motion: const DrawerMotion(),
        extentRatio: 0.7, // Increase from 0.5 to 0.7 for more width
        children: [
          CustomSlidableAction(
            flex: 1,
            backgroundColor: Colors.grey.shade100, // Lighter background
            foregroundColor: Colors.grey.shade800,
            onPressed: (_) => _showMoreOptions(context),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.more_horiz, size: 28), // Slightly larger
                SizedBox(height: 4),
                Text(
                  "More",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
          CustomSlidableAction(
            flex: 1,
            backgroundColor: Colors.blue.shade50,
            foregroundColor: Colors.blue.shade700,
            onPressed: (_) => _markAsUnread(),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.mail_outline, size: 28),
                SizedBox(height: 4),
                Text(
                  "Unread",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
          CustomSlidableAction(
            flex: 1,
            backgroundColor: Colors.green.shade50,
            foregroundColor: Colors.green.shade700,
            onPressed: (_) => _moveToOther(),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.arrow_forward, size: 28),
                SizedBox(height: 4),
                Text(
                  "Other",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ],
      ),
      child: FadeTransition(
        opacity: _animation,
        child: InkWell(
          onTap: _navigateToChat,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(color: Colors.grey.shade200, width: 0.5),
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                vertical: 12.0,
                horizontal: 16.0,
              ),
              child: Row(
                children: [
                  // Profile picture with online indicator
                  _buildProfilePicture(),
                  SizedBox(width: 12),
                  // Message content
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Name and timestamp row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              widget.otherUserName,
                              style: TextStyle(
                                fontWeight:
                                    widget.unseenCount > 0
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              widget.latestTimestamp,
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 4),
                        // Message preview
                        Row(
                          children: [
                            Expanded(
                              child:
                                  widget.isTyping
                                      ? _buildTypingIndicator() // Show typing indicator
                                      : Text(
                                        widget.latestMessage,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          color:
                                              widget.unseenCount > 0
                                                  ? Colors.black
                                                  : Colors.grey.shade600,
                                          fontWeight:
                                              widget.unseenCount > 0
                                                  ? FontWeight.w500
                                                  : FontWeight.normal,
                                        ),
                                      ),
                            ),
                            if (widget.unseenCount > 0)
                              Container(
                                margin: EdgeInsets.only(left: 8),
                                padding: EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: Colors.blue,
                                  shape: BoxShape.circle,
                                ),
                                child: Text(
                                  widget.unseenCount.toString(),
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProfilePicture() {
    return Stack(
      children: [
        CircleAvatar(
          radius: 24,
          backgroundColor:
              Colors.grey[200], // Add background color for empty states
          backgroundImage:
              !_shouldShowFallbackIcon()
                  ? NetworkImage(widget.otherUserProfileImageUrl!)
                  : null, // Use NetworkImage for profile image
          child:
              _shouldShowFallbackIcon()
                  ? const Icon(Icons.person, size: 40, color: Colors.grey)
                  : null,
        ),
        if (widget.isOnline)
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              height: 12,
              width: 12,
              decoration: BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
          ),
      ],
    );
  }

  bool _shouldShowFallbackIcon() {
    final imageUrl = widget.otherUserProfileImageUrl;
    return imageUrl == null ||
        imageUrl.isEmpty ||
        imageUrl == 'assets/EmptyUser.png';
  }

  void _showMoreOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SizedBox(
          height: 300,
          child: Column(
            children: [
              ListTile(
                leading: Icon(Icons.arrow_forward),
                title: Text("Move to Other"),
                onTap: () {
                  // Handle Move to Other action
                  Navigator.pop(context);
                  _moveToOther();
                },
              ),
              ListTile(
                leading: Icon(Icons.label),
                title: Text("Label as Jobs"),
                onTap: () {
                  // Handle Label as Jobs action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text('Labeled as Jobs')));
                  // Refresh conversations after action
                  context.read<MessagingBloc>().add(LoadConversations());
                },
              ),
              ListTile(
                leading: Icon(Icons.star),
                title: Text("Star"),
                onTap: () {
                  // Handle Star action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Conversation starred')),
                  );
                  // Refresh conversations after action
                  context.read<MessagingBloc>().add(LoadConversations());
                },
              ),
              ListTile(
                leading: Icon(Icons.notifications),
                title: Text("Mute"),
                onTap: () {
                  // Handle Mute action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text('Muted')));
                  // Refresh conversations after action
                  context.read<MessagingBloc>().add(LoadConversations());
                },
              ),
              ListTile(
                leading: Icon(Icons.mark_as_unread),
                title: Text(
                  "Mark as Unread",
                  style: TextStyle(color: Colors.grey),
                ),
                onTap: () {
                  // Handle Mark as Unread action
                  Navigator.pop(context);
                  _markAsUnread();
                },
              ),
              ListTile(
                leading: Icon(Icons.archive_outlined),
                title: Text("Delete"),
                onTap: () {
                  // Handle Delete action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text('Archived')));
                  // Refresh conversations after action
                  context.read<MessagingBloc>().add(LoadConversations());
                },
              ),
              ListTile(
                leading: Icon(Icons.delete),
                title: Text("Delete Conversation"),
                onTap: () {
                  // Handle Delete Conversation action
                  Navigator.pop(context);
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text('Deleted')));
                  // Refresh conversations after action
                  context.read<MessagingBloc>().add(LoadConversations());
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
