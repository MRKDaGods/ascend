import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/location_search/bloc/location_search_bloc.dart';
import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/utils/search_filter.dart';
import 'package:ascend_app/features/networks/model/location_model.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/widgets/filter_modal.dart';
import 'package:ascend_app/features/networks/pages/location_searching.dart';

// Make showLocationModal accessible from anywhere
void showLocationModal(BuildContext context) {
  final searchFiltersBloc = context.read<SearchFiltersBloc>();

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (bottomSheetContext) {
      return SafeArea(
        child: MultiBlocProvider(
          providers: [
            BlocProvider.value(value: searchFiltersBloc),
            BlocProvider(create: (context) => LocationSearchBloc()),
          ],
          child: DraggableScrollableSheet(
            expand: false,
            initialChildSize: 0.4,
            minChildSize: 0.3,
            maxChildSize: 0.8,
            builder: (context, scrollController) {
              return BlocBuilder<SearchFiltersBloc, SearchFiltersState>(
                builder: (context, state) {
                  if (state is SearchFiltersLoading) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (state is SearchFiltersError) {
                    return Center(
                      child: Text(
                        'Error: ${state.error}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    );
                  } else if (state is SearchFiltersLoaded) {
                    return _buildModalContent(
                      context,
                      state,
                      scrollController,
                      searchFiltersBloc,
                    );
                  }
                  return const Center(child: Text('Unknown state'));
                },
              );
            },
          ),
        ),
      );
    },
  );
}

// Also extract _buildModalContent as a top-level function
Widget _buildModalContent(
  BuildContext context,
  SearchFiltersLoaded state,
  ScrollController scrollController,
  SearchFiltersBloc searchFiltersBloc,
) {
  return Column(
    children: [
      // Fixed header
      Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 30),
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.grey),
                  onPressed: () {
                    Navigator.pop(context);
                    // Delay showing the filter modal to avoid animation issues
                    Future.delayed(
                      const Duration(milliseconds: 0),
                      () => showFilterModal(context),
                    );
                  },
                ),
                const Expanded(
                  child: Text(
                    'Locations',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                ),
                state.filters.locations.isNotEmpty
                    ? TextButton(
                      onPressed: () {
                        context.read<SearchFiltersBloc>().add(
                          const SearchFiltersClear(key: 'locations'),
                        );
                      },
                      child: const Text(
                        'Reset',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 8, 55, 102),
                        ),
                      ),
                    )
                    : const SizedBox.shrink(),
              ],
            ),
            const Divider(color: Colors.grey, thickness: 3),
          ],
        ),
      ),

      // Scrollable content
      Expanded(
        child: ListView(
          controller: scrollController,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          children: [
            // Add location button
            OutlinedButton.icon(
              onPressed: () {
                _navigateToLocationSearch(context, searchFiltersBloc);
              },
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.all(12),
                side: const BorderSide(color: Colors.grey),
              ),
              icon: const Icon(Icons.search, color: Colors.grey),
              label: const Text(
                'Add a Location',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
            ),
            const SizedBox(height: 20),

            if (state.filters.locations.isNotEmpty)
              buildLocationSelectedButtons(context, state.filters.locations),
          ],
        ),
      ),
      //Show Results Button
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color.fromARGB(255, 8, 55, 102),
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 32),
            ),
            child: const Text(
              'Show Results',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    ],
  );
}

// Extract the navigation function as a top-level function
void _navigateToLocationSearch(
  BuildContext context,
  SearchFiltersBloc searchFiltersBloc,
) {
  final locationSearchBloc = LocationSearchBloc();

  locationSearchBloc.add(LocationSearchStarted());

  Navigator.of(context).pop();

  // Small delay to ensure animations complete
  Future.delayed(const Duration(milliseconds: 100), () {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder:
            (context) => MultiBlocProvider(
              providers: [
                // Provide LocationSearchBloc
                BlocProvider<LocationSearchBloc>.value(
                  value: locationSearchBloc,
                ),
                // Also provide SearchFiltersBloc so it can be accessed in LocationSearching
                BlocProvider<SearchFiltersBloc>.value(value: searchFiltersBloc),
              ],
              child: const LocationSearching(),
            ),
      ),
    );
  });
}

// Extract buildLocationSelectedButtons as a top-level function
Widget buildLocationSelectedButtons(
  BuildContext context,
  List<LocationModel> locations,
) {
  if (locations.isEmpty) {
    return const SizedBox.shrink();
  }

  return LocationButtonsWidget(locations: locations);
}

class LocationButtonsWidget extends StatefulWidget {
  final List<LocationModel> locations;

  const LocationButtonsWidget({Key? key, required this.locations})
    : super(key: key);

  @override
  State<LocationButtonsWidget> createState() => _LocationButtonsWidgetState();
}

class _LocationButtonsWidgetState extends State<LocationButtonsWidget> {
  final Map<String, bool> _pressedStates = {};

  @override
  void initState() {
    super.initState();
    // Initialize states
    for (var location in widget.locations) {
      _pressedStates[location.id] = true; // Initially selected
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.locations.isEmpty) {
      return const SizedBox.shrink();
    }

    return Wrap(
      spacing: 8.0,
      runSpacing: 4.0,
      children:
          widget.locations.map((location) {
            final isPressed = _pressedStates[location.id] ?? false;

            return OutlinedButton(
              onPressed: () {
                setState(() {
                  _pressedStates[location.id] = !isPressed;
                });

                // Update the search filters
                if (!isPressed) {
                  context.read<SearchFiltersBloc>().add(
                    SearchFiltersUpdate(key: 'locations', value: location),
                  );
                } else {
                  context.read<SearchFiltersBloc>().add(
                    SearchFiltersRemove(key: 'locations', value: location),
                  );
                }
              },
              style: OutlinedButton.styleFrom(
                backgroundColor: isPressed ? Colors.green : Colors.grey,
                side: BorderSide(
                  color: isPressed ? Colors.green : Colors.grey,
                  width: 2.0,
                ),
              ),
              child: Center(
                child: Row(
                  mainAxisSize:
                      MainAxisSize.min, // Important to prevent overflow
                  children: [
                    Text(
                      location.name,
                      style: TextStyle(
                        color: isPressed ? Colors.white : Colors.grey,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                      overflow: TextOverflow.ellipsis, // Prevent text overflow
                    ),
                    const SizedBox(width: 5),
                    Icon(
                      isPressed ? Icons.check : Icons.add,
                      color: isPressed ? Colors.white : Colors.grey,
                      size: 18, // Smaller icon
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
    );
  }
}
