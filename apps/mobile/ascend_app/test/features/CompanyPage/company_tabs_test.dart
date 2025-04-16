import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/CompanyPage/company_tabs.dart';

void main() {
  testWidgets('CompanyTabs displays all tabs', (WidgetTester tester) async {
    // Act
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CompanyTabs(),
        ),
      ),
    );

    // Assert
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('About'), findsOneWidget);
    expect(find.text('Posts'), findsOneWidget);
    expect(find.text('Jobs'), findsOneWidget);
    expect(find.text('People'), findsOneWidget);
  });

  testWidgets('CompanyTabs switches between tabs', (WidgetTester tester) async {
    // Act
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CompanyTabs(),
        ),
      ),
    );

    // Switch to About tab
    await tester.tap(find.text('About'));
    await tester.pumpAndSettle();

    // Assert
    expect(find.text('About Section'), findsOneWidget);

    // Switch to Posts tab
    await tester.tap(find.text('Posts'));
    await tester.pumpAndSettle();

    // Assert
    expect(find.text('Posts Section'), findsOneWidget);
  });
}