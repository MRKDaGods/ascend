import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:ascend_app/features/admin/Presentation/pages/analytics_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/jobs_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/posts_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/users_page.dart';
import 'package:ascend_app/features/admin/bloc/analytics/bloc/analytics_bloc.dart';
import 'package:ascend_app/features/admin/data/services/admin_api_client.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AdminHomePage extends StatefulWidget {
  const AdminHomePage({super.key});

  @override
  State<AdminHomePage> createState() => _AdminHomePageState();
}

class _AdminHomePageState extends State<AdminHomePage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Admin Panel'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Analytics'),
              Tab(text: 'Users'),
              Tab(text: 'Posts'),
              Tab(text: 'Jobs'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            BlocProvider(
              create: (_) => AnalyticsBloc(
                repository: AdminRepository(
                  apiClient: AdminApiClient(baseUrl: 'http://api.ascendx.tech/admin'),
                ),
              )..add(const FetchAnalyticsEvent('week')), // Adjust the event as needed
              child: const AnalyticsPage(),
            ),
            const UsersPage(),
            const PostsPage(),
            const JobsPage(),
          ],
        ),
      ),
    );
  }
}

class AnalyticsRepository {
  final ApiClient client;

  AnalyticsRepository({required this.client});

  // Add methods to fetch analytics data if needed
}