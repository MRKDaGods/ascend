import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/UserPage/profile_entry.dart';

void main() {
  testWidgets('ProfileEntryWidget displays title, subtitle, and description', (WidgetTester tester) async {
    // Arrange
    const title = 'Flutter Developer';
    const subtitle = 'Google';
    const description = 'Developed cross-platform mobile applications.';

    // Act
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProfileEntryWidget(
            title: title,
            subtitle: subtitle,
            description: description,
          ),
        ),
      ),
    );

    // Assert
    expect(find.text(title), findsOneWidget);
    expect(find.text(subtitle), findsOneWidget);
    expect(find.text(description), findsOneWidget);
  });

  testWidgets('ProfileEntryWidget toggles description expansion', (WidgetTester tester) async {
    // Arrange
    const description = 'This is a very long description that exceeds 100 characters. It should be truncated initially and expandable on tap.';

    // Act
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProfileEntryWidget(
            description: description,
          ),
        ),
      ),
    );

    // Assert initial state
    expect(find.textContaining('...'), findsOneWidget);
    expect(find.text('Show more'), findsOneWidget);

    // Expand description
    await tester.tap(find.text('Show more'));
    await tester.pump();

    // Assert expanded state
    expect(find.textContaining('...'), findsNothing);
    expect(find.text('Show less'), findsOneWidget);
  });
}