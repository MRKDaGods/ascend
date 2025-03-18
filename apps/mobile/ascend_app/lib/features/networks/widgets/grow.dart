import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/invitation_bloc.dart';
import 'package:ascend_app/features/networks/widgets/invitations_list.dart';
import 'package:ascend_app/features/networks/model/invitation_model.dart';

class InvitationGenerator {
  static List<InvitationModel> generateInvitations(int count) {
    return List.generate(count, (index) {
      return InvitationModel(
        title: 'Invitation $index',
        description: 'Description for Invitation $index',
        image: 'assets/images_posts/Screenshot 2025-03-14 150447.png',
        date: '2025-03-14',
      );
    });
  }
}

class Grow extends StatelessWidget {
  const Grow({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        return InvitationBloc()
          ..add(FetchInvitations(InvitationGenerator.generateInvitations(10)));
      },
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                BlocBuilder<InvitationBloc, InvitationState>(
                  builder: (context, state) {
                    return Text(
                      'Invitations (${state.invitations.length})',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    );
                  },
                ),
                Icon(Icons.arrow_forward),
              ],
            ),
          ),
          BlocBuilder<InvitationBloc, InvitationState>(
            builder: (context, state) {
              return InvitationsList(
                invitations: state.invitations,
                isExpanded: false,
              );
            },
          ),
        ],
      ),
    );
  }
}
