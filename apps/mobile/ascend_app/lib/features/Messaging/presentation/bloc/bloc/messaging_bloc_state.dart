part of 'messaging_bloc_bloc.dart';

abstract class MessagingBlocState extends Equatable {
  @override
  List<Object?> get props => [];
}

class MessagingBlocInitial extends MessagingBlocState {}

class MessagingLoading extends MessagingBlocState {}

class MessagingIntialized extends MessagingBlocState {
  final int unseenCount;

  MessagingIntialized(this.unseenCount);

  MessagingIntialized copyWith({int? unseenCount}) {
    return MessagingIntialized(unseenCount ?? this.unseenCount);
  }

  @override
  List<Object?> get props => [unseenCount];
}

class MessagingDisconnected extends MessagingBlocState {}

class MessagingConnected extends MessagingBlocState {}

class MessagingError extends MessagingBlocState {
  final String errorMessage;

  MessagingError(this.errorMessage);

  @override
  List<Object?> get props => [errorMessage];
}

// Conversation States
class ConversationLoading extends MessagingBlocState {}

class ConversationLoaded extends MessagingBlocState {
  final List<ConversationModel> conversations;
  final int unseenCount;
  final int page;
  final bool hasReachedMax;
  final Map<String, bool> typingStatus;
  ConversationLoaded(
    this.conversations,
    this.unseenCount,
    this.page,
    this.hasReachedMax,
    this.typingStatus,
  );

  ConversationLoaded copyWith({
    List<ConversationModel>? conversations,
    int? unseenCount,
    int? page,
    bool? hasReachedMax,
    Map<String, bool>? typingStatus,
  }) {
    return ConversationLoaded(
      conversations ?? this.conversations,
      unseenCount ?? this.unseenCount,
      page ?? this.page,
      hasReachedMax ?? this.hasReachedMax,
      typingStatus ?? this.typingStatus,
    );
  }

  @override
  List<Object?> get props => [
    conversations,
    unseenCount,
    page,
    hasReachedMax,
    typingStatus,
  ];
}

// Messages States
class MessagesLoading extends MessagingBlocState {
  final String conversationId;
  final bool isLoadingMore;
  MessagesLoading(this.conversationId, {this.isLoadingMore = false});

  @override
  List<Object?> get props => [conversationId];
}

class MessagesLoaded extends MessagingBlocState {
  final List<MessageModel> messages;
  final String conversationId;
  final int page;
  final bool hasReachedMax;
  final bool isTyping;
  final bool isNewMessage;
  final DateTime? typingUpdatedAt; // For typing status
  final Map<String, dynamic>? sendingStatus; // For sending status

  MessagesLoaded(
    this.messages,
    this.conversationId,
    this.page,
    this.hasReachedMax, {
    this.isTyping = false,
    this.isNewMessage = false,
    this.typingUpdatedAt,
    this.sendingStatus,
  });

  MessagesLoaded copyWith({
    List<MessageModel>? messages,
    String? conversationId,
    int? page,
    bool? hasReachedMax,
    bool? isTyping,
    bool? isNewMessage,
    DateTime? typingUpdatedAt,
    Map<String, dynamic>? sendingStatus,
  }) {
    return MessagesLoaded(
      messages ?? this.messages,
      conversationId ?? this.conversationId,
      page ?? this.page,
      hasReachedMax ?? this.hasReachedMax,
      isTyping: isTyping ?? this.isTyping,
      isNewMessage: isNewMessage ?? this.isNewMessage,
      typingUpdatedAt: typingUpdatedAt ?? this.typingUpdatedAt,
      sendingStatus: sendingStatus ?? this.sendingStatus,
    );
  }

  @override
  List<Object?> get props => [
    messages,
    conversationId,
    page,
    hasReachedMax,
    isTyping,
    isNewMessage,
    typingUpdatedAt,
    sendingStatus,
  ];
}
