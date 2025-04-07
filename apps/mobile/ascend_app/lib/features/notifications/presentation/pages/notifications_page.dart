import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/notification_bloc.dart';
import '../bloc/notification_event.dart';
import '../bloc/notification_state.dart';
import '../widgets/notification_list.dart';
import '../widgets/notification_filter.dart';
import '../../../../shared/widgets/custom_sliver_appbar.dart';
import '../../../../shared/widgets/app_scaffold.dart';
import '../../domain/entities/notification.dart' as entity;

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  String? _selectedFilterType;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);

    // Load initial notifications through BLoC
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NotificationBloc>().add(const FetchNotifications());
    });
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoading) {
      _loadMoreNotifications();
    }
  }

  void _loadMoreNotifications() {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    // Here you'd typically call a loadMore event on your bloc
    // For now we'll just simulate with a delay
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      body: SafeArea(
        child: BlocBuilder<NotificationBloc, NotificationState>(
          builder: (context, state) {
            if (state is NotificationInitial) {
              return const Center(child: CircularProgressIndicator());
            }

            if (state is NotificationError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Theme.of(context).colorScheme.error,
                    ),
                    const SizedBox(height: 16),
                    Text('Error: ${state.message}'),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => context.read<NotificationBloc>().add(const FetchNotifications()),
                      icon: const Icon(Icons.refresh),
                      label: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            // Get notifications from state with proper casting
            final notifications = state is NotificationLoaded
                ? state.notifications.cast<entity.Notification>()
                : <entity.Notification>[];

            // Filter notifications based on selected filter type
            final filteredNotifications = _selectedFilterType == null
                ? notifications
                : notifications.where((n) => n.type == _selectedFilterType).toList();

            // Use CustomScrollView with SliverAppBar like in Home
            return CustomScrollView(
              controller: _scrollController,
              slivers: [
                const CustomSliverAppBar(
                  showAppBar: true,
                  pinned: false,
                  floating: true,
                  addpost: false,
                  settings: true,
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: NotificationFilter(
                      availableTypes: ['Jobs', 'My posts', 'Mentions'],
                      selectedType: _selectedFilterType,
                      onFilterSelected: (type) {
                        setState(() {
                          _selectedFilterType = type;
                        });
                      },
                    ),
                  ),
                ),
                // Using SliverFillRemaining to properly fill the remaining space
                SliverFillRemaining(
                  child: NotificationList(
                    notifications: filteredNotifications,
                    isLoading: _isLoading || state is NotificationLoading,
                    isMainPage: true,
                    onLoadMore: _loadMoreNotifications,
                    scrollController: _scrollController,
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}