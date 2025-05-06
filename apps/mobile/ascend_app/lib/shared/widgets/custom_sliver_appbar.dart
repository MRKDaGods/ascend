import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../extensions/scaffold_extensions.dart';
import '../../features/profile/bloc/user_profile_bloc.dart';
import '../../features/profile/bloc/user_profile_state.dart';
import 'package:ascend_app/shared/widgets/user_avatar.dart';
import 'package:ascend_app/core/routes/app_routes.dart'; // Import app routes

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
  final VoidCallback? onJobAction;
  final VoidCallback?
  onSearchAction; // New callback for general search activation
  final bool showProfileAvatar; // Added property to show/hide QR code button
  final BuildContext? contextin;
  const CustomSliverAppBar({
    super.key,
    this.showTabBar = false,
    this.pinned = true,
    this.floating = true,
    this.addpost = false,
    this.settings = false,
    this.jobs = false,
    this.showAppBar = false,
    this.onJobAction, // To detetct the job action
    this.onSearchAction, // Initialize the new callback
    this.showProfileAvatar = true, // To show/hide profile avatar
    this.contextin, // To show/hide context
  });

  @override
  State<CustomSliverAppBar> createState() => _CustomSliverAppBarState();
}

class _CustomSliverAppBarState extends State<CustomSliverAppBar> {
  String selectedButton = 'All';

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      pinned: widget.pinned,
      floating: widget.floating,
      //backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      elevation: 0,
      leading: Builder(
        builder:
            (context) => Padding(
              padding: const EdgeInsets.only(left: 8.0),
              child: GestureDetector(
                onTap: () {
                  Scaffold.of(context).openDrawerWithAnimation(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOutCubic,
                  );
                },
                child: BlocBuilder<UserProfileBloc, UserProfileState>(
                  builder: (context, state) {
                    final avatarUrl =
                        state is UserProfileLoaded
                            ? state.profile.profilePictureUrl
                            : null;

                    return Padding(
                      padding: const EdgeInsets.all(4.0),
                      child:
                          widget.showProfileAvatar
                              ? UserAvatar(imageUrl: avatarUrl, radius: 18)
                              : IconButton(
                                icon: Icon(Icons.arrow_back),
                                padding: EdgeInsets.zero,
                                onPressed: () {
                                  Navigator.pop(widget.contextin!);
                                },
                              ),
                    );
                  },
                ),
              ),
            ),
      ),
      title: BlocBuilder<SearchBloc, SearchState>(
        builder: (context, state) {
          return Container(
            height: 40,
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: Theme.of(context).dividerColor.withOpacity(0.5),
                width: 1,
              ),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(8),
                onTap: () {
                  if (widget.jobs && widget.onJobAction != null) {
                    widget.onJobAction!();
                  } else if (!widget.jobs && widget.onSearchAction != null) {
                    widget.onSearchAction!();
                  }
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: Row(
                    children: [
                      Icon(
                        widget.jobs ? Icons.work_rounded : Icons.search,
                        size: 20,
                        color: Theme.of(context).hintColor,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          widget.jobs ? 'Search Jobs' : 'Search',
                          style: TextStyle(
                            color: Theme.of(context).hintColor,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      if (state.showDeleteButton)
                        IconButton(
                          icon: const Icon(Icons.clear, size: 20),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () {
                            context.read<SearchBloc>().add(
                              SearchTextChanged(''),
                            );
                          },
                        )
                      else
                        IconButton(
                          icon: const Icon(Icons.qr_code, size: 20),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder:
                                  (context) => AlertDialog(
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
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
      actions: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.addpost)
              IconButton(
                icon: const Icon(Icons.post_add_outlined, size: 24),
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.createPost);
                },
              ),
            if (widget.settings)
              IconButton(
                icon: const Icon(Icons.settings_outlined, size: 24),
                onPressed: () {},
              ),
            Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: IconButton(
                icon: const Icon(Icons.message_outlined, size: 24),
                onPressed: () {
                  Navigator.pushNamed(context, RouteNames.mainMessage);
                },
              ),
            ),
          ],
        ),
      ],
      bottom:
          widget.showTabBar
              ? PreferredSize(
                preferredSize: const Size.fromHeight(48),
                child: Container(
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: Theme.of(context).dividerColor.withOpacity(0.5),
                        width: 1,
                      ),
                    ),
                  ),
                  child: TabBar(
                    tabs: const [Tab(text: "Grow"), Tab(text: "Catchup")],
                    indicatorColor: Theme.of(context).colorScheme.primary,
                    labelColor: Theme.of(context).colorScheme.primary,
                    indicatorWeight: 3,
                    labelStyle: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    unselectedLabelStyle: const TextStyle(fontSize: 14),
                  ),
                ),
              )
              : (widget.showAppBar
                  ? PreferredSize(
                    preferredSize: const Size.fromHeight(50.0),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _buildFilterButton('All'),
                            const SizedBox(width: 8),
                            _buildFilterButton('Jobs'),
                            const SizedBox(width: 8),
                            _buildFilterButton('My posts'),
                            const SizedBox(width: 8),
                            _buildFilterButton('Mentions'),
                          ],
                        ),
                      ),
                    ),
                  )
                  : null),
    );
  }

  Widget _buildFilterButton(String label) {
    final isSelected = selectedButton == label;
    return OutlinedButton(
      onPressed: () {
        setState(() {
          selectedButton = label;
        });
      },
      style: ButtonStyle(
        backgroundColor: MaterialStateProperty.all(
          isSelected
              ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
              : Colors.transparent,
        ),
        side: MaterialStateProperty.all(
          BorderSide(
            color:
                isSelected
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).dividerColor,
          ),
        ),
        padding: MaterialStateProperty.all(
          const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        ),
        shape: MaterialStateProperty.all(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color:
              isSelected
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).textTheme.bodyMedium?.color,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
}
