import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_home_page.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

void main() {
  group('Job Home Page Tests', () {
    testWidgets('Display job picks section', (WidgetTester tester) async {
      final jobs = [
        Jobsattributes(
          title: 'Software Engineer',
          company: 'Microsoft',
          location: 'Remote',
          experienceLevel: 'Mid',
          salaryMinRange: 200,
          salaryMaxRange: 300,
          createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),

          easyapply: true,
        ),
        Jobsattributes(
          title: 'Data Analyst',
          company: 'Google',
          location: 'Cairo',
          createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),

          experienceLevel: 'Entry',
          salaryMinRange: 50,
          salaryMaxRange: 300,
          easyapply: false,
        ),
      ];

      await tester.pumpWidget(
        MaterialApp(home: JobHomePage(isDarkMode: false, jobs: jobs)),
      );

      // Verify job picks section is displayed
      expect(find.text('Job picks for you'), findsOneWidget);
      expect(find.text('Software Engineer'), findsOneWidget);
      expect(find.text('Data Analyst'), findsOneWidget);
    });

    testWidgets('Refresh jobs list', (WidgetTester tester) async {
      final jobs = [
        Jobsattributes(
          title: 'Software Engineer',
          company: 'Microsoft',
          location: 'Remote',
          experienceLevel: 'Mid',
          salaryMinRange: 200,
          salaryMaxRange: 300,
          createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),

          easyapply: true,
        ),
      ];

      await tester.pumpWidget(
        MaterialApp(home: JobHomePage(isDarkMode: false, jobs: jobs)),
      );

      // Trigger refresh
      await tester.drag(find.byType(ListView), const Offset(0, 300));
      await tester.pumpAndSettle();

      // Verify refresh indicator is shown
      expect(find.byType(RefreshIndicator), findsOneWidget);
    });
  });
}
