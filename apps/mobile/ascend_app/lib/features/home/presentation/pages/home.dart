import 'package:ascend_app/features/home/presentation/widgets/post.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/post_model.dart';

import '../../../../shared/widgets/custom_sliver_appbar.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final List<PostModel> _posts = List.generate(
    20,
    (index) => PostModel(
      title: 'Title $index',
      description: 'Description of Title $index',
      images: [
        "assets/images_posts/Screenshot 2023-08-06 150447.png",
        "assets/images_posts/Screenshot 2023-12-31 100011.png",
        "assets/images_posts/Screenshot 2024-05-01 174349.png",
        "assets/images_posts/Screenshot 2024-09-20 152333.png",
        "assets/images_posts/Screenshot 2024-10-04 102509.png",
      ],
    ),
  );
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      _loadMoreItems();
    }
  }

void _loadMoreItems() {
  setState(() {
    _posts.addAll(
      List.generate(
        20,
        (index) => PostModel(
          title: 'Title ${_posts.length + index}',
          description: 'Description of Title ${_posts.length + index}',
          images: [
            "assets/images_posts/Screenshot 2023-08-06 150447.png",
          ],
        ),
      ),
    );
  });
}


  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      controller: _scrollController,
      slivers: [
        const CustomSliverAppBar(pinned: false, floating: false, addpost: true),
        SliverList(
          delegate: SliverChildBuilderDelegate(
            (context, index) {
              final post = _posts[index];
              return Post(
                title: post.title,
                description: post.description,
                images: post.images,
              );
            },
            childCount: _posts.length,
          ),
        ),
      ],
    );
  }
}
