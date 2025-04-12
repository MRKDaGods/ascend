import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/widgets/custom_filter_chip.dart';
import 'package:ascend_app/features/networks/utils/connection_request_sent_filter.dart';
import 'package:ascend_app/features/networks/utils/enums.dart';

class ConnectionRequestsSent extends StatefulWidget {
  final Function(String) onRemove;

  const ConnectionRequestsSent({super.key, required this.onRemove});

  @override
  _ConnectionRequestsSentState createState() => _ConnectionRequestsSentState();
}

class _ConnectionRequestsSentState extends State<ConnectionRequestsSent>
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
                            'People (${state.pendingRequestsSent.length})',
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
                        labelText: 'Pages (0)',
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
                        labelText: 'Events (0)',
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
                buildSent(
                  state.pendingRequestsSent,
                  widget.onRemove,
                  ConnectionRequestSentFilterMode.People,
                ),
              ] else if (isSelectedList[1]) ...[
                buildSent(
                  state.pendingRequestsSent,
                  widget.onRemove,
                  ConnectionRequestSentFilterMode.Pages,
                ),
              ] else if (isSelectedList[2]) ...[
                buildSent(
                  state.pendingRequestsSent,
                  widget.onRemove,
                  ConnectionRequestSentFilterMode.Events,
                ),
              ],
            ],
          );
        } else {
          return const Center(child: CircularProgressIndicator());
        }
      },
    );
  }
}
