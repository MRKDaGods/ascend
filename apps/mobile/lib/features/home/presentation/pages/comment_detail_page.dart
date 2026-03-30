import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_bloc.dart';
import 'package:ascend_app/features/home/bloc/post_bloc/post_state.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_form.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/comment_item.dart'; // Ensure CommentItem is imported

class CommentDetailPage extends StatefulWidget {
  final Comment parentComment; // Keep for initial ID/fallback
  final Comment? replyingTo;
  final Function(String, String) onAddReply;
  final Function(String, String?)? onReaction;
  final String currentUserId;
  final String postId; // Needed to find the post in state

  const CommentDetailPage({
    super.key,
    required this.parentComment,
    this.replyingTo,
    required this.onAddReply,
    this.onReaction,
    required this.currentUserId,
    required this.postId,
  });

  @override
  State<CommentDetailPage> createState() => _CommentDetailPageState();
}

class _CommentDetailPageState extends State<CommentDetailPage> {
  final TextEditingController _replyController = TextEditingController();
  final FocusNode _replyFocusNode = FocusNode();
  // Remove _currentParentComment state variable
  Comment? _replyingTo;

  @override
  void initState() {
    super.initState();
    _replyingTo = widget.replyingTo;
    if (widget.replyingTo != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _replyFocusNode.requestFocus();
      });
    }
  }

  @override
  void dispose() {
    _replyController.dispose();
    _replyFocusNode.dispose();
    super.dispose();
  }

  // Helper to find a comment by ID recursively within a list
  Comment? findCommentByIdRecursive(List<Comment> comments, String id) {
    for (final comment in comments) {
      if (comment.id == id) {
        return comment;
      }
      if (comment.replies.isNotEmpty) {
        final foundInReply = findCommentByIdRecursive(comment.replies, id);
        if (foundInReply != null) {
          return foundInReply;
        }
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PostBloc, PostState>(
      builder: (context, state) {
        Comment? currentParentCommentData; // Use a local variable within build

        if (state is PostsLoaded) {
          final post = state.getPostById(widget.postId); // Use extension method
          if (post != null) {
            // Find the comment using the recursive helper and the ID from the initial widget data
            currentParentCommentData = findCommentByIdRecursive(
              post.comments,
              widget.parentComment.id,
            );
            debugPrint(
              '🔄 [CommentDetailPage] Found parent comment ${currentParentCommentData?.id} in Bloc state. Replies count: ${currentParentCommentData?.replies.length}',
            );
          } else {
            debugPrint(
              '⚠️ [CommentDetailPage] Post ${widget.postId} not found in Bloc state.',
            );
          }
        }

        // Fallback to the initially passed comment if not found or state is wrong type
        currentParentCommentData ??= widget.parentComment;
        debugPrint(
          '🔄 [CommentDetailPage] Using parent comment ${currentParentCommentData.id} for build. Replies count: ${currentParentCommentData.replies.length}',
        );

        // Ensure we have a non-null comment to work with for the rest of the build
        final finalParentComment = currentParentCommentData;

        return Scaffold(
          appBar: AppBar(
            title: const Text('Replies'), // Changed title
            elevation: 1,
            backgroundColor: Colors.white,
            foregroundColor: Colors.black,
          ),
          body: Column(
            children: [
              Expanded(
                // Use ListView instead of SingleChildScrollView for better structure
                child: ListView(
                  padding: const EdgeInsets.all(16.0),
                  children: [
                    // Display the Parent Comment
                    CommentItem(
                      comment: finalParentComment,
                      // Set showReplies based on whether you want the "View Replies" text
                      // For this page, we always show replies below, so maybe false?
                      showReplies: false,
                      isCurrentUser:
                          finalParentComment.authorId == widget.currentUserId,
                      onReaction: widget.onReaction,
                      // Disable reply navigation from the parent on this page
                      onReply: null,
                      // Add other necessary parameters if CommentItem requires them
                    ),
                    const Divider(height: 24), // Add space before replies
                    // Display the Replies
                    if (finalParentComment.replies.isNotEmpty)
                      // Use ListView.separated for replies with dividers
                      ListView.separated(
                        shrinkWrap: true, // Crucial inside another scrollable
                        physics:
                            const NeverScrollableScrollPhysics(), // Disable inner scrolling
                        itemCount: finalParentComment.replies.length,
                        itemBuilder: (context, index) {
                          final reply = finalParentComment.replies[index];
                          return Padding(
                            // Indent replies visually
                            padding: const EdgeInsets.only(left: 40.0),
                            child: CommentItem(
                              comment: reply,
                              // Replies themselves don't show nested replies on this page
                              showReplies: false,
                              isCurrentUser:
                                  reply.authorId == widget.currentUserId,
                              onReaction: widget.onReaction,
                              // Allow tapping reply on a reply to update the input hint
                              onReply: (commentId) {
                                setState(() {
                                  _replyingTo =
                                      reply; // Set the specific reply being replied to
                                });
                                _replyFocusNode.requestFocus();
                              },
                              // Add other necessary parameters if CommentItem requires them
                            ),
                          );
                        },
                        separatorBuilder:
                            (context, index) => const SizedBox(
                              height: 16,
                            ), // Space between replies
                      )
                    else
                      // Message if no replies exist yet
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 20.0),
                          child: Text("No replies yet."),
                        ),
                      ),
                  ],
                ),
              ),

              // Reply Input Form Area
              Container(
                // Wrap form in a container for styling
                decoration: BoxDecoration(
                  color:
                      Theme.of(
                        context,
                      ).scaffoldBackgroundColor, // Match background
                  boxShadow: [
                    BoxShadow(
                      // ignore: deprecated_member_use
                      color: Colors.black.withOpacity(0.1),
                      spreadRadius: 0,
                      blurRadius: 4,
                      offset: const Offset(0, -2), // Shadow upwards
                    ),
                  ],
                ),
                padding: EdgeInsets.only(
                  left: 16.0,
                  right: 16.0,
                  top: 16.0,
                  // Adjust bottom padding based on keyboard visibility if needed
                  bottom: MediaQuery.of(context).viewInsets.bottom + 16.0,
                ),
                child: CommentForm(
                  controller: _replyController,
                  focusNode: _replyFocusNode,
                  onSubmit: (text) {
                    // Always submit reply to the main parent comment of this page
                    final parentIdToSubmit = finalParentComment.id;
                    debugPrint(
                      '📤 [CommentDetailPage] Submitting reply. Parent Comment ID: $parentIdToSubmit',
                    );
                    widget.onAddReply(text, parentIdToSubmit);
                    _replyController.clear();
                    setState(() {
                      _replyingTo = null; // Clear specific reply target
                    });
                    _replyFocusNode.unfocus(); // Hide keyboard
                  },
                  // Update hint text based on whether replying to the main comment or a specific reply
                  hintText:
                      _replyingTo != null
                          ? "Reply to ${_replyingTo!.authorId == widget.currentUserId ? 'yourself' : _replyingTo!.authorName}"
                          : "Reply to ${finalParentComment.authorId == widget.currentUserId ? 'yourself' : finalParentComment.authorName}",
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
