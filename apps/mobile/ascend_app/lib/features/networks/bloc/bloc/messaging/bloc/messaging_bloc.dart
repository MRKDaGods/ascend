import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/message_model.dart';
import 'package:ascend_app/features/networks/Repositories/message_repoistory.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';

part 'messaging_event.dart';
part 'messaging_state.dart';

class MessagingBloc extends Bloc<MessagingEvent, MessagingState> {
  final MessageRequestRepoistory _repository = MessageRequestRepoistory();
  MessagingBloc() : super(MessagingInitial()) {
    on<SendMessageRequest>(_sendMessageRequest);
    on<AcceptMessageRequest>(_acceptMessageRequest);
    on<DeclineMessageRequest>(_declineMessageRequest);
    on<FetchReceivedMessagingRequests>(_fetchMessagingRequests);
  }

  Future<void> _sendMessageRequest(
    SendMessageRequest event,
    Emitter<MessagingState> emit,
  ) async {
    emit(MessagingLoading());
    try {
      await _repository.sendMessagingRequests(event.receiverId);
      add(FetchReceivedMessagingRequests());
    } catch (e) {
      emit(MessagingRequestsError(e.toString()));
    }
  }

  Future<void> _acceptMessageRequest(
    AcceptMessageRequest event,
    Emitter<MessagingState> emit,
  ) async {
    emit(MessagingLoading());
    try {
      // Simulate accepting a message request to a repository or API
      await _repository.acceptMessagingRequest(event.messageId);
      add(FetchReceivedMessagingRequests());
    } catch (e) {
      emit(MessagingRequestsError(e.toString()));
    }
  }

  Future<void> _declineMessageRequest(
    DeclineMessageRequest event,
    Emitter<MessagingState> emit,
  ) async {
    emit(MessagingLoading());
    try {
      // Simulate declining a message request to a repository or API
      await _repository.rejectMessagingRequests(event.messageId);
      add(FetchReceivedMessagingRequests());
    } catch (e) {
      emit(MessagingRequestsError(e.toString()));
    }
  }

  Future<void> _fetchMessagingRequests(
    FetchReceivedMessagingRequests event,
    Emitter<MessagingState> emit,
  ) async {
    emit(MessagingLoading());
    try {
      final receivedRequests = await _repository.fetchMessagingRequests();
      emit(MessagingRequestsLoaded(receivedRequests: receivedRequests));
    } catch (e) {
      emit(MessagingRequestsError(e.toString()));
    }
  }
}
