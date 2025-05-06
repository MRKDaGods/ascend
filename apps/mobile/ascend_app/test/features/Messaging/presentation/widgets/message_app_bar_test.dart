import 'package:ascend_app/features/Messaging/presentation/widgets/Message_App_Bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('MessageAppBar displays correctly with provided parameters', (
    WidgetTester tester,
  ) async {
    String selectedFilter = 'All';

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MessageAppBar(
            selectedValue: selectedFilter,
            onFilterChanged: (value) {
              selectedFilter = value;
            },
            onSelected: (value) {
              selectedFilter = value;
            },
          ),
        ),
      ),
    );

    // Check search field is rendered
    expect(find.byType(TextField), findsOneWidget);
    expect(find.text('Search Messag...'), findsOneWidget);

    // Check filter chips are rendered
    expect(find.text('Jobs'), findsOneWidget);
    expect(find.text('Unread'), findsOneWidget);
    expect(find.text('Drafts'), findsOneWidget);
    expect(find.text('InMail'), findsOneWidget);
  });

  testWidgets('MessageAppBar updates selected filter when a chip is selected', (
    WidgetTester tester,
  ) async {
    String selectedFilter = 'All';

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MessageAppBar(
            selectedValue: selectedFilter,
            onFilterChanged: (value) {
              selectedFilter = value;
            },
            onSelected: (value) {
              selectedFilter = value;
            },
          ),
        ),
      ),
    );

    // Find and tap the "Jobs" chip
    final jobsChip = find.text('Jobs');
    expect(jobsChip, findsOneWidget);
    await tester.tap(jobsChip);
    await tester.pump();

    // Rebuild with updated value to simulate parent widget updating prop
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MessageAppBar(
            selectedValue: 'Jobs',
            onFilterChanged: (value) {
              selectedFilter = value;
            },
            onSelected: (value) {
              selectedFilter = value;
            },
          ),
        ),
      ),
    );

    // Verify the "Jobs" chip is now selected
    final selectedChip = find.byWidgetPredicate(
      (widget) =>
          widget is RawChip &&
          widget.label is Text &&
          (widget.label as Text).data == 'Jobs' &&
          widget.selected == true,
    );

    expect(selectedChip, findsOneWidget);
  });
}
