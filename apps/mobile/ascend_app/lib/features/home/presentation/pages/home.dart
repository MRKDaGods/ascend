
import 'package:ascend_app/features/home/presentation/bloc/search_bloc.dart';
import 'package:ascend_app/features/home/presentation/bloc/search_event.dart';
import 'package:ascend_app/features/home/presentation/bloc/search_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          backgroundColor: const Color.fromARGB(255, 255, 255, 255),
          pinned: false,
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
                      prefixIcon: const Icon(Icons.search),
                      hintText: 'Search',
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
                IconButton(
                  icon: const Icon(Icons.post_add_outlined),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.message_outlined),
                  onPressed: () {},
                ),
              ],
            ),
          ],
        ),
        const SliverFillRemaining(
          child: Card(
            color: Color.fromARGB(255, 255, 255, 255),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('SliverFillRemaining'),
              ],
            ),
          ),
        ),
      ],
    );
  }
}