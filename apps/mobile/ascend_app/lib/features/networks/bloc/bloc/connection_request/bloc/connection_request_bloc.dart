import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Repositories/connection_request_repoistory.dart';

part 'connection_request_event.dart';
part 'connection_request_state.dart';

class ConnectionRequestBloc
    extends Bloc<ConnectionRequestEvent, ConnectionRequestState> {
  final ConnectionRequestRepository repository = ConnectionRequestRepository();

  ConnectionRequestBloc() : super(ConnectionRequestInitial()) {
    on<SendConnectionRequest>(_sendConnectionRequest);
    on<AcceptConnectionRequest>(_acceptConnectionRequest);
    on<DeclineConnectionRequest>(_declineConnectionRequest);
    on<CancelConnectionRequest>(_cancelConnectionRequest);
    on<RemoveConnection>(_removeConnection);
    on<FetchConnectionRequests>(_fetchConnectionRequests);
  }

  void _fetchConnectionRequests(
    FetchConnectionRequests event,
    Emitter<ConnectionRequestState> emit,
  ) {
    emit(ConnectionRequestLoading());
    try {
      final pendingRequestsReceived = repository.fetchPendingRequestsReceived();
      final pendingRequestsSent = repository.fetchPendingRequestsSent();
      final acceptedConnections = repository.fetchAcceptedConnections();
      emit(
        ConnectionRequestSuccess(
          pendingRequestsReceived: pendingRequestsReceived,
          pendingRequestsSent: pendingRequestsSent,
          acceptedConnections: acceptedConnections,
        ),
      );
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _sendConnectionRequest(
    SendConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    emit(ConnectionRequestLoading());
    try {
      repository.sendConnectionRequestRepository(event.connectionRequest);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _acceptConnectionRequest(
    AcceptConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    emit(ConnectionRequestLoading());
    try {
      repository.acceptConnectionRequestRepoistory(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _declineConnectionRequest(
    DeclineConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    emit(ConnectionRequestLoading());
    try {
      repository.DeclineConnectionRequestRepoistory(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _cancelConnectionRequest(
    CancelConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    emit(ConnectionRequestLoading());
    try {
      repository.cancelConnectionRequest(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _removeConnection(
    RemoveConnection event,
    Emitter<ConnectionRequestState> emit,
  ) {
    emit(ConnectionRequestLoading());
    try {
      repository.removeConnection(event.connectionId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }
}
