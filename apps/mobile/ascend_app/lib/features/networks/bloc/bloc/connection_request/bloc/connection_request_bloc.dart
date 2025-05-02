import 'package:ascend_app/features/networks/Repositories/connection_request_repoistory.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_connect.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'connection_request_event.dart';
part 'connection_request_state.dart';

class ConnectionRequestBloc
    extends Bloc<ConnectionRequestEvent, ConnectionRequestState> {
  final ConnectionRequestRepository _repository;

  ConnectionRequestBloc({required ConnectionRequestRepository repository})
    : _repository = repository,
      super(ConnectionRequestInitial()) {
    on<FetchConnectionRequests>(_fetchConnectionRequests);
    on<SendConnectionRequest>(_sendConnectionRequest);
    on<AcceptConnectionRequest>(_acceptConnectionRequest);
    on<DeclineConnectionRequest>(_declineConnectionRequest);
    // on<CancelConnectionRequest>(_cancelConnectionRequest);
    on<RemoveConnection>(_removeConnection);
  }

  Future<void> _fetchConnectionRequests(
    FetchConnectionRequests event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      debugPrint(
        "[ConnectionRequestBloc] Starting to fetch all connection data...",
      );

      debugPrint(
        "[ConnectionRequestBloc] Fetching pending requests received...",
      );
      final pendingRequestsReceived =
          await _repository.fetchPendingRequestsReceived();
      debugPrint(
        "[ConnectionRequestBloc] Pending requests received: ${pendingRequestsReceived.length}",
      );

      debugPrint("[ConnectionRequestBloc] Fetching pending requests sent...");
      final pendingRequestsSent = await _repository.fetchPendingRequestsSent();
      debugPrint(
        "[ConnectionRequestBloc] Pending requests sent: ${pendingRequestsSent.length}",
      );

      debugPrint("[ConnectionRequestBloc] Fetching accepted connections...");
      final acceptedConnections = await _repository.fetchAcceptedConnections();
      debugPrint(
        "[ConnectionRequestBloc] Accepted connections: ${acceptedConnections.length}",
      );

      debugPrint("[ConnectionRequestBloc] Fetching suggested connections...");
      final suggestedToConnect =
          await _repository.getConnectionRecommendations();
      debugPrint(
        "[ConnectionRequestBloc] Suggested connections: ${suggestedToConnect.length}",
      );

      emit(
        ConnectionRequestSuccess(
          pendingRequestsReceived: pendingRequestsReceived,
          pendingRequestsSent: pendingRequestsSent,
          acceptedConnections: acceptedConnections,
          suggestedToConnect: suggestedToConnect,
        ),
      );
      debugPrint(
        "[ConnectionRequestBloc] Successfully emitted ConnectionRequestSuccess state",
      );
    } catch (e, stackTrace) {
      debugPrint("[ConnectionRequestBloc] Error fetching connections: $e");
      debugPrint("[ConnectionRequestBloc] Stack trace: $stackTrace");
      emit(ConnectionRequestError(e.toString()));
    }
  }

  Future<void> _sendConnectionRequest(
    SendConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await _repository.sendConnectionRequest(event.connctionId);
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
      await _repository.acceptConnectionRequest(event.requestId);
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
      await _repository.declineConnectionRequest(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }

  /*
  Future<void> _cancelConnectionRequest(
    CancelConnectionRequest event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await _repository.cancelConnectionRequest(event.requestId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }
*/
  Future<void> _removeConnection(
    RemoveConnection event,
    Emitter<ConnectionRequestState> emit,
  ) async {
    emit(ConnectionRequestLoading());
    try {
      await _repository.removeConnection(event.connectionId);
      add(FetchConnectionRequests());
    } catch (e) {
      emit(ConnectionRequestError(e.toString()));
    }
  }
}
