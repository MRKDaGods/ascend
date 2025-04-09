import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/connections_of_searching.dart';

Widget? printConnectionsOfSearching(
  List<String> connectionsOfSearching,
  void Function(String) onConnectionsOfSearchingRemoved,
) {
  return connectionsOfSearching.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            connectionsOfSearching.length == 1
                ? Text(
                  "${connectionsOfSearching[0]}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${connectionsOfSearching[0]} and ${connectionsOfSearching.length - 1} more",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                ),
            SizedBox(width: 6),
            IconButton(
              icon: Icon(Icons.close, color: Colors.blue[600]),
              tooltip: "delete",
              onPressed: () {
                onConnectionsOfSearchingRemoved('ConnectionsOfSearching');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildConnectionsOfList(
  List<String> connectionsOfSearching,
  void Function(String) onConnectionsOfSearchingRemoved,
  BuildContext context,
) {
  return ListTile(
    onTap: () {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (_) => BlocProvider.value(
                value: BlocProvider.of<SearchFiltersBloc>(context),
                child: ConnectionsOfSearching(),
              ),
        ),
      );
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'Connections of',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printConnectionsOfSearching(
      connectionsOfSearching,
      onConnectionsOfSearchingRemoved,
    ),
    trailing: Text(
      connectionsOfSearching.length > 0 ? 'Edit' : 'Any',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
