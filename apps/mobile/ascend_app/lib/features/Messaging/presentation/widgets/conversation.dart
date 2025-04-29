import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:ascend_app/features/networks/widgets/filter_modal.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/animation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/Messaging/presentation/pages/chat_page.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';

class Conversation extends StatefulWidget {
  final String conversationId;
  final String otherUserId;
  final String otherUserName;
  final String otherUserProfileImageUrl;
  final String latestMessage;
  final String latestTimestamp;
  final bool isOnline;
  final int unseenCount;
  final Function()? onTap;

  const Conversation({
    Key? key,
    required this.conversationId,
    required this.otherUserId,
    required this.otherUserName,
    required this.otherUserProfileImageUrl,
    required this.latestMessage,
    required this.latestTimestamp,
    required this.isOnline,
    required this.unseenCount,
    this.onTap,
  }) : super(key: key);

  @override
  _ConversationState createState() => _ConversationState();
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
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
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

    // Refresh conversations to update UI
    context.read<MessagingBloc>().add(LoadConversations());
  }

  void _moveToOther() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Moved to Other')));

    // Refresh conversations after action
    context.read<MessagingBloc>().add(LoadConversations());
  }

  void _navigateToChat() async {
    // Set active conversation in bloc
    context.read<MessagingBloc>().add(
      SetActiveConversation(widget.conversationId),
    );

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
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => ChatPage(
                conversationId: widget.conversationId,
                converstaionName: widget.otherUserName,
                conversationAvatar: widget.otherUserProfileImageUrl,
                isOnline: widget.isOnline,
                myUserId: myUserId!,
              ),
        ),
      ).then((_) {
        // When returning from chat, refresh conversations
        context.read<MessagingBloc>().add(LoadConversations());
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(widget.conversationId),
      // Change to right-to-left swipe to match LinkedIn
      direction: DismissDirection.endToStart,
      // Add the background property with your swipe actions
      background: _buildSwipeActionsBackground(),
      // We don't need a secondary background since we only handle one swipe direction
      secondaryBackground: null,
      // Don't actually dismiss the item
      confirmDismiss: (direction) async {
        // Always return false to prevent actual dismissal
        return false;
      },
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
                              child: Text(
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
          backgroundImage: NetworkImage(widget.otherUserProfileImageUrl),
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

  void _showMoreOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
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

  Widget _buildSwipeActionsBackground() {
    return Container(
      color: Colors.grey.shade100,
      child: Row(
        // Push the buttons to the right side
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          _buildSwipeActionButton(
            "More",
            Icons.more_horiz,
            Colors.grey.shade700,
            () {
              // Show more options bottom sheet when tapped
              _showMoreOptions(context);
            },
          ),
          _buildSwipeActionButton(
            "Unread",
            Icons.mail_outline,
            Colors.blue,
            () {
              // Handle Unread action using bloc
              _markAsUnread();
            },
          ),
          _buildSwipeActionButton(
            "Other",
            Icons.arrow_forward,
            Colors.green,
            () {
              // Handle Other action using bloc
              _moveToOther();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSwipeActionButton(
    String label,
    IconData icon,
    Color color,
    VoidCallback onPressed,
  ) {
    // Make each button narrower
    return Container(
      width: 80, // Fixed width instead of Expanded
      child: InkWell(
        onTap: onPressed,
        child: Container(
          height: double.infinity,
          decoration: BoxDecoration(
            border: Border(
              left: BorderSide(color: Colors.grey.shade300, width: 1),
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color),
              SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSwipeBackground(bool isLeft) {
    // We're not using this anymore since we have a custom background with buttons
    return Container(
      color: isLeft ? Colors.blue.shade100 : Colors.red.shade100,
      alignment: isLeft ? Alignment.centerLeft : Alignment.centerRight,
      padding: EdgeInsets.symmetric(horizontal: 20),
      child: Icon(
        isLeft ? Icons.archive : Icons.delete,
        color: isLeft ? Colors.blue : Colors.red,
        size: 30,
      ),
    );
  }
}
