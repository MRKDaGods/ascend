import 'dart:async';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/conversation.dart';
import 'package:ascend_app/features/Messaging/presentation/pages/chat_page.dart';
import 'package:ascend_app/features/Messaging/utils/date_formatter.dart';

class MainMessagingPage extends StatefulWidget {
  const MainMessagingPage({super.key});

  @override
  State<MainMessagingPage> createState() => _MainMessagingPageState();
}

class _MainMessagingPageState extends State<MainMessagingPage> {
  final ScrollController scrollController = ScrollController();
  final TextEditingController searchController = TextEditingController();
  final FocusNode searchFocusNode = FocusNode();

  // Search functionality
  String _searchQuery = '';
  Timer? _searchDebounce;

  @override
  void initState() {
    super.initState();
    scrollController.addListener(_onScroll);

    // Listen to search text changes
    searchController.addListener(_onSearchChanged);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;

      final bloc = context.read<MessagingBloc>();
      if (bloc.state is MessagingBlocInitial) {
        bloc.add(IntializeMessaging());
      }
    });
  }

  @override
  void dispose() {
    scrollController.removeListener(_onScroll);
    scrollController.dispose();
    searchController.removeListener(_onSearchChanged);
    searchController.dispose();
    searchFocusNode.dispose();
    _searchDebounce?.cancel();
    super.dispose();
  }

  void _onScroll() {
    if (scrollController.position.pixels >=
        scrollController.position.maxScrollExtent - 200) {
      final state = context.read<MessagingBloc>().state;
      if (state is ConversationLoaded && !state.hasReachedMax) {
        context.read<MessagingBloc>().add(
          LoadMoreConversations(state.page + 1),
        );
      }
    }
  }

  void _onSearchChanged() {
    // Debounce search to avoid excessive API calls
    if (_searchDebounce?.isActive ?? false) _searchDebounce!.cancel();

    _searchDebounce = Timer(const Duration(milliseconds: 500), () {
      if (_searchQuery != searchController.text) {
        setState(() {
          _searchQuery = searchController.text;
          // Refresh conversations with search query
          context.read<MessagingBloc>().add(LoadConversations());
        });
      }
    });
  }

  void _navigateToChat(
    ConversationModel conversation,
    Map<String, bool> typingStatus,
  ) async {
    // Set active conversation in bloc
    final messagingBloc = context.read<MessagingBloc>();
    messagingBloc.add(SetActiveConversation(conversation.conversationId));

    final userId = await SecureStorageHelper.getUserId();

    // Navigate to chat screen with BlocProvider
    Navigator.push(
      // ignore: use_build_context_synchronously
      context,
      MaterialPageRoute(
        builder:
            (context) => BlocProvider.value(
              // Pass the existing bloc instance to the new route
              value: messagingBloc,
              child: ChatPage(
                conversationId: conversation.conversationId,
                converstaionName: conversation.otherUserName,
                conversationAvatar: conversation.otherUserProfileImageUrl,
                isOnline: false,
                myUserId: userId!,
                otherUserId: conversation.userId,
                isTyping: typingStatus[conversation.conversationId] ?? false,
              ),
            ),
      ),
    );
  }

  void _startNewConversation() {
    // This would navigate to user selection page
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('New conversation feature to be implemented')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: _buildSearchField(),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.add_comment),
            onPressed: _startNewConversation,
          ),
        ],
      ),
      body: _buildConversationsContent(),
    );
  }

  Widget _buildSearchField() {
    return Container(
      height: 40,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(20),
      ),
      child: TextField(
        controller: searchController,
        focusNode: searchFocusNode,
        decoration: InputDecoration(
          hintText: 'Search messages',
          contentPadding: EdgeInsets.symmetric(horizontal: 16),
          border: InputBorder.none,
          prefixIcon: Icon(Icons.search, size: 20),
          suffixIcon:
              searchController.text.isNotEmpty
                  ? GestureDetector(
                    onTap: () {
                      searchController.clear();
                      setState(() {
                        _searchQuery = '';
                        context.read<MessagingBloc>().add(LoadConversations());
                      });
                    },
                    child: Icon(Icons.close, size: 20),
                  )
                  : null,
        ),
      ),
    );
  }

  Widget _buildConversationsContent() {
    return BlocBuilder<MessagingBloc, MessagingBlocState>(
      buildWhen: (previous, current) {
        // Always rebuild for ConversationLoaded states
        return current is ConversationLoaded;
      },
      builder: (context, state) {
        if (state is ConversationLoading) {
          return Center(child: CircularProgressIndicator());
        } else if (state is ConversationLoaded) {
          debugPrint(
            '[ConversationsList] Rebuilding with ${state.conversations.length} conversations',
          );
          return _buildConversationsList(
            state.conversations,
            state.hasReachedMax,
            state.typingStatus,
          );
        } else if (state is MessagingError) {
          return _buildErrorState(state.errorMessage);
        } else {
          return _buildEmptyState();
        }
      },
    );
  }

  Widget _buildConversationsList(
    List<ConversationModel> conversations,
    bool hasReachedMax,
    Map<String, bool> typingStatus,
  ) {
    if (conversations.isEmpty) {
      return _buildEmptyState();
    }

    return RefreshIndicator(
      onRefresh: () async {
        context.read<MessagingBloc>().add(LoadConversations());
      },
      child: ListView.builder(
        controller: scrollController,
        itemCount: conversations.length + (hasReachedMax ? 0 : 1),
        itemBuilder: (context, index) {
          // Show loading indicator at the end
          if (index == conversations.length) {
            return Container(
              padding: EdgeInsets.symmetric(vertical: 16),
              alignment: Alignment.center,
              child: CircularProgressIndicator(strokeWidth: 2),
            );
          }

          final conversation = conversations[index];
          debugPrint(
            '[MainMessagingPage] Conversation: ${conversation.conversationId}',
          );
          return GestureDetector(
            onTap: () => _navigateToChat(conversation, typingStatus),
            child: Conversation(
              conversationId: conversation.conversationId,
              otherUserId: conversation.userId,
              otherUserName: conversation.otherUserName,
              otherUserProfileImageUrl:
                  conversation.otherUserProfileImageUrl != null &&
                          conversation.otherUserProfileImageUrl!.isNotEmpty
                      ? conversation.otherUserProfileImageUrl!
                      : 'assets/EmptyUser.png',
              latestMessage: conversation.latestMessage,
              // Use your date formatter utility here
              latestTimestamp: DateFormatter.formatMessageDate(
                conversation.latestTimestamp,
              ),
              unseenCount: conversation.unseenCount,
              isTyping: typingStatus[conversation.conversationId] ?? false,
              isOnline: false,
            ),
          );
        },
      ),
    );
  }

  Widget _buildErrorState(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 64, color: Colors.red.shade300),
          SizedBox(height: 16),
          Text(
            'Something went wrong',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
          ),
          SizedBox(height: 8),
          Text(
            message,
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              context.read<MessagingBloc>().add(LoadConversations());
            },
            child: Text('Retry'),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    IconData icon;
    String title;
    String subtitle;

    if (_searchQuery.isNotEmpty) {
      icon = Icons.search_off;
      title = 'No results found';
      subtitle = 'Try a different search term';
    } else {
      icon = Icons.message;
      title = 'No messages';
      subtitle = 'Start a new conversation';
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: Colors.grey.shade400),
          SizedBox(height: 16),
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey.shade800,
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 24),
          ElevatedButton.icon(
            icon: Icon(Icons.add),
            label: Text('New Conversation'),
            onPressed: _startNewConversation,
          ),
        ],
      ),
    );
  }
}
