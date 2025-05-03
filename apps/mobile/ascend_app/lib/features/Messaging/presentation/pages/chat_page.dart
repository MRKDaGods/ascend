import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/chat_app_bar.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/chat_box.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/messages_input.dart';
import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/utils/date_verifier.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/core/di/dependency_injection.dart';

class ChatPage extends StatefulWidget {
  final String conversationId;
  final String converstaionName;
  final String? conversationAvatar;
  final bool isOnline;
  final String myUserId;
  final String? otherUserId;
  final bool isTyping;

  const ChatPage({
    super.key,
    required this.conversationId,
    required this.converstaionName,
    required this.conversationAvatar,
    required this.isOnline,
    required this.myUserId,
    this.otherUserId,
    required this.isTyping,
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  final ScrollController _scrollController = ScrollController();

  //List<MessageModel> _messages = [];

  // Keep track of messages count in the UI
  // Pagination variables
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

  @override
  void initState() {
    super.initState();

    _updateTypingStatus(widget.isTyping);

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

    debugPrint(
      'DEBUG: ${widget.conversationId} - ChatPage - initState - Start',
    );
  }

  void _onScroll() {
    // Load more when reaching near the top (end of the list in reverse)
    if (_scrollController.position.pixels <=
            _scrollController.position.minScrollExtent +
                200 && // Check near the top
        !_isLoadingMore &&
        _hasMoreMessages) {
      _loadMoreMessages();
    }

    // Show or hide scroll to bottom button based on how far up we've scrolled
    setState(() {
      // Show if scrolled up more than a certain amount from the bottom
      _showScrollToBottom =
          _scrollController.position.pixels <
          _scrollController.position.maxScrollExtent - 500;
    });
  }

  void _loadMoreMessages() {
    if (_isLoadingMore || !_hasMoreMessages || _isLoading) return;

    debugPrint('[ChatPage] Attempting to load more messages...');
    // Local flag for immediate UI feedback
    setState(() {
      _isLoadingMore = true;
    });

    // Dispatch the LoadMoreMessages event to the bloc
    context.read<MessagingBloc>().add(LoadMoreMessages(widget.conversationId));
  }

  void _updateTypingStatus(bool isTyping) {
    if (_isRemoteUserTyping != isTyping) {
      setState(() {
        _isRemoteUserTyping = isTyping;
      });

      debugPrint('[ChatPage] Updated typing status to: $isTyping');

      // Optional: Cancel any existing typing timeout timer
      _remoteTypingTimer?.cancel();

      // Only set a new timer if typing is true
      if (isTyping) {
        _remoteTypingTimer = Timer(Duration(seconds: 3), () {
          if (mounted) {
            setState(() {
              _isRemoteUserTyping = false;
            });
            debugPrint('[ChatPage] Typing timeout - reset to false');
          }
        });
      }
    }
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

    // ensure that UI is fully built before scrolling
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients || !mounted) return;

      try {
        final position = 0.0;

        if (animate) {
          _scrollController.animateTo(
            position,
            duration: Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        } else {
          _scrollController.jumpTo(position);
        }
        debugPrint('[ChatPage] Scrolled to bottom of message list');
      } catch (e) {
        debugPrint('[ChatPage] Error scrolling to bottom: $e');
      }
    });
  }

  // Send message when the send button is pressed
  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    // send Message through Bloc
    debugPrint(
      'DEBUG: [_sendMessage] Dispatching SendMessage event. ConversationId: ${widget.conversationId}, OtherUserId: ${widget.otherUserId}, Text: $text',
    );
    context.read<MessagingBloc>().add(
      SendMessage(
        widget.conversationId,
        widget.otherUserId!,
        text,
      ), // Fixed the missing parenthesis
    );

    debugPrint(
      'DEBUG: [_sendMessage] Message sent. ConversationId: ${widget.conversationId}, OtherUserId: ${widget.otherUserId}, Text: $text',
    );

    final bloc = context.read<MessagingBloc>();
    if (bloc.state is MessagesLoaded &&
        (bloc.state as MessagesLoaded).sendingStatus != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Messages Failed to send. Please try again with error ${(bloc.state as MessagesLoaded).sendingStatus!['error']}',
          ),
        ),
      );
    }

    // Clear input
    _messageController.clear();

    // Stop typing indicator
    setState(() {
      _isLocalUserTyping = false;
    });

    // Manually stop local typing indicator
    _localTypingTimer?.cancel(); // Cancel any pending stop-typing timer
    if (_isLocalUserTyping) {
      setState(() {
        _isLocalUserTyping = false;
      });

      // Scroll to show new message
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToBottom();
      });
    }
  }

  @override
  void dispose() {
    // Cancel timers first
    try {
      debugPrint('dispose - ChatPage - Start');
      _localTypingTimer?.cancel();
      _remoteTypingTimer?.cancel();

      // Dispose controllers
      _scrollController.removeListener(
        _onScroll,
      ); // Remove listener before disposing
      _scrollController.dispose();
      _messageController.removeListener(_onMessageChange); // Remove listener
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

  bool _shouldShowDateSeparator(int messageIndex, List<MessageModel> messages) {
    // For the first message in display order (oldest), always show date
    if (messageIndex == messages.length - 1) {
      return true;
    }

    // For others, compare with previous message
    if (messageIndex < messages.length - 1) {
      final currentDate =
          messages[messageIndex].sentAt.toLocal(); // Convert to local time
      final nextDate =
          messages[messageIndex + 1].sentAt.toLocal(); // Convert to local time

      return !DateVerifier.isSameDay(currentDate, nextDate);
    }

    return false;
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

  @override
  Widget build(BuildContext context) {
    debugPrint(
      'DEBUG: [ChatPage] Building ChatPage with conversationId: ${widget.conversationId}',
    );
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: ChatAppBar(
          userName: widget.converstaionName,
          isOnline: widget.isOnline,
          isTyping: _isRemoteUserTyping,
          conversationId:
              widget.conversationId, // Pass conversation ID for bloc
          onBackPressed: () {
            debugPrint(
              'Back button pressed , navigating back... and refreshing',
            );
            // Clear active conversation
            sl.dispatchSetActiveConversation('');
            context.read<MessagingBloc>().add(LoadConversations());
          },
        ),
      ),
      body: SafeArea(
        child: BlocConsumer<MessagingBloc, MessagingBlocState>(
          listenWhen: (previous, current) {
            // Always listen for typing changes for this conversation
            if (previous is MessagesLoaded &&
                current is MessagesLoaded &&
                current.conversationId == widget.conversationId) {
              return previous.isTyping != current.isTyping ||
                  previous.messages != current.messages;
            }
            return true;
          },
          listener: (context, state) async {
            // Handle state changes for message loading
            if (state is MessagesLoaded &&
                state.conversationId == widget.conversationId) {
              debugPrint(
                '[ChatPage] Last Loaded state: ${state.messages[state.messages.length - 1].content} at ${state.messages[state.messages.length - 1].sentAt}',
              );
              final bool wasLoadingMore =
                  _isLoadingMore; // Store previous state
              setState(() {
                _isLoading = false;
                _isLoadingMore = false;
                _hasMoreMessages = !state.hasReachedMax;
              });

              debugPrint(
                '[ChatPage] Loaded messages: ${state.messages.length}',
              );

              final bool isNearBottom =
                  _scrollController.hasClients &&
                  _scrollController.position.pixels <
                      100; // Check if user is near the bottom

              if (state.messages.isNotEmpty &&
                  state.messages.last.senderId == widget.myUserId) {
                // New message from me, always scroll
                _scrollToBottom();
              } else if (isNearBottom &&
                  state.messages.isNotEmpty &&
                  state.messages.last.senderId != widget.otherUserId) {
                // New message from other user, scroll only if already near bottom
                _scrollToBottom();
              } else if (state.page == 1 && !wasLoadingMore) {
                // Initial load completed, jump to bottom
                _scrollToBottom(animate: false);
              }

              // Use your method instead
              _updateTypingStatus(state.isTyping);
            } else if (state is MessagesLoading &&
                state.conversationId == widget.conversationId) {
              setState(() {
                _isLoading = !state.isLoadingMore; // True only for initial load
                _isLoadingMore = state.isLoadingMore;
              });
            } else if (state is MessagingError) {
              setState(() {
                _isLoading = false;
                _isLoadingMore = false;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Failed to load messages. Please try again.'),
                ),
              );
            }
          },
          builder: (context, state) {
            List<MessageModel> currentMessages = [];
            if (state is MessagesLoaded &&
                state.conversationId == widget.conversationId) {
              currentMessages = state.messages;
            }

            return Column(
              children: [
                // Messages list
                Expanded(
                  child: Stack(
                    children: [
                      _isLoading && currentMessages.isEmpty
                          ? Center(child: CircularProgressIndicator())
                          : _buildMessagesList(currentMessages),

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
                  conversationId: widget.conversationId,
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  // Fix _buildMessagesList to correctly handle reversed ListView
  Widget _buildMessagesList(List<MessageModel> messages) {
    return ListView.builder(
      controller: _scrollController,
      padding: EdgeInsets.all(16),
      reverse: true, // Change to false - newest should be at the bottom
      itemCount: messages.length + (_isLoadingMore ? 1 : 0),
      itemBuilder: (context, index) {
        // Loading indicator should be at the beginning (top) when loading more
        if (_isLoadingMore && index == 0) {
          return Container(
            padding: EdgeInsets.all(8),
            alignment: Alignment.center,
            child: SizedBox(
              height: 24,
              width: 24,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          );
        }

        // Adjust index for loading indicator if present
        final actualIndex = _isLoadingMore ? index - 1 : index;

        if (actualIndex < 0 || actualIndex >= messages.length) {
          return SizedBox.shrink();
        }

        // We need to reverse the order of the messages list so newest is at the bottom
        final reversedIndex = messages.length - 1 - actualIndex;
        final message = messages[reversedIndex];

        // Check if we should show date separator
        final bool showDateSeparator = _shouldShowDateSeparator(
          reversedIndex,
          messages,
        );

        return Column(
          crossAxisAlignment:
              message.senderId == widget.myUserId
                  ? CrossAxisAlignment.end
                  : CrossAxisAlignment.start,
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
                      ? widget.conversationAvatar ?? 'assets/EmptyUser.png'
                      : 'assets/EmptyUser.png',
              sentOrReceived: message.senderId == widget.myUserId,
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
}
