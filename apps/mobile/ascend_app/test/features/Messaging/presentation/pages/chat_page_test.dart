import 'package:ascend_app/features/Messaging/data/model/message_model.dart';
import 'package:ascend_app/features/Messaging/presentation/bloc/bloc/messaging_bloc_bloc.dart';
import 'package:ascend_app/features/Messaging/presentation/pages/chat_page.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/chat_box.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockMessagingBloc extends Mock implements MessagingBloc {}

class MockUserProfileBloc extends Mock implements UserProfileBloc {}

class FakeMessagingBlocEvent extends Fake implements MessagingBlocEvent {}

class FakeMessagingBlocState extends Fake implements MessagingBlocState {}

void main() {
  late MockMessagingBloc mockMessagingBloc;
  late MockUserProfileBloc mockUserProfileBloc;

  setUpAll(() {
    registerFallbackValue(FakeMessagingBlocEvent());
    registerFallbackValue(FakeMessagingBlocState());
  });

  setUp(() {
    mockMessagingBloc = MockMessagingBloc();
    mockUserProfileBloc = MockUserProfileBloc();
    when(() => mockUserProfileBloc.profile).thenReturn(null);
  });

  testWidgets(
    'ChatPage displays loading indicator when state is MessagesLoading',
    (WidgetTester tester) async {
      when(() => mockMessagingBloc.state).thenReturn(MessagesLoading('123'));

      await tester.pumpWidget(
        MaterialApp(
          home: MultiBlocProvider(
            providers: [
              BlocProvider<MessagingBloc>.value(value: mockMessagingBloc),
              BlocProvider<UserProfileBloc>.value(value: mockUserProfileBloc),
            ],
            child: const ChatPage(
              conversationId: '123',
              converstaionName: 'John Doe',
              conversationAvatar: 'http://example.com/image.jpg',
              isOnline: true,
              myUserId: 'me123',
              otherUserId: 'user123',
              isTyping: false,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.byType(ChatBox), findsNothing);

      // Verify that LoadMessages is called with correct conversation ID
      verify(() => mockMessagingBloc.add(LoadMessages('123'))).called(1);
    },
  );

  testWidgets('ChatPage displays messages when state is MessagesLoaded', (
    WidgetTester tester,
  ) async {
    final testMessages = [
      MessageModel(
        messageId: '1',
        senderId: 'user123', // Message from other user
        conversationId: '123',
        content: 'Hello',
        fileUrl: null,
        fileType: null,
        sentAt: DateTime.now().subtract(const Duration(minutes: 5)),
        isRead: true,
        readAt: DateTime.now(),
      ),
      MessageModel(
        messageId: '2',
        senderId: 'me123', // Message from me
        conversationId: '123',
        content: 'Hi there!',
        fileUrl: null,
        fileType: null,
        sentAt: DateTime.now(),
        isRead: false,
        readAt: null,
      ),
    ];

    when(() => mockMessagingBloc.state).thenReturn(
      MessagesLoaded(
        testMessages,
        '123', // conversationId
        1, // page
        true, // hasReachedMax
        isTyping: false,
      ),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: MultiBlocProvider(
          providers: [
            BlocProvider<MessagingBloc>.value(value: mockMessagingBloc),
            BlocProvider<UserProfileBloc>.value(value: mockUserProfileBloc),
          ],
          child: const ChatPage(
            conversationId: '123',
            converstaionName: 'John Doe',
            conversationAvatar: 'http://example.com/image.jpg',
            isOnline: true,
            myUserId: 'me123',
            otherUserId: 'user123',
            isTyping: false,
          ),
        ),
      ),
    );

    expect(find.byType(ChatBox), findsNWidgets(2));
    expect(find.text('Hello'), findsOneWidget);
    expect(find.text('Hi there!'), findsOneWidget);
  });

  testWidgets(
    'ChatPage sends message when text is entered and send button is pressed',
    (WidgetTester tester) async {
      when(() => mockMessagingBloc.state).thenReturn(
        MessagesLoaded(
          [], // Empty messages list
          '123', // conversationId
          1, // page
          true, // hasReachedMax
          isTyping: false,
        ),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: MultiBlocProvider(
            providers: [
              BlocProvider<MessagingBloc>.value(value: mockMessagingBloc),
              BlocProvider<UserProfileBloc>.value(value: mockUserProfileBloc),
            ],
            child: const ChatPage(
              conversationId: '123',
              converstaionName: 'John Doe',
              conversationAvatar: 'http://example.com/image.jpg',
              isOnline: true,
              myUserId: 'me123',
              otherUserId: 'user123',
              isTyping: false,
            ),
          ),
        ),
      );

      // Find text input field and send button
      final textField = find.byType(TextField);
      expect(textField, findsOneWidget);

      // Enter text
      await tester.enterText(textField, 'Test message');
      await tester.pump();

      // Find and tap send button
      final sendButton = find.byIcon(Icons.send);
      expect(sendButton, findsOneWidget);
      await tester.tap(sendButton);
      await tester.pump();

      // Verify SendMessage event is added with correct parameters
      verify(
        () => mockMessagingBloc.add(
          SendMessage('123', 'user123', 'Test message'),
        ),
      ).called(1);
    },
  );

  testWidgets('ChatPage shows typing indicator when remote user is typing', (
    WidgetTester tester,
  ) async {
    when(() => mockMessagingBloc.state).thenReturn(
      MessagesLoaded(
        [], // Empty messages list
        '123', // conversationId
        1, // page
        true, // hasReachedMax
        isTyping: true, // Remote user is typing
      ),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: MultiBlocProvider(
          providers: [
            BlocProvider<MessagingBloc>.value(value: mockMessagingBloc),
            BlocProvider<UserProfileBloc>.value(value: mockUserProfileBloc),
          ],
          child: const ChatPage(
            conversationId: '123',
            converstaionName: 'John Doe',
            conversationAvatar: 'http://example.com/image.jpg',
            isOnline: true,
            myUserId: 'me123',
            otherUserId: 'user123',
            isTyping: true, // Initial prop value is true
          ),
        ),
      ),
    );

    // Verify typing indicator is showing in the app bar
    expect(find.text('Typing'), findsOneWidget);
  });
}
