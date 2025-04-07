import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_state.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/models/post_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_form.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_item.dart';

class CommentDetailPage extends StatefulWidget {
  final Comment parentComment;
  final Comment? replyingTo;
  final Function(String, String) onAddReply;
  final Function(String, String?)? onReaction;
  final String currentUserId;
  final String postId; // Add postId to find the post in the state

  const CommentDetailPage({
    Key? key,
    required this.parentComment,
    this.replyingTo,
    required this.onAddReply,
    this.onReaction,
    required this.currentUserId,
    required this.postId,
  }) : super(key: key);

  @override
  State<CommentDetailPage> createState() => _CommentDetailPageState();
}

class _CommentDetailPageState extends State<CommentDetailPage> {
  final TextEditingController _replyController = TextEditingController();
  final FocusNode _replyFocusNode = FocusNode();

  late Comment _currentParentComment;
  Comment? _replyingTo;
// Add a flag to toggle replies visibility

  @override
  void initState() {
    super.initState();
    _currentParentComment = widget.parentComment;
    _replyingTo = widget.replyingTo;

    if (widget.replyingTo != null) {
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
    return BlocBuilder<PostBloc, PostState>(
      builder: (context, state) {
        if (state is PostsLoaded) {
          // Find the post containing this comment
          final post = state.posts.firstWhere(
            (post) => post.comments.any(
              (comment) => comment.id == _currentParentComment.id,
            ),
            orElse: () => PostModel.empty(),
          );

          // Find the updated parent comment
          final updatedParentComment = post.comments.firstWhere(
            (comment) => comment.id == _currentParentComment.id,
            orElse: () => _currentParentComment,
          );

          // Update our local reference
          _currentParentComment = updatedParentComment;

          return Scaffold(
            appBar: AppBar(title: const Text('Comment'), elevation: 0),
            body: Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CommentItem(
                            comment: updatedParentComment,
                            showReplies: false,
                            isCurrentUser:
                                updatedParentComment.authorId ==
                                widget.currentUserId,
                            onReaction: widget.onReaction,
                          ),
                          if (updatedParentComment.replies.isNotEmpty) ...[
                            
                            ...List.generate(updatedParentComment.replies.length, (index) {
                              final reply = updatedParentComment.replies[index];
                              return Padding(
                                padding: const EdgeInsets.only(left: 40.0),
                                child: CommentItem(
                                  comment: reply,
                                  showReplies: false,
                                  isCurrentUser: reply.authorId == widget.currentUserId,
                                  onReaction: widget.onReaction,
                                  onReply: (commentId) {
                                    setState(() {
                                      _replyingTo = reply;
                                    });
                                    _replyFocusNode.requestFocus();
                                  },
                                ),
                              );
                            }),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: CommentForm(
                    controller: _replyController,
                    focusNode: _replyFocusNode,
                    onSubmit: (text) {
                      widget.onAddReply(text, _currentParentComment.id);
                      _replyController.clear();
                      setState(() {
                        _replyingTo = null;
                      });
                    },
                    hintText:
                        _replyingTo != null
                            ? "Reply to ${_replyingTo!.authorId == widget.currentUserId ? 'yourself' : _replyingTo!.authorName}"
                            : "Reply to ${_currentParentComment.authorId == widget.currentUserId ? 'yourself' : _currentParentComment.authorName}",
                  ),
                ),
              ],
            ),
          );
        }

        // If not loaded, show loading state
        return const Scaffold(body: Center(child: CircularProgressIndicator()));
      },
    );
  }
}
