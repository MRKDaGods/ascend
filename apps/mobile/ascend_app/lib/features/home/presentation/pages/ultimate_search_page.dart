import 'dart:async';

import 'package:ascend_app/features/home/bloc/search/search_bloc.dart';
import 'package:ascend_app/features/home/presentation/widgets/search/post_search_result_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/search/post_search_result_tile.dart';
import 'package:ascend_app/features/home/presentation/widgets/search/user_search_result_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/search/user_search_result_tile.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UltimateSearchPage extends StatefulWidget {
  final VoidCallback? onBackPressed; // Add callback for back navigation

  const UltimateSearchPage({super.key, this.onBackPressed}); // Initialize callback

  @override
  State<UltimateSearchPage> createState() => _UltimateSearchPageState();
}

class _UltimateSearchPageState extends State<UltimateSearchPage> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final _debounce = Debouncer(milliseconds: 500);

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _debounce.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    _debounce.run(() {
      final query = _searchController.text.trim();
      if (query.isNotEmpty) {
        context.read<SearchBloc>().add(PerformSearch(query: query, offset: 0));
      } else {
        context.read<SearchBloc>().add(ClearSearch());
      }
    });
  }

  void _onScroll() {
    if (_isBottom) {
      final currentState = context.read<SearchBloc>().state;
      if (currentState is SearchLoaded && !currentState.hasReachedMax) {
        context.read<SearchBloc>().add(
              PerformSearch(
                query: currentState.currentQuery,
                offset: currentState.currentOffset +
                    10, // Assuming limit is 10
                limit: 10,
              ),
            );
      }
    }
  }

  bool get _isBottom {
    if (!_scrollController.hasClients) return false;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.offset;
    // Trigger loading a bit before reaching the absolute bottom
    return currentScroll >= (maxScroll * 0.9);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton( // Add back button
          icon: const Icon(Icons.arrow_back),
          onPressed: widget.onBackPressed, // Trigger the callback
        ),
        title: TextField(
          controller: _searchController,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Search users, posts, jobs...',
            border: InputBorder.none,
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      _searchController.clear();
                      context.read<SearchBloc>().add(ClearSearch());
                    },
                  )
                : null,
          ),
          style: const TextStyle(fontSize: 18),
        ),
      ),
      body: BlocBuilder<SearchBloc, SearchState>(
        builder: (context, state) {
          if (state is SearchLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is SearchError) {
            return Center(child: Text('Error: ${state.message}'));
          } else if (state is SearchLoaded) {
            if (state.results.isEmpty) {
              return const Center(child: Text('No results found.'));
            }
            return ListView.builder(
              controller: _scrollController,
              itemCount: state.hasReachedMax
                  ? state.results.length
                  : state.results.length + 1, // +1 for loading indicator
              itemBuilder: (context, index) {
                if (index >= state.results.length) {
                  // Loading indicator at the bottom
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: CircularProgressIndicator(),
                    ),
                  );
                }
                final item = state.results[index];

                // --- Render based on type ---
                try {
                  if (item is Map<String, dynamic> && item['type'] == 'user') {
                    final user = UserSearchResult.fromJson(item['data'] as Map<String, dynamic>);
                    return UserSearchResultTile(user: user);
                  } else if (item is Map<String, dynamic> && item['type'] == 'post') {
                    final post = PostSearchResult.fromJson(item['data'] as Map<String, dynamic>);
                    return PostSearchResultTile(post: post);
                  } else {
                    // Fallback for unknown types or structure issues
                    return ListTile(
                      title: Text('Unknown item type: ${item.toString()}'),
                    );
                  }
                } catch (e) {
                   // Handle potential parsing errors
                   print("Error parsing search result item: $e \nItem: $item");
                   return ListTile(
                     leading: Icon(Icons.error_outline, color: Colors.red),
                     title: Text('Error displaying this item'),
                     subtitle: Text(e.toString()),
                   );
                }
                // --- End of rendering logic ---
              },
            );
          } else {
            // SearchInitial state
            return const Center(child: Text('Start typing to search.'));
          }
        },
      ),
    );
  }
}

// Simple Debouncer class
class Debouncer {
  final int milliseconds;
  VoidCallback? action;
  Timer? _timer;

  Debouncer({required this.milliseconds});

  run(VoidCallback action) {
    if (_timer != null) {
      _timer!.cancel();
    }
    _timer = Timer(Duration(milliseconds: milliseconds), action);
  }

  dispose() {
    _timer?.cancel();
  }
}


