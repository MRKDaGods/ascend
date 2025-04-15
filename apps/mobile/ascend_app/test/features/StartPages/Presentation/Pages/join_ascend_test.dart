import 'package:ascend_app/features/StartPages/Presentation/Pages/JoinAscend.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/SignIn.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('JoinAscend Page Tests', () {
    testWidgets('renders JoinAscend page correctly', (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(
        const MaterialApp(
          home: JoinAscend(),
        ),
      );

      // Assert
      expect(find.text('Join Ascend'), findsOneWidget);
      expect(find.text('Create Account'), findsOneWidget);
      expect(find.byType(TextButton), findsWidgets);
    });

    testWidgets('validates email input', (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(
        const MaterialApp(
          home: JoinAscend(),
        ),
      );

      // Act
      await tester.enterText(find.byKey(const Key('Join_email')), 'invalid-email');
      await tester.tap(find.text('Agree & Join'));
      await tester.pump();

      // Assert
      expect(find.text('Please enter a valid email or phone number'), findsOneWidget);
    });

    testWidgets('navigates to SignInPage on "Sign In" button tap', (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(
        const MaterialApp(
          home: JoinAscend(),
        ),
      );

      // Act
      await tester.tap(find.text('Sign In'));
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(SignInPage), findsOneWidget);
    });
  });
}