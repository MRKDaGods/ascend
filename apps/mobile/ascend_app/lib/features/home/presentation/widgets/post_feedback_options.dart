import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/home/domain/entities/post.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/feed_post_bloc.dart';
import 'package:ascend_app/features/home/presentation/bloc/post/feed_post_event.dart';

class PostFeedbackOptions extends StatelessWidget {
  final Post post;
  
  const PostFeedbackOptions({
    super.key,
    required this.post,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Tell us why you don't want to see this",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16.0,
              ),
            ),
            const SizedBox(height: 16.0),
            
            _buildFeedbackOption(
              context, 
              "I'm not interested in this content",
              () {
                context.read<FeedPostBloc>().add(
                  MarkFeedPostNotInterested(postId: post.id)
                );
              }
            ),
            
            _buildFeedbackOption(
              context, 
              "Unfollow ${post.authorName}",
              () {
                context.read<FeedPostBloc>().add(
                  UnfollowFeedPostOwner(
                    postId: post.id,
                    ownerName: post.authorName,
                  )
                );
              }
            ),
            
            _buildFeedbackOption(
              context,
              "Report this post",
              () {
                context.read<FeedPostBloc>().add(
                  ReportFeedPost(postId: post.id)
                );
              }
            ),
            
            const SizedBox(height: 12.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {
                    context.read<FeedPostBloc>().add(
                      const HideFeedPostFeedbackOptions()
                    );
                  },
                  child: const Text("Cancel"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildFeedbackOption(
    BuildContext context, 
    String text, 
    VoidCallback onTap
  ) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12.0),
        child: Row(
          children: [
            Expanded(
              child: Text(text),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }
}

