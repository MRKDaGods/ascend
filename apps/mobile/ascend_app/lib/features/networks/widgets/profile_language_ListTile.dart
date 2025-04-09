import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';

Widget? printprofileLanguageSearching(
  List<String> profileLanguageSearching,
  void Function(String) onprofileLanguageSearchingRemoved,
) {
  return profileLanguageSearching.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            profileLanguageSearching.length == 1
                ? Text(
                  "${profileLanguageSearching[0]}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${profileLanguageSearching[0]} and ${profileLanguageSearching.length - 1} more",
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
                onprofileLanguageSearchingRemoved('profileLanguages');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildProfileLanguageList(
  List<String> profileLanguageSearching,
  void Function(String) onprofileLanguageSearchingRemoved,
  BuildContext context,
) {
  return ListTile(
    onTap: () {
      /*Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (_) => BlocProvider.value(
                value: BlocProvider.of<SearchFiltersBloc>(context),
                child: IndustrySearching(),
              ),
        ),
      );*/
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'Profile Languages',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printprofileLanguageSearching(
      profileLanguageSearching,
      onprofileLanguageSearchingRemoved,
    ),
    trailing: Text(
      profileLanguageSearching.length > 0 ? 'Edit' : 'Any',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
