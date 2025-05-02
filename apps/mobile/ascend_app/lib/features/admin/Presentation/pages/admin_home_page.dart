import 'package:ascend_app/features/admin/Presentation/pages/analytics_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/jobs_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/posts_page.dart';
import 'package:ascend_app/features/admin/Presentation/pages/users_page.dart';
import 'package:ascend_app/features/admin/bloc/analytics/bloc/analytics_bloc.dart';
import 'package:ascend_app/features/admin/bloc/posts/bloc/posts_bloc.dart';
import 'package:ascend_app/features/admin/data/models/jobs_model.dart';
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
    // Example data for jobs and jobReports
    final jobs = [
      ReportedJob(
        jobId: 1,
        title: 'Software Engineer',
        description: 'Develop and maintain software applications.',
        industry: 'Technology',
        type: 'Full-Time',
        experienceLevel: 'Mid-Level',
        location: 'New York, NY',
        workplaceType: 'On-Site',
        salaryMinRange: 60000,
        salaryMaxRange: 80000,
        companyId: 101,
        companyName: 'TechCorp',
        companyLogoUrl: null,
        createdAt: DateTime.now().subtract(const Duration(days: 10)),
      ),
    ];

    final jobReports = {
      1: [
        JobReport(
          id: 1,
          reporterId: 201,
          reporterFullName: 'John Doe',
          reporterProfilePicture: null,
          reason: 'Inappropriate content',
          status: 'Pending',
          createdAt: DateTime.now().subtract(const Duration(days: 5)),
        ),
      ],
    };

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
                    ),
                  )..add(const FetchAnalyticsEvent('week')),
              child: const AnalyticsPage(),
            ),
            const UsersPage(),
            BlocProvider(
              create:
                  (_) => PostsBloc(
                    apiClient: AdminApiClient(
                      baseUrl: 'https://api.ascendx.tech/admin',
                    ),
                  ),
              child: const PostsPage(),
            ),
            JobsPage(
              jobs: jobs,
              jobReports: jobReports,
            ), // Pass required arguments here
          ],
        ),
      ),
    );
  }
}
