import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/easy_apply.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

void main() {
  group('Easy Apply Page Tests', () {
    testWidgets('Submit application successfully', (WidgetTester tester) async {
      final job = Jobsattributes(
        title: 'Software Engineer',
        company: 'Microsoft',
        location: 'Remote',
        experienceLevel: 'Mid',
        salary: 200,
        easyapply: true,
      );

      await tester.pumpWidget(MaterialApp(home: EasyApplyPage(job: job)));

      // Enter name, email, and phone
      await tester.enterText(find.byType(TextFormField).at(0), 'John Doe');
      await tester.enterText(
        find.byType(TextFormField).at(1),
        'john.doe@example.com',
      );
      await tester.enterText(find.byType(TextFormField).at(2), '1234567890');

      // Submit the application
      await tester.tap(find.text('Submit Application'));
      await tester.pump();

      // Verify success message
      expect(find.text('Application Submitted Successfully!'), findsOneWidget);
      expect(job.applied, isTrue);
      expect(job.applicationStatus, 'Pending');
    });

    testWidgets('Show error when already applied', (WidgetTester tester) async {
      final job = Jobsattributes(
        title: 'Software Engineer',
        company: 'Microsoft',
        location: 'Remote',
        experienceLevel: 'Mid',
        salary: 200,
        easyapply: true,
        applied: true,
      );

      await tester.pumpWidget(MaterialApp(home: EasyApplyPage(job: job)));

      // Submit the application
      await tester.tap(find.text('Submit Application'));
      await tester.pump();

      // Verify error message
      expect(find.text('Already applied for this job!'), findsOneWidget);
    });
  });
}
