import 'package:ascend_app/features/Messaging/presentation/widgets/chat_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('ChatAppBar displays user name and online status', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: true,
            isTyping: false,
          ),
        ),
      ),
    );

    expect(find.text('Jane Doe'), findsOneWidget);
    expect(find.text('Active now'), findsOneWidget);
    expect(find.text('Typing'), findsNothing);
  });

  testWidgets('ChatAppBar displays typing indicator when isTyping is true', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: true,
            isTyping: true,
          ),
        ),
      ),
    );

    expect(find.text('Jane Doe'), findsOneWidget);
    expect(find.text('Active now'), findsNothing);
    expect(find.text('Typing'), findsOneWidget);
  });

  testWidgets('ChatAppBar displays star icon correctly', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: false,
            isTyping: false,
          ),
        ),
      ),
    );

    // Find star icon
    final starIcon = find.byIcon(Icons.star);
    expect(starIcon, findsOneWidget);

    // Tap on star icon to trigger the _toggleStar method
    await tester.tap(starIcon);
    await tester.pump(); // Rebuild widget after tap

    // Star should be colored after tapping
    final coloredStar = find.byWidgetPredicate(
      (widget) =>
          widget is Icon &&
          widget.icon == Icons.star &&
          widget.color == const Color(0xFFD4AF37),
    );

    expect(coloredStar, findsOneWidget);
  });

  testWidgets('ChatAppBar shows options modal when more button is pressed', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: false,
            isTyping: false,
          ),
        ),
      ),
    );

    // Find and tap the more button
    final moreButton = find.byIcon(Icons.more_horiz);
    expect(moreButton, findsOneWidget);
    await tester.tap(moreButton);

    // Use pump multiple times instead of pumpAndSettle to avoid timing out
    // This gives enough time for the modal to appear but avoids waiting for all animations
    await tester.pump(); // Start animation
    await tester.pump(const Duration(milliseconds: 300)); // Animation mid-way
    await tester.pump(const Duration(milliseconds: 300)); // Animation complete

    // Verify modal options are shown
    expect(find.text('Move to Other'), findsOneWidget);
    expect(find.text('Label as Jobs'), findsOneWidget);
    expect(find.text('Mark as unread'), findsOneWidget);
    expect(find.text('Star'), findsOneWidget);
    expect(find.text('Mute'), findsOneWidget);
    expect(find.text('Archive'), findsOneWidget);
    expect(find.text('Delete conversation'), findsOneWidget);
  });

  testWidgets('ChatAppBar handles null conversationId gracefully', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: true,
            isTyping: false,
            conversationId: null,
          ),
        ),
      ),
    );

    // Should still render the basic UI without errors
    expect(find.text('Jane Doe'), findsOneWidget);
    expect(find.byIcon(Icons.more_horiz), findsOneWidget);
    expect(find.byIcon(Icons.star), findsOneWidget);
  });

  testWidgets('ChatAppBar back button calls onBackPressed callback', (
    WidgetTester tester,
  ) async {
    bool backButtonPressed = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: false,
            isTyping: false,
            onBackPressed: () {
              backButtonPressed = true;
            },
          ),
        ),
      ),
    );

    // Find and tap the back button
    final backButton = find.byType(BackButton);
    expect(backButton, findsOneWidget);
    await tester.tap(backButton);
    await tester.pump();

    // Verify callback was called
    expect(backButtonPressed, isTrue);
  });

  testWidgets('ChatAppBar transitions typing animation state correctly', (
    WidgetTester tester,
  ) async {
    // Start with typing false
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: false,
            isTyping: false,
          ),
        ),
      ),
    );

    // Verify no typing indicator
    expect(find.text('Typing'), findsNothing);

    // Update to typing true
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: false,
            isTyping: true,
          ),
        ),
      ),
    );
    await tester.pump();

    // Verify typing indicator appears
    expect(find.text('Typing'), findsOneWidget);

    // Verify animation is working by checking for animated dots
    final animatedDots = find.byWidgetPredicate(
      (widget) =>
          widget is Container &&
          widget.decoration is BoxDecoration &&
          (widget.decoration as BoxDecoration).color == Colors.grey[600],
    );

    expect(animatedDots, findsAtLeastNWidgets(3)); // Should find 3 typing dots
  });

  testWidgets('ChatAppBar handles empty userName gracefully', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(userName: '', isOnline: true, isTyping: false),
        ),
      ),
    );

    // Should still render the UI without errors, though username might be empty
    expect(find.byType(AppBar), findsOneWidget);
    expect(find.byType(Text), findsAtLeastNWidgets(1));
  });

  testWidgets(
    'ChatAppBar safely handles quick rebuilds with different typing status',
    (WidgetTester tester) async {
      // First build with typing false
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ChatAppBar(
              userName: 'Jane Doe',
              isOnline: true,
              isTyping: false,
            ),
          ),
        ),
      );

      // Quick rebuild with typing true
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ChatAppBar(
              userName: 'Jane Doe',
              isOnline: true,
              isTyping: true,
            ),
          ),
        ),
      );

      // Immediate rebuild with typing false again
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ChatAppBar(
              userName: 'Jane Doe',
              isOnline: true,
              isTyping: false,
            ),
          ),
        ),
      );

      await tester.pump();

      // App should not crash, and should show the correct status (not typing)
      expect(find.text('Typing'), findsNothing);
      expect(find.text('Active now'), findsOneWidget);
    },
  );

  testWidgets('ChatAppBar modal closes properly when dismissed', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChatAppBar(
            userName: 'Jane Doe',
            isOnline: false,
            isTyping: false,
          ),
        ),
      ),
    );

    // Open the modal
    await tester.tap(find.byIcon(Icons.more_horiz));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    // Verify modal is open
    expect(find.text('Move to Other'), findsOneWidget);

    // Tap outside to dismiss
    await tester.tapAt(const Offset(10, 10)); // Tap at the top corner
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    // Verify modal is closed
    expect(find.text('Move to Other'), findsNothing);
  });

  testWidgets('ChatAppBar modal option taps trigger navigation pop', (
    WidgetTester tester,
  ) async {
    // Create a navigator to track pops
    final navigatorKey = GlobalKey<NavigatorState>();
    bool didPop = false;

    await tester.pumpWidget(
      MaterialApp(
        navigatorKey: navigatorKey,
        home: Scaffold(
          body: Builder(
            builder: (context) {
              return ChatAppBar(
                userName: 'Jane Doe',
                isOnline: false,
                isTyping: false,
                onBackPressed: () {
                  didPop = true;
                  Navigator.of(context).pop();
                },
              );
            },
          ),
        ),
      ),
    );

    // Open the modal
    await tester.tap(find.byIcon(Icons.more_horiz));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    // Tap on an option
    await tester.tap(find.text('Move to Other'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    // Verify modal closes after selecting an option (should no longer be visible)
    expect(find.text('Move to Other'), findsNothing);
  });
}
