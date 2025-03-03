import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../features/home/presentation/bloc/search_bloc.dart';
import '../../features/home/presentation/bloc/search_event.dart';
import '../../features/home/presentation/bloc/search_state.dart';

class CustomSliverAppBar extends StatelessWidget {
  final bool showTabBar;
  final bool pinned;
  final bool floating;
  final bool addpost;
  final bool settings;
  final bool jobs;

  const CustomSliverAppBar({
    super.key,
    this.showTabBar = false,
    this.pinned = true,
    this.floating = true,
    this.addpost = false,
    this.settings = false,
    this.jobs = false,
  });

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      backgroundColor: const Color.fromARGB(255, 255, 255, 255),
      pinned: pinned,
      floating: floating,
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
                  prefixIcon:jobs? const Icon(Icons.work_rounded):const Icon(Icons.search),
                  hintText: jobs?'Search Jobs':'Search',
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
            if (addpost)
              IconButton(
                icon: const Icon(Icons.post_add_outlined),
                onPressed: () {},
              ),
            if (settings)
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
      bottom: showTabBar
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
          : null,
    );
  }
}