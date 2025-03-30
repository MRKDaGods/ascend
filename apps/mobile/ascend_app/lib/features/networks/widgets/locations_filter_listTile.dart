import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/location_searching.dart';

Widget? printLocations(
  List<String> locations,
  void Function(String) onLocationsRemoved,
) {
  return locations.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            locations.length == 1
                ? Text(
                  "${locations[0]}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${locations[0]} and ${locations.length - 1} more",
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
                onLocationsRemoved('locations');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildLocationList(
  List<String> locations,
  void Function(String) onLocationsRemoved,
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
                child: LocationSearching(),
              ),
        ),
      );
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'Locations',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printLocations(locations, onLocationsRemoved),
    trailing: Text(
      locations.length > 0 ? 'Any' : 'Edit',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
