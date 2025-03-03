import 'package:ascend_app/features/home/presentation/widgets/post.dart';
import 'package:flutter/material.dart';

import '../../../../shared/widgets/custom_sliver_appbar.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final List<String> _items = List.generate(20, (index) => 'Item $index');
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
    if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
      _loadMoreItems();
    }
  }

  void _loadMoreItems() {
    setState(() {
      _items.addAll(List.generate(20, (index) => 'Item ${_items.length + index}'));
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
              return Post(
                title: _items[index],
                description: 'Description of ${_items[index]}',
              );
            },
            childCount: _items.length,
          ),
        ),
      ],
    );
  }
}
