import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/location_search/bloc/location_search_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/location_model.dart';
import 'package:ascend_app/features/networks/widgets/location_modal.dart'; // Import to access showLocationModal

class LocationSearching extends StatelessWidget {
  const LocationSearching({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Locations'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: _buildSearchField(),
          ),
          Expanded(child: _buildLocationList()),
        ],
      ),
    );
  }

  Widget _buildSearchField() {
    return BlocBuilder<LocationSearchBloc, LocationSearchState>(
      buildWhen:
          (previous, current) =>
              previous is LocationSearchInitial ||
              (previous is LocationSearchLoaded &&
                  current is LocationSearchLoaded &&
                  previous.searchQuery != current.searchQuery),
      builder: (context, state) {
        return TextField(
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Search locations...',
            prefixIcon: const Icon(Icons.search),
            suffixIcon:
                (state is LocationSearchLoaded && state.searchQuery.isNotEmpty)
                    ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        context.read<LocationSearchBloc>().add(
                          const LocationSearchQueryChanged(''),
                        );
                      },
                    )
                    : null,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          ),
          onChanged: (query) {
            context.read<LocationSearchBloc>().add(
              LocationSearchQueryChanged(query),
            );
          },
        );
      },
    );
  }

  Widget _buildLocationList() {
    return BlocBuilder<LocationSearchBloc, LocationSearchState>(
      builder: (context, state) {
        if (state is LocationSearchInitial) {
          return const Center(child: Text('Start typing to search locations'));
        } else if (state is LocationSearchLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is LocationSearchLoaded) {
          if (state.isSearching) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state.locations.isEmpty) {
            return const Center(child: Text('No locations found'));
          }

          return ListView.builder(
            itemCount: state.locations.length,
            itemBuilder: (context, index) {
              final location = state.locations[index];
              return _buildLocationTile(context, location);
            },
          );
        } else if (state is LocationSearchError) {
          return Center(child: Text('Error: ${state.message}'));
        }
        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildLocationTile(BuildContext context, LocationModel location) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: ListTile(
        title: Text(
          location.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(location.country),
        onTap: () {
          final searchFiltersBloc = context.read<SearchFiltersBloc>();
          searchFiltersBloc.add(
            SearchFiltersUpdate(key: 'locations', value: location),
          );
          Navigator.pop(context);
          Future.delayed(
            const Duration(milliseconds: 0),
            () => showLocationModal(context),
          );
        },
      ),
    );
  }
}
