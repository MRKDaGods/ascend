import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/notification_bloc.dart';
import '../bloc/notification_event.dart';
import '../bloc/notification_state.dart';
import '../widgets/notification_list.dart';
import '../widgets/notification_filter.dart';
import '../../../../shared/widgets/custom_sliver_appbar.dart';
import '../../../../shared/widgets/app_scaffold.dart';
<<<<<<< HEAD
import '../../domain/entities/notification.dart' as entity;
=======
import 'package:ascend_app/shared/models/notification.dart' as entity;
>>>>>>> Cross

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final ScrollController _scrollController = ScrollController();
<<<<<<< HEAD
  bool _isLoading = false;
  String? _selectedFilterType;
=======
  entity.NotificationType? _selectedFilterType;
>>>>>>> Cross

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
<<<<<<< HEAD
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

=======
        _scrollController.position.maxScrollExtent - 200) {
      // Use FetchNotifications instead
      context.read<NotificationBloc>().add(const FetchNotifications());
    }
  }

>>>>>>> Cross
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
<<<<<<< HEAD
                      onPressed: () => context.read<NotificationBloc>().add(const FetchNotifications()),
=======
                      onPressed:
                          () => context.read<NotificationBloc>().add(
                            const FetchNotifications(),
                          ),
>>>>>>> Cross
                      icon: const Icon(Icons.refresh),
                      label: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

<<<<<<< HEAD
            // Get notifications from state with proper casting
            final notifications = state is NotificationLoaded
                ? state.notifications.cast<entity.Notification>()
                : <entity.Notification>[];

            // Filter notifications based on selected filter type
            final filteredNotifications = _selectedFilterType == null
                ? notifications
                : notifications.where((n) => n.type == _selectedFilterType).toList();
=======
            // Extract available notification types for filter
            final List<entity.NotificationType> availableTypes =
                state is NotificationLoaded
                    ? _extractNotificationTypes(state.notifications)
                    : [];
>>>>>>> Cross

            // Use CustomScrollView with SliverAppBar like in Home
            return CustomScrollView(
              controller: _scrollController,
              slivers: [
                const CustomSliverAppBar(
<<<<<<< HEAD
                  showAppBar: true,
=======
>>>>>>> Cross
                  pinned: false,
                  floating: true,
                  addpost: false,
                  settings: true,
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: NotificationFilter(
<<<<<<< HEAD
                      availableTypes: ['Jobs', 'My posts', 'Mentions'],
=======
                      availableTypes: availableTypes,
>>>>>>> Cross
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
<<<<<<< HEAD
                  child: NotificationList(
                    notifications: filteredNotifications,
                    isLoading: _isLoading || state is NotificationLoading,
                    isMainPage: true,
                    onLoadMore: _loadMoreNotifications,
                    scrollController: _scrollController,
=======
                  child: FilteredNotificationList(
                    filterType: _selectedFilterType,
                    isMainPage: false, // Since it's inside a CustomScrollView
                    onLoadMore:
                        () => context.read<NotificationBloc>().add(
                          const FetchNotifications(),
                        ),
>>>>>>> Cross
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
<<<<<<< HEAD
}
=======

  // Helper method to extract unique notification types
  List<entity.NotificationType> _extractNotificationTypes(
    List<entity.Notification> notifications,
  ) {
    return notifications
        .map<entity.NotificationType>((n) => n.type)
        .toSet()
        .toList();
  }
}

/// Widget that applies filtering to the NotificationList
class FilteredNotificationList extends StatelessWidget {
  final entity.NotificationType? filterType;
  final bool isMainPage;
  final VoidCallback? onLoadMore;
  final ScrollController? scrollController;

  const FilteredNotificationList({
    super.key,
    this.filterType,
    this.isMainPage = true,
    this.onLoadMore,
    this.scrollController,
  });

  @override
  Widget build(BuildContext context) {
    // If there's no filter, just return the regular NotificationList
    if (filterType == null) {
      return NotificationList(
        isMainPage: isMainPage,
        onLoadMore: onLoadMore,
        scrollController: scrollController,
        filterType: filterType, // Add this line
      );
    }

    // Otherwise, use BlocBuilder to apply filtering
    return BlocBuilder<NotificationBloc, NotificationState>(
      builder: (context, state) {
        List<entity.Notification> filteredNotifications = [];
        bool isLoading = false;

        if (state is NotificationLoading) {
          isLoading = true;
        } else if (state is NotificationLoaded) {
          // Filter notifications by selected type
          filteredNotifications =
              state.notifications.where((n) => n.type == filterType).toList();
        }

        if (filteredNotifications.isEmpty && !isLoading) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.filter_list, size: 64, color: Colors.grey[400]),
                const SizedBox(height: 16),
                Text(
                  'No $filterType notifications',
                  style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                ),
                TextButton(
                  onPressed: () {
                    // Find the nearest NotificationsPage and reset its filter
                    final notificationsPageState =
                        context
                            .findAncestorStateOfType<_NotificationsPageState>();
                    if (notificationsPageState != null) {
                      // ignore: invalid_use_of_protected_member
                      notificationsPageState.setState(() {
                        notificationsPageState._selectedFilterType = null;
                      });
                    }
                  },
                  child: const Text('Clear filter'),
                ),
              ],
            ),
          );
        }

        // Show a custom NotificationList with the filtered notifications
        return NotificationList(
          isMainPage: isMainPage,
          onLoadMore: onLoadMore,
          scrollController: scrollController,
          filterType: filterType, // Add this line
        );
      },
    );
  }
}
>>>>>>> Cross
