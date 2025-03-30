import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/utils/reaction_utils.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_box.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_form.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_item.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_state.dart';
import 'package:ascend_app/features/profile/models/user_profile_model.dart';

class CommentDetailPage extends StatefulWidget {
  final Comment parentComment;
  final Function(String, String) onAddReply;
  final Function(String, String?)? onReaction;
  final Comment? replyingTo;
  
  const CommentDetailPage({
    Key? key,
    required this.parentComment,
    required this.onAddReply,
    this.onReaction,
    this.replyingTo,
  }) : super(key: key);
  
  @override
  State<CommentDetailPage> createState() => _CommentDetailPageState();
}

class _CommentDetailPageState extends State<CommentDetailPage> {
  final TextEditingController _replyController = TextEditingController();
  final FocusNode _replyFocusNode = FocusNode();
  
  late Comment _currentParentComment;
  Comment? _replyingTo;
  
  @override
  void initState() {
    super.initState();
    _currentParentComment = widget.parentComment;
    _replyingTo = widget.replyingTo;
    
    if (_replyingTo != null) {
      _replyFocusNode.requestFocus();
    }
  }
  
  @override
  void dispose() {
    _replyController.dispose();
    _replyFocusNode.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Comments'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0.5,
      ),
      body: BlocBuilder<UserProfileBloc, UserProfileState>(
        builder: (context, state) {
          final UserProfileModel? userProfile = 
              state is UserProfileLoaded ? state.profile : null;
          
          return Column(
            children: [
              // Scrollable comment section
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Parent comment using CommentBox
                      _buildParentCommentWithCommentBox(),
                      
                      // Replies list - indented from parent comment
                      if (_currentParentComment.replies.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(left: 40.0, top: 8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: _currentParentComment.replies.map((reply) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 16.0),
                                child: CommentItem(
                                  comment: reply,
                                  onReply: (_) => _setReplyingTo(reply),
                                  onReaction: widget.onReaction != null ? (id, reaction) {
                                    widget.onReaction!(id, reaction);
                                    _updateReaction(id, reaction);
                                  } : null,
                                  onMenuAction: (_, __) {
                                    // Handle menu actions if needed
                                  },
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      
                      // Extra space for scrolling past the input field
                      const SizedBox(height: 80),
                    ],
                  ),
                ),
              ),
              
              // Comment form at the bottom
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 3,
                      offset: const Offset(0, -1),
                    ),
                  ],
                  border: Border(
                    top: BorderSide(color: Colors.grey.shade200),
                  ),
                ),
                padding: EdgeInsets.only(
                  left: 16.0,
                  right: 16.0,
                  top: 12.0,
                  bottom: MediaQuery.of(context).viewInsets.bottom + 12.0,
                ),
                child: CommentForm(
                  controller: _replyController,
                  focusNode: _replyFocusNode,
                  onSubmit: (text) => _submitReply(userProfile, text),
                  hintText: _replyingTo != null 
                    ? 'Reply to ${_replyingTo!.authorName}...'
                    : 'Reply to ${_currentParentComment.authorName}...',
                  userAvatarUrl: userProfile?.avatarUrl,
                  replyingTo: _replyingTo?.authorName,
                  onCancelReply: _replyingTo != null ? () {
                    setState(() {
                      _replyingTo = null;
                    });
                  } : null,
                ),
              ),
            ],
          );
        }
      ),
    );
  }
  
  Widget _buildParentCommentWithCommentBox() {
    return CommentBox(
      authorName: _currentParentComment.authorName,
      authorOccupation: _currentParentComment.authorOccupation,
      timePosted: _currentParentComment.timePosted,
      text: _currentParentComment.text,
      avatarImage: _currentParentComment.authorImageUrl,
      isLiked: _currentParentComment.isLiked,
      reaction: _currentParentComment.currentReaction,
      likeCount: _currentParentComment.likesCount,
      onMenuOptionSelected: (option) {
        // Handle menu options if needed
      },
      onReplyTap: () => _setReplyingTo(_currentParentComment),
      onReactionTap: widget.onReaction != null ? () {
        final newReaction = _currentParentComment.isLiked ? null : 'like';
        if (widget.onReaction != null) {
          widget.onReaction!(_currentParentComment.id, newReaction);
          _updateParentReaction(newReaction);
        }
      } : null,
      onReactionLongPress: widget.onReaction != null ? () {
        final RenderBox box = context.findRenderObject() as RenderBox;
        final position = box.localToGlobal(Offset.zero);
        
        ReactionUtils.showReactionsPopup(
          context: context,
          position: Offset(position.dx + 50, position.dy + 100),
          itemId: _currentParentComment.id,
          onReactionSelected: (id, reaction) {
            if (widget.onReaction != null) {
              widget.onReaction!(id, reaction);
              _updateParentReaction(reaction);
            }
          },
        );
      } : null,
    );
  }
  
  void _submitReply(UserProfileModel? userProfile, String text) {
    if (text.isEmpty) return;
    
    // Create a new reply comment with current user's profile data
    final newReply = Comment.create(
      text: text,
      parentId: _currentParentComment.id,
      authorName: userProfile?.name ?? 'You',
      authorImageUrl: userProfile?.avatarUrl ?? 'assets/logo.jpg',
      authorOccupation: userProfile?.position ?? '',
    );
    
    // Add the reply using the callback
    widget.onAddReply(text, _currentParentComment.id);
    
    // Update local state to show the new reply immediately
    setState(() {
      _currentParentComment = _currentParentComment.copyWithNewReply(newReply);
      _replyingTo = null;
    });
    
    _replyController.clear();
  }
  
  void _updateReaction(String replyId, String? reactionType) {
    setState(() {
      final updatedReplies = _currentParentComment.replies.map((reply) {
        if (reply.id == replyId) {
          return reply.toggleReaction(reactionType);
        }
        return reply;
      }).toList();
      
      _currentParentComment = _currentParentComment.copyWith(replies: updatedReplies);
    });
  }
  
  void _updateParentReaction(String? reactionType) {
    setState(() {
      _currentParentComment = _currentParentComment.toggleReaction(reactionType);
    });
  }
  
  void _setReplyingTo(Comment? comment) {
    setState(() {
      _replyingTo = comment;
    });
    _replyFocusNode.requestFocus();
  }
}