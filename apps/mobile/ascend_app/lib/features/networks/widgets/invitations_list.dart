import 'package:ascend_app/features/networks/widgets/single_Invitation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/invitation_model.dart';

class InvitationsList extends StatefulWidget {
  final List<InvitationModel> invitations;
  final bool isExpanded;

  const InvitationsList({
    Key? key,
    required this.invitations,
    required this.isExpanded,
  }) : super(key: key);

  @override
  _InvitationsListState createState() => _InvitationsListState();
}

class _InvitationsListState extends State<InvitationsList> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children:
          widget.isExpanded || widget.invitations.length <= 2
              ? widget.invitations.map((invitation) {
                return SingleInvitation(invitation: invitation);
              }).toList()
              : widget.invitations.sublist(0, 2).map((invitation) {
                return SingleInvitation(invitation: invitation);
              }).toList(),
    );
  }
}
