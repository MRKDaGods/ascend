part of 'invitation_bloc.dart';

@immutable
class InvitationState {
  final List<InvitationModel> invitations;
  final List<InvitationModel> accepted;
  final List<InvitationModel> rejected;
  final int count;

  InvitationState({
    required this.invitations,
    required this.accepted,
    required this.rejected,
    required this.count,
  });

  InvitationState copyWith({
    List<InvitationModel>? invitations,
    List<InvitationModel>? accepted,
    List<InvitationModel>? rejected,
    int? count,
  }) {
    return InvitationState(
      invitations: invitations ?? this.invitations,
      accepted: accepted ?? this.accepted,
      rejected: rejected ?? this.rejected,
      count: count ?? this.count,
    );
  }
}

class InvitationInitial extends InvitationState {
  InvitationInitial()
    : super(invitations: [], accepted: [], rejected: [], count: 0);
}
