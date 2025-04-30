import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/ChatAppBar.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/chat_box.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/Messages_Input.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/utils/date_verifier.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:provider/provider.dart';
import 'package:ascend_app/core/di/dependency_injection.dart';

class ChatPage extends StatefulWidget {
  final String conversationId;
  final String converstaionName;
  final String conversationAvatar;
  final bool isOnline;
  final String myUserId;
  final String? otherUserId;

  const ChatPage({
    Key? key,
    required this.conversationId,
    required this.converstaionName,
    required this.conversationAvatar,
    required this.isOnline,
    required this.myUserId,
    this.otherUserId,
  }) : super(key: key);

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  final ScrollController _scrollController = ScrollController();
  List<MessageModel> _messages = [];

  // Pagination variables
  static const int _pageSize = 10;
  int _page = 0;
  bool _isLoading = false;
  bool _hasMoreMessages = true;
  bool _isLoadingMore = false;

  // UI state
  bool _showAttachments = false;
  bool _showScrollToBottom = false;

  // Typing indicators
  bool _isLocalUserTyping = false; // Me typing (to send to server)
  bool _isRemoteUserTyping =
      false; // Other person typing (received from server)
  Timer? _localTypingTimer;
  Timer? _remoteTypingTimer; // Auto-reset remote typing after timeout

  late MessagingBloc _messagingBloc;
  bool _hasStoredBlocReference = false;

  @override
  void initState() {
    debugPrint('initState - ChatPage');
    super.initState();

    // Load Intial messages
    context.read<MessagingBloc>().add(LoadMessages(widget.conversationId));

    // Set the initial focus state
    if (_focusNode.hasFocus) {
      _focusNode.unfocus();
    }

    // Listen to scroll events for pagination and "scroll to bottom" functionality
    _scrollController.addListener(_onScroll);

    // Listen to text changes to detect typing
    _messageController.addListener(_onMessageChange);

    debugPrint('initState - ChatPage - End');
  }

  void _onScroll() {
    // Load more when reaching near the top
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoadingMore &&
        _hasMoreMessages) {
      _loadMoreMessages();
    }

    // Show or hide scroll to bottom button
    setState(() {
      _showScrollToBottom = _scrollController.position.pixels > 500;
    });
  }

  void _handleRemoteTypingStatusChanged(bool isTyping) {
    // Update UI when server notifies that remote user is typing
    setState(() {
      _isRemoteUserTyping = isTyping;
    });

    // Auto-reset typing indicator after timeout if no updates received
    if (isTyping) {
      _remoteTypingTimer?.cancel();
      _remoteTypingTimer = Timer(Duration(seconds: 5), () {
        if (mounted) {
          setState(() {
            _isRemoteUserTyping = false;
          });
        }
      });
    }
  }

  void _loadMoreMessages() {
    if (_isLoadingMore || !_hasMoreMessages) return;

    // Local flag for immediate UI feedback
    setState(() {
      _isLoadingMore = true;
    });

    // Dispatch the LoadMoreMessages event to the bloc
    context.read<MessagingBloc>().add(LoadMoreMessages(widget.conversationId));
  }

  void _onMessageChange() {
    final isTyping = _messageController.text.isNotEmpty;

    if (isTyping != _isLocalUserTyping) {
      setState(() {
        _isLocalUserTyping = isTyping;
      });

      // Send typing status to server
      _sendTypingStatusToServer(isTyping);
    }

    // Reset timer
    _localTypingTimer?.cancel();

    if (isTyping) {
      _localTypingTimer = Timer(Duration(seconds: 3), () {
        // Stop typing after 3 seconds of inactivity
        setState(() {
          _isLocalUserTyping = false;
        });
        _sendTypingStatusToServer(false);
      });
    }
  }

  void _sendTypingStatusToServer(bool isTyping) {
    debugPrint('Local user typing: $isTyping');

    // send Typing Status through bloc
    if (isTyping) {
      context.read<MessagingBloc>().add(
        SendTypingNotification(widget.conversationId),
      );
    }
  }

  void _scrollToBottom({bool animate = true}) {
    if (!_scrollController.hasClients) return;

    final position = _scrollController.position.maxScrollExtent;
    if (animate) {
      _scrollController.animateTo(
        position,
        duration: Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    } else {
      _scrollController.jumpTo(position);
    }
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    // send Message through Bloc
    context.read<MessagingBloc>().add(
      SendMessage(
        widget.conversationId,
        widget.otherUserId!,
        text,
      ), // Fixed the missing parenthesis
    );

    // Clear input
    _messageController.clear();

    // Stop typing indicator
    setState(() {
      _isLocalUserTyping = false;
    });
    _sendTypingStatusToServer(false);

    // Scroll to show new message
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
  }

  void _onFocusChange() {
    // Handle focus changes if needed
    setState(() {});
  }

  @override
  void dispose() {
    // Cancel timers first
    try {
      debugPrint('dispose - ChatPage - Start');
      _localTypingTimer?.cancel();
      _remoteTypingTimer?.cancel();

      // Dispose controllers
      _scrollController.dispose();
      _messageController.dispose();
      _focusNode.dispose();

      super.dispose();

      try {
        debugPrint('Call sl.setActiveConversation()');
        sl.dispatchSetActiveConversation('');
        debugPrint('successfully called sl.setActiveConversation()');
      } catch (e, stackTrace) {
        debugPrint('Error in dispose: $e\n$stackTrace');
        debugPrint(stackTrace.toString());
      }
    } catch (e, stackTrace) {
      debugPrint('Error in dispose: $e\n$stackTrace');
      debugPrint(stackTrace.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: ChatAppBar(
          userName: widget.converstaionName,
          isOnline: widget.isOnline,
          conversationId:
              widget.conversationId, // Pass conversation ID for bloc
        ),
      ),
      body: SafeArea(
        child: BlocConsumer<MessagingBloc, MessagingBlocState>(
          listener: (context, state) async {
            // Handle state changes for message loading
            if (state is MessagesLoaded &&
                state.conversationId == widget.conversationId) {
              // Update messages from bloc state
              _messages = state.messages;
              _hasMoreMessages = !state.hasReachedMax;
              _isLoading = false;
              _isLoadingMore = false;

              // Scroll to Bottom if it is initial load
              if (state.page == 1) {
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  _scrollToBottom(animate: false);
                });
              }

              // Check if there's a new message (for auto-scrolling)
              if (_messages.isNotEmpty &&
                  state.messages.isNotEmpty &&
                  state.messages.length > _messages.length &&
                  state.messages.last.senderId ==
                      await SecureStorageHelper.getUserId()) {
                // A new message was added and it's from me, scroll to bottom
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  _scrollToBottom();
                });
              }

              // Update remote typing status
              _isRemoteUserTyping = state.isTyping;

              // Reset typing timer
              if (state.isTyping) {
                _remoteTypingTimer?.cancel();
                _remoteTypingTimer = Timer(Duration(seconds: 3), () {
                  if (mounted && _isRemoteUserTyping) {
                    setState(() {
                      _isRemoteUserTyping = false;
                    });
                  }
                });
              }
            } else if (state is MessagesLoading &&
                state.conversationId == widget.conversationId) {
              if (state.isLoadingMore) {
                setState(() {
                  _isLoadingMore = true;
                });
              } else {
                setState(() {
                  _isLoading = true;
                });
              }
            }
          },
          builder: (context, state) {
            if (state is MessagesLoaded &&
                state.conversationId == widget.conversationId) {
              _messages = state.messages;
              final sortedMessages = List<MessageModel>.from(_messages);
              sortedMessages.sort((a, b) => b.sentAt.compareTo(b.sentAt));
            }
            return Column(
              children: [
                // Messages list
                Expanded(
                  child: Stack(
                    children: [
                      _isLoading && _messages.isEmpty
                          ? Center(child: CircularProgressIndicator())
                          : _buildMessagesList(),

                      // Scroll to bottom button
                      if (_showScrollToBottom)
                        Positioned(
                          right: 16,
                          bottom: 16,
                          child: FloatingActionButton(
                            mini: true,
                            backgroundColor: Colors.white,
                            elevation: 2,
                            child: Icon(
                              Icons.keyboard_arrow_down,
                              color: Colors.black87,
                            ),
                            onPressed: () => _scrollToBottom(),
                          ),
                        ),
                    ],
                  ),
                ),

                // Message input
                MessageInput(
                  messageController: _messageController,
                  focusNode: _focusNode,
                  onSendMessage: (text) {
                    _sendMessage();
                  },
                  onAttachmentPressed: () {
                    setState(() {
                      _showAttachments = !_showAttachments;
                    });
                  },
                  onTypingStatusChanged: (isTyping) {
                    setState(() {
                      _isLocalUserTyping = isTyping;
                    });
                  },
                  onEmojiPressed: () {
                    debugPrint('Emoji button pressed');
                  },
                  onCameraPressed: () {
                    debugPrint('Camera button pressed');
                  },
                  conversationId:
                      widget
                          .conversationId, // Pass conversationId to MessageInput
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildMessagesList() {
    return ListView.builder(
      controller: _scrollController,
      padding: EdgeInsets.all(16),
      reverse: true, // Newest at the bottom
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        // Show loading indicator at the bottom when loading more
        if (_hasMoreMessages && index == 0) {
          return _isLoadingMore
              ? Container(
                padding: EdgeInsets.all(8),
                alignment: Alignment.center,
                child: SizedBox(
                  height: 24,
                  width: 24,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              )
              : SizedBox.shrink();
        }

        // Adjust index for reversed list
        final messageIndex = _messages.length - 1 - index;
        if (messageIndex < 0 || messageIndex >= _messages.length) {
          return SizedBox.shrink();
        }

        final message = _messages[messageIndex];

        // Check if we should show date separator
        final bool showDateSeparator = _shouldShowDateSeparator(messageIndex);

        return Column(
          children: [
            // Date separator if needed
            if (showDateSeparator) _buildDateSeparator(message.sentAt),

            // Message bubble
            ChatBox(
              messageId: message.messageId,
              senderName:
                  message.senderId == widget.myUserId
                      ? "Me"
                      : widget.converstaionName,
              receiverId:
                  message.senderId == widget.myUserId
                      ? widget.otherUserId ?? ''
                      : widget.myUserId,
              senderAvatar:
                  message.senderId == widget.otherUserId
                      ? widget.conversationAvatar
                      : 'assets/EmptyUser.png',
              sentOrReceived:
                  message.senderId == widget.myUserId ? true : false,
              sentAt: message.sentAt,
              receivedAt: message.sentAt,
              content: message.content,
              fileUrl: message.fileUrl,
              fileType: message.fileType,
              conversationId: widget.conversationId,
            ),
          ],
        );
      },
    );
  }

  bool _shouldShowDateSeparator(int messageIndex) {
    if (messageIndex == 0) {
      return true;
    }

    final currentDate = _messages[messageIndex].sentAt;
    final previousDate = _messages[messageIndex - 1].sentAt;

    return !DateVerifier.isSameDay(currentDate, previousDate);
  }

  Widget _buildDateSeparator(DateTime date) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 16),
      alignment: Alignment.center,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          DateVerifier.getFormattedDateString(date),
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: Colors.grey[800],
          ),
        ),
      ),
    );
  }
}
