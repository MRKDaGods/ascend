import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/followers_of_searching.dart';

Widget? printfollowersOfSearching(
  List<String> followersOfSearching,
  void Function(String) onfollowersOfSearchingRemoved,
) {
  return followersOfSearching.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            followersOfSearching.length == 1
                ? Text(
                  "${followersOfSearching[0]}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${followersOfSearching[0]} and ${followersOfSearching.length - 1} more",
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
                onfollowersOfSearchingRemoved('followersOfSearching');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildFollowersOfList(
  List<String> followersOfSearching,
  void Function(String) onfollowersOfSearchingRemoved,
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
                child: FollowersOfSearching(),
              ),
        ),
      );
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'Followers of',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printfollowersOfSearching(
      followersOfSearching,
      onfollowersOfSearchingRemoved,
    ),
    trailing: Text(
      followersOfSearching.length > 0 ? 'Any' : 'Edit',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
