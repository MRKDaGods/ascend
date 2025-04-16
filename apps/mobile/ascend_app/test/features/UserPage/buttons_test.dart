import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/UserPage/buttons.dart';

void main() {
  testWidgets('ProfileButtons displays Connect button when not connected', (
    WidgetTester tester,
  ) async {
    // Arrange
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProfileButtons(
            isfollowing: false,
            isMyProfile: false,
            isConnect: false,
            isPending: false,
            toggleConnect: () {},
            withdrawRequest: (context) {},
            toggleFollow: () {},
            removeConnection: (context) {},
          ),
        ),
      ),
    );

    // Assert
    expect(find.text('Connect'), findsOneWidget);
  });

  testWidgets(
    'ProfileButtons displays Pending button when connection is pending',
    (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProfileButtons(
              isfollowing: false,
              isMyProfile: false,
              isConnect: false,
              isPending: true,
              toggleConnect: () {},
              withdrawRequest: (context) {},
              toggleFollow: () {},
              removeConnection: (context) {},
            ),
          ),
        ),
      );

      // Assert
      expect(find.text('Pending'), findsOneWidget);
    },
  );

  testWidgets('ProfileButtons displays Message button when connected', (
    WidgetTester tester,
  ) async {
    // Arrange
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProfileButtons(
            isfollowing: false,
            isMyProfile: false,
            isConnect: true,
            isPending: false,
            toggleConnect: () {},
            withdrawRequest: (context) {},
            toggleFollow: () {},
            removeConnection: (context) {},
          ),
        ),
      ),
    );

    // Assert
    expect(find.text('Message'), findsOneWidget);
  });
}
