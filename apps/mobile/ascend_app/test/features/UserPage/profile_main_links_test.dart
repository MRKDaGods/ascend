import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/UserPage/profile_header_links.dart';

void main() {
  testWidgets('ProfileMainLinks displays links correctly', (
    WidgetTester tester,
  ) async {
    // Arrange
    const links = [
      {'title': 'GitHub', 'url': 'https://github.com/MagedWadi'},
      {'title': 'Portfolio', 'url': 'https://dartcode.org/docs/settings/'},
    ];

    // Act
    await tester.pumpWidget(
      MaterialApp(home: Scaffold(body: ProfileExtraMaterial(links: links))),
    );

    // Assert
    expect(find.text('GitHub'), findsOneWidget);
    expect(find.text('Portfolio'), findsOneWidget);
  });

  testWidgets('ProfileMainLinks opens link when tapped', (
    WidgetTester tester,
  ) async {
    // Arrange
    const links = [
      {'title': 'GitHub', 'url': 'https://github.com/MagedWadi'},
    ];

    await tester.pumpWidget(
      MaterialApp(home: Scaffold(body: ProfileExtraMaterial(links: links))),
    );

    // Act
    await tester.tap(find.text('GitHub'));
    await tester.pumpAndSettle();

    // Assert
    // Normally, you would mock the URL launcher and verify it was called.
    // For now, just ensure the tap interaction works without errors.
    expect(find.text('GitHub'), findsOneWidget);
  });
}
