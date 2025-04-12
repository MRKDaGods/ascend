import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/utils/overlay_builder.dart';
import 'package:ascend_app/features/networks/widgets/selection_buttons.dart';
import 'package:ascend_app/features/networks/utils/connection_request_received_filter.dart';
import 'package:ascend_app/features/networks/utils/enums.dart';
import 'package:ascend_app/features/networks/widgets/custom_filter_chip.dart';

class ConnectionRequestsReceivedListFull extends StatefulWidget {
  final Function(String) onAccept;
  final Function(String) onDecline;

  const ConnectionRequestsReceivedListFull({
    super.key,
    required this.onAccept,
    required this.onDecline,
  });

  @override
  _ConnectionRequestsReceivedListFullState createState() =>
      _ConnectionRequestsReceivedListFullState();
}

class _ConnectionRequestsReceivedListFullState
    extends State<ConnectionRequestsReceivedListFull>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<bool> isSelectedList = [true, false, false];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this); // 3 tabs
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        if (state is ConnectionRequestSuccess) {
          if (state.pendingRequestsReceived.isEmpty) {
            return const SizedBox.shrink();
          }
          return Column(
            children: [
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      CustomFilterChip(
                        labelText:
                            'All (${state.pendingRequestsReceived.length})',
                        isSelected: isSelectedList[0],
                        onSelected: () {
                          setState(() {
                            isSelectedList = [true, false, false];
                            _tabController.animateTo(0);
                          });
                        },
                      ),
                      const SizedBox(width: 8),
                      CustomFilterChip(
                        labelText: 'Newsletter (0)',
                        isSelected: isSelectedList[1],
                        onSelected: () {
                          setState(() {
                            isSelectedList = [false, true, false];
                            _tabController.animateTo(1);
                          });
                        },
                      ),
                      const SizedBox(width: 8),
                      CustomFilterChip(
                        labelText:
                            'People (${state.pendingRequestsReceived.length})',
                        isSelected: isSelectedList[2],
                        onSelected: () {
                          setState(() {
                            isSelectedList = [false, false, true];
                            _tabController.animateTo(2);
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const Divider(thickness: 1),
              if (isSelectedList[0]) ...[
                buildReceived(
                  state.pendingRequestsReceived,
                  ConnectionRequestReceivedFilterMode.All,
                  widget.onAccept,
                  widget.onDecline,
                ),
              ] else if (isSelectedList[1]) ...[
                buildReceived(
                  state.pendingRequestsReceived,
                  ConnectionRequestReceivedFilterMode.Newsletter,
                  widget.onAccept,
                  widget.onDecline,
                ),
              ] else if (isSelectedList[2]) ...[
                buildReceived(
                  state.pendingRequestsReceived,
                  ConnectionRequestReceivedFilterMode.People,
                  widget.onAccept,
                  widget.onDecline,
                ),
              ],
            ],
          );
        } else {
          return const SizedBox.shrink();
        }
      },
    );
  }
}
