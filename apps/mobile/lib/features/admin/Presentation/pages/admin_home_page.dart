import 'package:ascend_app/features/admin/Presentation/pages/analytics_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/jobs_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/posts_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/admin_users_page.dart';
import 'package:ascend_app/features/admin/bloc/analytics/bloc/analytics_bloc.dart';
import 'package:ascend_app/features/admin/bloc/jobs/bloc/jobs_bloc.dart';
import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_bloc.dart';
import 'package:ascend_app/features/admin/bloc/users/bloc/users_bloc.dart';
import 'package:ascend_app/features/admin/data/services/admin_api_client.dart';
import 'package:ascend_app/features/admin/data/services/user_api_client.dart';
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
              create:
                  (_) => AnalyticsBloc(
                    repository: AdminRepository(
                      apiClient: AdminApiClient(
                        baseUrl: 'https://api.ascendx.tech/admin',
                      ),
                      userApiClient: UserApiClient(
                        baseUrl: 'https://api.ascendx.tech/auth',
                      ),
                    ),
                  )..add(const FetchAnalyticsEvent('week')),
              child: const AnalyticsPage(),
            ),
            BlocProvider(
              create:
                  (_) => UsersBloc(
                    adminRepository: AdminRepository(
                      apiClient: AdminApiClient(
                        baseUrl: 'https://api.ascendx.tech/admin',
                      ),
                      userApiClient: UserApiClient(
                        baseUrl: 'https://api.ascendx.tech/auth',
                      ),
                    ),
                  )..add(FetchReportedUsers()),
              child: const UsersPage(),
            ),
            BlocProvider(
              create:
                  (_) => PostsBloc(
                    apiClient: AdminApiClient(
                      baseUrl: 'https://api.ascendx.tech/admin',
                    ),
                  ),
              child: const PostsPage(),
            ),
            BlocProvider(
              create:
                  (context) => JobsBloc(
                    adminRepository: AdminRepository(
                      apiClient: AdminApiClient(
                        baseUrl: 'https://api.ascendx.tech/admin',
                      ),
                      userApiClient: UserApiClient(
                        baseUrl: 'https://api.ascendx.tech/auth',
                      ),
                    ),
                  )..add(FetchReportedJobsEvent(page: 1)),
              child: const JobsPage(),
            ),
          ],
        ),
      ),
    );
  }
}
