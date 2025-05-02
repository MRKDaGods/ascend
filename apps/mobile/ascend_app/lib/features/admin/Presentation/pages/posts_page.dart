import 'package:ascend_app/features/admin/Presentation/widgets/reported_post_card.dart';
import 'package:ascend_app/features/admin/Presentation/pages/post_search.dart';
import 'package:flutter/material.dart';

class PostsPage extends StatefulWidget {
  const PostsPage({super.key});

  @override
  State<PostsPage> createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
  final List<Map<String, dynamic>> reportedPosts = [
    {
      'id': 'post1',
      'user': {'first_name': 'bibo', 'last_name': 'developing'},
      'content': 'Post: 4',
      'created_at': '2025-05-01T09:02:11.456Z',
      'privacy': 'public',
      'likes_count': 10,
      'comments_count': 5,
      'shares_count': 2,
      'media': [
        {'url': 'https://via.placeholder.com/300'},
      ],
      'reports': [
        {
          'reporter': 'Alice',
          'reason': 'Spam',
          'description': 'This is spam content.',
        },
        {
          'reporter': 'Bob',
          'reason': 'Inappropriate',
          'description': 'This post contains inappropriate content.',
        },
      ],
    },
    {
      'id': 'post2',
      'user': {'first_name': 'john', 'last_name': 'doe'},
      'content': 'Post: 3',
      'created_at': '2025-05-02T10:15:30.123Z',
      'privacy': 'private',
      'likes_count': 3,
      'comments_count': 1,
      'shares_count': 0,
      'media': [],
      'reports': [],
    },
  ];

  final Set<String> expandedPosts = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Manage Reported Posts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: PostSearchDelegate(reportedPosts),
              );
            },
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: reportedPosts.length,
        itemBuilder: (context, index) {
          final post = reportedPosts[index];
          return ReportedPostCard(
            post: post,
            isExpanded: expandedPosts.contains(post['id']),
            onToggleExpand: () {
              setState(() {
                if (expandedPosts.contains(post['id'])) {
                  expandedPosts.remove(post['id']);
                } else {
                  expandedPosts.add(post['id']);
                }
              });
            },
          );
        },
      ),
    );
  }
}