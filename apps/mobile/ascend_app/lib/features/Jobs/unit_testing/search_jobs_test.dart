import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/Search_jobs.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

void main() {
  group('Search Jobs Page Tests', () {
    testWidgets('Display search results', (WidgetTester tester) async {
      final jobs = [
        Jobsattributes(
          title: 'Software Engineer',
          company: 'Microsoft',
          location: 'Remote',
          experienceLevel: 'Mid',
          salaryMinRange: 200,
          easyapply: true,
          createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),
          salaryMaxRange: 300,
        ),
        Jobsattributes(
          title: 'Data Analyst',
          company: 'Google',
          location: 'Cairo',
          experienceLevel: 'Entry',
          salaryMinRange: 50,
          easyapply: false,
          createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),
          salaryMaxRange: 300,
        ),
      ];

      await tester.pumpWidget(
        MaterialApp(
          home: SearchJobsPage(
            searchtext: 'Engineer',
            locationtext: '',
            jobs: jobs,
          ),
        ),
      );

      // Verify search results are displayed
      expect(find.text('Software Engineer'), findsOneWidget);
      expect(find.text('Data Analyst'), findsNothing);
    });

    testWidgets('Filter jobs by location', (WidgetTester tester) async {
      final jobs = [
        Jobsattributes(
          title: 'Software Engineer',
          company: 'Microsoft',
          location: 'Remote',
          experienceLevel: 'Mid',
          salaryMinRange: 200,
          easyapply: true,
          createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),
          salaryMaxRange: 300,
        ),
        Jobsattributes(
          title: 'Data Analyst',
          company: 'Google',
          location: 'Cairo',
          experienceLevel: 'Entry',
          salaryMinRange: 50,
          easyapply: false,
          createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),
          salaryMaxRange: 300,
        ),
      ];

      await tester.pumpWidget(
        MaterialApp(
          home: SearchJobsPage(
            searchtext: '',
            locationtext: 'Cairo',
            jobs: jobs,
          ),
        ),
      );

      // Verify filtered jobs by location
      expect(find.text('Data Analyst'), findsOneWidget);
      expect(find.text('Software Engineer'), findsNothing);
    });
  });
}
