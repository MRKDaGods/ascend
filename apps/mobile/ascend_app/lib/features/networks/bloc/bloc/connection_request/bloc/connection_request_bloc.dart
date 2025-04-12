import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Repositories/connection_request_repoistory.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_connect.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';

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

  Future<void> _fetchConnectionRequests(
    FetchConnectionRequests event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      final pendingRequestsReceived =
          await repository.fetchPendingRequestsReceived();
      final pendingRequestsSent = await repository.fetchPendingRequestsSent();
      final acceptedConnections = await repository.fetchAcceptedConnections();
      final suggestedToConnect =
          await repository
              .getConnectionRecommendations(); // Fetch suggested users
      emit(
        ConnectionRequestSuccess(
          pendingRequestsReceived: pendingRequestsReceived,
          pendingRequestsSent: pendingRequestsSent,
          acceptedConnections: acceptedConnections,
          suggestedToConnect: suggestedToConnect,
        ),
      );
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  Future<void> _sendConnectionRequest(
    SendConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await repository.sendConnectionRequest(event.connectionRequest);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  Future<void> _acceptConnectionRequest(
    AcceptConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await repository.acceptConnectionRequest(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  Future<void> _declineConnectionRequest(
    DeclineConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await repository.declineConnectionRequest(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  Future<void> _cancelConnectionRequest(
    CancelConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await repository.cancelConnectionRequest(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  Future<void> _removeConnection(
    RemoveConnection event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await repository.removeConnection(event.connectionId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }
}
