import 'package:ascend_app/features/home/presentation/widgets/search/post_search_result_model.dart';
import 'package:flutter/material.dart';

class PostSearchResultTile extends StatelessWidget {
  final PostSearchResult post;

  const PostSearchResultTile({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    // Basic ListTile for post results
    return ListTile(
       leading: CircleAvatar( // Placeholder for user avatar
         child: Icon(Icons.person_outline),
       ),
       title: Text(post.user.fullName, style: TextStyle(fontWeight: FontWeight.bold)),
       subtitle: Text(
         post.content,
         maxLines: 3,
         overflow: TextOverflow.ellipsis,
       ),
       onTap: () {
         // TODO: Implement navigation to post details
         ScaffoldMessenger.of(context).showSnackBar(
           SnackBar(content: Text('Navigate to post ${post.id}')),
         );
       },
    );
  }
}
