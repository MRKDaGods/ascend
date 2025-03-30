import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';

Widget buildConnectionsOptionsListTile(
  Function(Set<String>) onChange,
  Set<String> connectionOptions,
) {
  return ListTile(
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'Connections',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: SegmentedButton<String>(
      segments: [
        ButtonSegment<String>(value: '1st', label: const Text('1st')),
        ButtonSegment<String>(value: '2nd', label: const Text('2nd')),
        ButtonSegment<String>(value: '3rd+', label: const Text('3rd+')),
      ],
      selected: connectionOptions.map((e) => e.toString()).toSet(),
      showSelectedIcon: false,
      emptySelectionAllowed: true,
      multiSelectionEnabled: true,
      onSelectionChanged: (Set<String> newSelection) {
        onChange(newSelection);
      },
      style: SegmentedButton.styleFrom(
        selectedBackgroundColor: Colors.green[600],
        backgroundColor: Colors.grey[300],
        selectedForegroundColor: Colors.white,
        foregroundColor: Colors.black,
        padding: const EdgeInsets.all(8),
      ),
    ),
  );
}
