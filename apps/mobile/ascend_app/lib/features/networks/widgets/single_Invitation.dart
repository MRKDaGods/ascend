import 'package:flutter/material.dart';
import 'package:readmore/readmore.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/model/invitation_model.dart';
import 'package:ascend_app/features/networks/bloc/bloc/invitation_bloc.dart';

class SingleInvitation extends StatelessWidget {
  final InvitationModel invitation;

  const SingleInvitation({Key? key, required this.invitation})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(backgroundImage: AssetImage(invitation.image)),
        title: Text(invitation.title),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ReadMoreText(
              invitation.description,
              trimLines: 2,
              colorClickableText: Colors.pink,
              trimMode: TrimMode.Line,
              trimCollapsedText: '...Show more',
              trimExpandedText: ' show less',
              moreStyle: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            Text(invitation.date),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: Icon(Icons.check, color: Colors.green),
              onPressed: () {
                BlocProvider.of<InvitationBloc>(
                  context,
                ).add(AcceptInvitation(invitation));
              },
            ),
            IconButton(
              icon: Icon(Icons.close, color: Colors.red),
              onPressed: () {
                BlocProvider.of<InvitationBloc>(
                  context,
                ).add(RejectInvitation(invitation));
              },
            ),
          ],
        ),
      ),
    );
  }
}
