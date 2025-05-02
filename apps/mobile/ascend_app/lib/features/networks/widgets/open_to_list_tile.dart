import 'package:flutter/material.dart';

Widget? printopenToSearching(
  List<String> openToSearching,
  void Function(String) onopenToSearchingRemoved,
) {
  return openToSearching.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            openToSearching.length == 1
                ? Text(
                  openToSearching[0],
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${openToSearching[0]} and ${openToSearching.length - 1} more",
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
                onopenToSearchingRemoved('openTo');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildopenToList(
  List<String> openToSearching,
  void Function(String) onopenToSearchingRemoved,
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
      'Open To',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printopenToSearching(openToSearching, onopenToSearchingRemoved),
    trailing: Text(
      openToSearching.isNotEmpty ? 'Edit' : 'Any',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
