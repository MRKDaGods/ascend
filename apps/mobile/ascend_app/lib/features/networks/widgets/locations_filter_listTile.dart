import 'package:ascend_app/features/networks/model/location_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/location_searching.dart';
import 'package:ascend_app/features/networks/widgets/location_modal.dart';

Widget? printLocations(
  List<LocationModel> locations,
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
  List<LocationModel> locations,
  void Function(String) onLocationsRemoved,
  BuildContext context,
) {
  return ListTile(
    onTap: () {
      showLocationModal(context);
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'Locations',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printLocations(locations, onLocationsRemoved),
    trailing: Text(
      locations.length > 0 ? 'Edit' : 'Any',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
