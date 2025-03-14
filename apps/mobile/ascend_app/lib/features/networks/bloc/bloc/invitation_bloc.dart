import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/invitation_model.dart';

part 'invitation_event.dart';
part 'invitation_state.dart';

class InvitationBloc extends Bloc<InvitationEvent, InvitationState> {
  InvitationBloc() : super(InvitationInitial()) {
    // Fetching Invitations Event
    on<FetchInvitations>((event, emit) {
      emit(state.copyWith(invitations: event.invitations));
    });

    // Accepting Invitations Event
    on<AcceptInvitation>((event, emit) {
      final List<InvitationModel> updatedInvitations = List.from(
        state.invitations,
      )..remove(event.invitation);
      final List<InvitationModel> updatedAccepted = List.from(state.accepted)
        ..add(event.invitation);
      emit(
        state.copyWith(
          invitations: updatedInvitations,
          accepted: updatedAccepted,
          count: state.count + 1,
        ),
      );
    });

    // Rejecting Invitations Event
    on<RejectInvitation>((event, emit) {
      final List<InvitationModel> updatedInvitations = List.from(
        state.invitations,
      )..remove(event.invitation);
      final List<InvitationModel> updatedRejected = List.from(state.rejected)
        ..add(event.invitation);
      emit(
        state.copyWith(
          invitations: updatedInvitations,
          rejected: updatedRejected,
          count: state.count - 1,
        ),
      );
    });
  }
}
