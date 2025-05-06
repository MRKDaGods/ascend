import 'package:ascend_app/features/Messaging/data/model/conversation_model.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/features/Messaging/presentation/pages/main_message_page.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/conversation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockMessagingBloc extends Mock implements MessagingBloc {}

class FakeMessagingBlocEvent extends Fake implements MessagingBlocEvent {}

class FakeMessagingBlocState extends Fake implements MessagingBlocState {}

void main() {
  late MockMessagingBloc mockMessagingBloc;

  setUpAll(() {
    registerFallbackValue(FakeMessagingBlocEvent());
    registerFallbackValue(FakeMessagingBlocState());
  });

  setUp(() {
    mockMessagingBloc = MockMessagingBloc();
  });

  testWidgets(
    'MainMessagingPage displays loading indicator when state is ConversationLoading',
    (WidgetTester tester) async {
      when(() => mockMessagingBloc.state).thenReturn(ConversationLoading());

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider<MessagingBloc>.value(
            value: mockMessagingBloc,
            child: const MainMessagingPage(),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.byType(Conversation), findsNothing);
    },
  );

  testWidgets(
    'MainMessagingPage displays conversations when state is ConversationLoaded',
    (WidgetTester tester) async {
      final testConversations = [
        ConversationModel(
          conversationId: '1',
          userId: 'user1',
          otherUserName: 'John Doe',
          otherUserProfileImageUrl: 'http://example.com/image.jpg',
          latestMessage: 'Hello',
          latestTimestamp: DateTime.now(),
          unseenCount: 2,
          isBlocked: false,
        ),
        ConversationModel(
          conversationId: '2',
          userId: 'user2',
          otherUserName: 'Jane Smith',
          otherUserProfileImageUrl: 'http://example.com/image2.jpg',
          latestMessage: 'Hi there',
          latestTimestamp: DateTime.now(),
          unseenCount: 0,
          isBlocked: false,
        ),
      ];

      when(() => mockMessagingBloc.state).thenReturn(
        ConversationLoaded(
          testConversations,
          2, // unseen count
          1, // page
          true, // hasReachedMax
          {'1': false, '2': false}, // typing status
        ),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider<MessagingBloc>.value(
            value: mockMessagingBloc,
            child: const MainMessagingPage(),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsNothing);
      expect(find.byType(Conversation), findsNWidgets(2));
      expect(find.text('John Doe'), findsOneWidget);
      expect(find.text('Jane Smith'), findsOneWidget);
    },
  );

  testWidgets('MainMessagingPage displays empty state when no conversations', (
    WidgetTester tester,
  ) async {
    when(() => mockMessagingBloc.state).thenReturn(
      ConversationLoaded(
        [], // Empty conversations list
        0, // unseen count
        1, // page
        true, // hasReachedMax
        {}, // typing status
      ),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: BlocProvider<MessagingBloc>.value(
          value: mockMessagingBloc,
          child: const MainMessagingPage(),
        ),
      ),
    );

    expect(find.text('No messages'), findsOneWidget);
    expect(find.text('Start a new conversation'), findsOneWidget);
    expect(find.byType(ElevatedButton), findsOneWidget);
  });

  testWidgets(
    'MainMessagingPage displays error state when state is MessagingError',
    (WidgetTester tester) async {
      when(
        () => mockMessagingBloc.state,
      ).thenReturn(MessagingError('Failed to load conversations'));

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider<MessagingBloc>.value(
            value: mockMessagingBloc,
            child: const MainMessagingPage(),
          ),
        ),
      );

      expect(find.text('Something went wrong'), findsOneWidget);
      expect(find.text('Failed to load conversations'), findsOneWidget);
      expect(find.byType(ElevatedButton), findsOneWidget);

      // Test retry button functionality
      await tester.tap(find.byType(ElevatedButton));
      verify(() => mockMessagingBloc.add(LoadConversations())).called(1);
    },
  );

  testWidgets('MainMessagingPage search functionality works', (
    WidgetTester tester,
  ) async {
    when(() => mockMessagingBloc.state).thenReturn(
      ConversationLoaded(
        [], // Empty conversations list
        0, // unseen count
        1, // page
        true, // hasReachedMax
        {}, // typing status
      ),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: BlocProvider<MessagingBloc>.value(
          value: mockMessagingBloc,
          child: const MainMessagingPage(),
        ),
      ),
    );

    // Find search field
    final searchField = find.byType(TextField);
    expect(searchField, findsOneWidget);

    // Enter search text
    await tester.enterText(searchField, 'John');
    await tester.pump(const Duration(milliseconds: 600)); // Wait for debounce

    // Verify that LoadConversations is called
    verify(() => mockMessagingBloc.add(LoadConversations())).called(1);
  });
}
