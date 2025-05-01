part of 'messaging_bloc_bloc.dart';

@immutable
sealed class MessagingBlocState {}

final class MessagingBlocInitial extends MessagingBlocState {}

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
  ConversationLoaded(
    this.conversations,
    this.unseenCount,
    this.page,
    this.hasReachedMax,
  );

  ConversationLoaded copyWith({
    List<ConversationModel>? conversations,
    int? unseenCount,
    int? page,
    bool? hasReachedMax,
  }) {
    return ConversationLoaded(
      conversations ?? this.conversations,
      unseenCount ?? this.unseenCount,
      page ?? this.page,
      hasReachedMax ?? this.hasReachedMax,
    );
  }

  @override
  List<Object?> get props => [conversations];
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

  MessagesLoaded(
    this.messages,
    this.conversationId,
    this.page,
    this.hasReachedMax, {
    this.isTyping = false,
  });

  MessagesLoaded copyWith({
    List<MessageModel>? messages,
    String? conversationId,
    int? page,
    bool? hasReachedMax,
    bool? isTyping,
  }) {
    return MessagesLoaded(
      messages ?? this.messages,
      conversationId ?? this.conversationId,
      page ?? this.page,
      hasReachedMax ?? this.hasReachedMax,
      isTyping: isTyping ?? this.isTyping,
    );
  }

  @override
  List<Object?> get props => [messages, conversationId];
}
