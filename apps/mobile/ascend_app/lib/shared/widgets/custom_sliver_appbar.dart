import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../features/home/presentation/bloc/search_bloc.dart';
import '../../features/home/presentation/bloc/search_event.dart';
import '../../features/home/presentation/bloc/search_state.dart';

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
      backgroundColor: const Color.fromARGB(255, 255, 255, 255),
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
              color: const Color.fromARGB(255, 228, 230, 230),
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
      bottom: widget.showAppBar
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
                        color: selectedButton == 'All' ? Colors.white : Colors.black,
                      ),
                    ),
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all(
                        selectedButton == 'All' ? Colors.green : Colors.blue[100],
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
                      style: TextStyle(
                        color: selectedButton == 'Jobs' ? Colors.white : Colors.black,
                      ),
                    ),
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all(
                        selectedButton == 'Jobs' ? Colors.green : Colors.blue[100],
                      ),
                    ),
                  ),
                  FilledButton(
                    onPressed: () {
                      setState(() {
                        selectedButton = 'My posts';
                      });
                    },
                    child: Text(
                      'My posts',
                      style: TextStyle(
                        color: selectedButton == 'My posts' ? Colors.white : Colors.black,
                      ),
                    ),
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all(
                        selectedButton == 'My posts' ? Colors.green : Colors.blue[100],
                      ),
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
                      style: TextStyle(
                        color: selectedButton == 'Mentions' ? Colors.white : Colors.black,
                      ),
                    ),
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all(
                        selectedButton == 'Mentions' ? Colors.green : Colors.blue[100],
                      ),
                    ),
                  ),
                ],
              ),
            )
          : (widget.showTabBar
              ? const TabBar(
                  tabs: [
                    Tab(
                      text: "Grow",
                    ),
                    Tab(
                      text: "Catchup",
                    ),
                  ],
                )
              : null),
    );
  }
}