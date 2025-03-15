import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'bloc/search_bloc.dart';
import 'bloc/search_event.dart';
import 'bloc/search_state.dart';

class CustomSliverAppBar extends StatefulWidget {
  final bool showTabBar;
  final bool pinned;
  final bool floating;
  final bool addpost;
  final bool settings;
  final bool jobs;
  final bool showAppBar;

  const CustomSliverAppBar({
    super.key,
    this.showTabBar = false,
    this.pinned = true,
    this.floating = true,
    this.addpost = false,
    this.settings = false,
    this.jobs = false,
    this.showAppBar = false,
  });

  @override
  _CustomSliverAppBarState createState() => _CustomSliverAppBarState();
}

class _CustomSliverAppBarState extends State<CustomSliverAppBar> {
  String selectedButton = 'All';

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      
      pinned: widget.pinned,
      floating: widget.floating,
      leading: GestureDetector(
        onTap: () {},
        child: Card(
          clipBehavior: Clip.hardEdge,
          shape: const CircleBorder(),
          child: Image.asset('assets/logo.jpg', fit: BoxFit.contain),
        ),
      ),
      title: BlocProvider(
        create: (context) => SearchBloc(),
        child: BlocBuilder<SearchBloc, SearchState>(
          builder: (context, state) {
            return Card.outlined(
              
              child: TextField(
                onChanged: (value) {
                  context.read<SearchBloc>().add(SearchTextChanged(value));
                },
                decoration: InputDecoration(
                  prefixIcon: widget.jobs ? const Icon(Icons.work_rounded) : const Icon(Icons.search),
                  hintText: widget.jobs ? 'Search Jobs' : 'Search',
                  border: InputBorder.none,
                  suffixIcon: state.showDeleteButton
                      ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            context.read<SearchBloc>().add(SearchTextChanged(''));
                          },
                        )
                      : IconButton(
                          icon: const Icon(Icons.qr_code),
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (context) => AlertDialog(
                                title: const Text('QR Code'),
                                content: const Text('This is a QR Code'),
                                actions: [
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                    },
                                    child: const Text('OK'),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ),
            );
          },
        ),
      ),
      actions: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.addpost)
              IconButton(
                icon: const Icon(Icons.post_add_outlined),
                onPressed: () {},
              ),
            if (widget.settings)
              IconButton(
                icon: const Icon(Icons.settings_sharp),
                onPressed: () {},
              ),
            IconButton(
              icon: const Icon(Icons.message_outlined),
              onPressed: () {},
            ),
          ],
        ),
      ],
      bottom: widget.showTabBar
          ? TabBar(
              tabs: const [
                Tab(text: "Grow"),
                Tab(text: "Catchup"),
              ],
              indicatorColor: Theme.of(context).colorScheme.primary,
              labelColor: Theme.of(context).colorScheme.primary,
            )
          : (widget.showAppBar
              ? PreferredSize(
                  preferredSize: const Size.fromHeight(50.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      FilledButton(
                        onPressed: () {
                          setState(() {
                            selectedButton = 'All';
                          });
                        },
                        child: Text(
                          'All',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            
                          ),
                          
                        ),
                      ),
                      FilledButton(
                        onPressed: () {
                          setState(() {
                            selectedButton = 'Jobs';
                          });
                        },
                        child: Text(
                          'Jobs',
                          
                        ),
                        
                      ),
                      FilledButton(
                        onPressed: () {
                          setState(() {
                            selectedButton = 'My posts';
                          });
                        },
                        style: ButtonStyle(
                          
                        ),
                        child: Text(
                          'My posts',
                          
                        ),
                      ),
                      FilledButton(
                        onPressed: () {
                          setState(() {
                            selectedButton = 'Mentions';
                          });
                        },
                        child: Text(
                          'Mentions',
                          
                        ),
                        
                      ),
                    ],
                  ),
                )
              : null),
    );
  }
}