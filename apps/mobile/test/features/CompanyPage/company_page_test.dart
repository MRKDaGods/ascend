import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/CompanyPage/company_page.dart';

void main() {
  testWidgets('CompanyPage displays profile header and tabs', (
    WidgetTester tester,
  ) async {
    // Act
    await tester.pumpWidget(MaterialApp(home: CompanyPage()));

    // Assert
    expect(find.text('Maged Amgad'), findsOneWidget); // Profile name
    expect(
      find.text('Computer engineering student at Cairo University'),
      findsOneWidget,
    ); // Bio
    expect(find.text('Home'), findsOneWidget); // Tab
    expect(find.text('About'), findsOneWidget); // Tab
  });

  testWidgets('CompanyPage toggles follow state', (WidgetTester tester) async {
    // Arrange
    await tester.pumpWidget(MaterialApp(home: CompanyPage()));

    // Act
    final followButton = find.text('Follow');
    await tester.tap(followButton);
    await tester.pump();

    // Assert
    expect(find.text('Following'), findsOneWidget);
  });
}
