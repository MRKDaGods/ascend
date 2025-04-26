import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/UserPage/section_builder.dart';
import 'package:ascend_app/features/UserPage/models/profile_section.dart';

void main() {
  testWidgets('SectionBuilder displays section title and content', (
    WidgetTester tester,
  ) async {
    // Arrange
    const section = ProfileSection(title: 'Experience', content: []);

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SectionBuilder(
            section: section,
            isMyProfile: true,
            onUpdateSection: (updatedSection) {},
          ),
        ),
      ),
    );

    // Assert
    expect(find.text('Experience'), findsOneWidget);
  });
}
