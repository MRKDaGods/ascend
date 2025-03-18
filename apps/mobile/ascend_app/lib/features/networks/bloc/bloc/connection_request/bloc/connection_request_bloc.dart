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
    on<FetchPendingRequestsSent>(_fetchPendingRequestsSent);
    on<FetchPendingRequestsReceived>(_fetchPendingRequestsReceived);
    on<SendConnectionRequest>(_sendConnectionRequest);
    on<AcceptConnectionRequest>(_acceptConnectionRequest);
    on<DeclineConnectionRequest>(_declineConnectionRequest);
    on<CancelConnectionRequest>(_cancelConnectionRequest);
    on<FetchAcceptedConnections>(_fetchAcceptedConnections);
  }

  void _fetchPendingRequestsSent(
    FetchPendingRequestsSent event,
    Emitter<ConnectionRequestState> emit,
  ) {
    try {
      final pendingRequestsSent = repository.fetchPendingRequestsSent();
      print("Fetched Pending Requests Sent: ${pendingRequestsSent.length}");
      final currentState = state;
      if (currentState is ConnectionRequestSuccess) {
        emit(currentState.copyWith(pendingRequestsSent: pendingRequestsSent));
      } else {
        emit(
          ConnectionRequestSuccess(
            pendingRequestsReceived: [],
            pendingRequestsSent: pendingRequestsSent,
            acceptedConnections: [],
          ),
        );
      }
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _fetchPendingRequestsReceived(
    FetchPendingRequestsReceived event,
    Emitter<ConnectionRequestState> emit,
  ) {
    try {
      final pendingRequestsReceived = repository.fetchPendingRequestsReceived();
      print(
        "Fetched Pending Requests Received: ${pendingRequestsReceived.length}",
      );
      final currentState = state;
      if (currentState is ConnectionRequestSuccess) {
        emit(
          currentState.copyWith(
            pendingRequestsReceived: pendingRequestsReceived,
          ),
        );
      } else {
        emit(
          ConnectionRequestSuccess(
            pendingRequestsReceived: pendingRequestsReceived,
            pendingRequestsSent: [],
            acceptedConnections: [],
          ),
        );
      }
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _sendConnectionRequest(
    SendConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    try {
      repository.sendConnectionRequestRepository(event.connectionRequest);
      add(FetchPendingRequestsSent());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _acceptConnectionRequest(
    AcceptConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    try {
      repository.acceptConnectionRequestRepoistory(event.requestId);
      add(FetchPendingRequestsReceived());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _declineConnectionRequest(
    DeclineConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    try {
      repository.DeclineConnectionRequestRepoistory(event.requestId);
      add(FetchPendingRequestsReceived());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _cancelConnectionRequest(
    CancelConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) {
    try {
      repository.cancelConnectionRequest(event.requestId);
      add(FetchPendingRequestsSent());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  void _fetchAcceptedConnections(
    FetchAcceptedConnections event,
    Emitter<ConnectionRequestState> emit,
  ) {
    try {
      final acceptedConnections = repository.fetchAcceptedConnections();
      final currentState = state;
      if (currentState is ConnectionRequestSuccess) {
        emit(currentState.copyWith(acceptedConnections: acceptedConnections));
      } else {
        emit(
          ConnectionRequestSuccess(
            pendingRequestsReceived: [],
            pendingRequestsSent: [],
            acceptedConnections: acceptedConnections,
          ),
        );
      }
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }
}
