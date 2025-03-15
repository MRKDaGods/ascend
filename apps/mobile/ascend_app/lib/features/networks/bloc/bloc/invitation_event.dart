part of 'invitation_bloc.dart';

@immutable
abstract class InvitationEvent {}

class FetchInvitations extends InvitationEvent {
  final List<InvitationModel> invitations;
  FetchInvitations(this.invitations);
}

class AcceptInvitation extends InvitationEvent {
  final InvitationModel invitation;
  AcceptInvitation(this.invitation);
}

class RejectInvitation extends InvitationEvent {
  final InvitationModel invitation;
  RejectInvitation(this.invitation);
}
