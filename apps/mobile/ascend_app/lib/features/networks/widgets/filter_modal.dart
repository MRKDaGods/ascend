import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/location_searching.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/widgets/connection_options_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/locations_filter_listTile.dart';
import 'package:ascend_app/features/networks/utils/search_filter.dart';
import 'package:ascend_app/features/networks/widgets/current_company_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/connectionsOf_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/followers_of_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/past_companies_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/school_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/industry_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/profile_language_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/open_to_ListTile.dart';
import 'package:ascend_app/features/networks/widgets/services_categories.dart';

void showFilterModal(BuildContext context) {
  showModalBottomSheet(
    context: context,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (bottomSheetContext) {
      return BlocProvider.value(
        value: context.read<SearchFiltersBloc>(),
        child: StatefulBuilder(
          builder: (context, setState) {
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
                  final filters = state.filters;
                  final bool _isReset = checkIfReset(filters);
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Fixed (Non-Scrollable) Filter Header
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Drag Handle
                            Center(
                              child: Container(
                                width: 40,
                                height: 4,
                                decoration: BoxDecoration(
                                  color: Colors.black26,
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListTile(
                              contentPadding: EdgeInsets.zero,
                              leading: const Text(
                                'Filter',
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              trailing:
                                  !_isReset
                                      ? TextButton(
                                        onPressed: () {
                                          BlocProvider.of<SearchFiltersBloc>(
                                            context,
                                          ).add(SearchFiltersReset());
                                        },
                                        child: const Text(
                                          'Reset',
                                          style: TextStyle(
                                            fontSize: 22,
                                            fontWeight: FontWeight.bold,
                                            color: Color.fromARGB(
                                              255,
                                              8,
                                              55,
                                              102,
                                            ),
                                          ),
                                        ),
                                      )
                                      : null,
                            ),
                            const Divider(color: Colors.grey, thickness: 3),
                          ],
                        ),

                        // Scrollable Filters
                        Expanded(
                          child: SingleChildScrollView(
                            child: Column(
                              children: [
                                buildConnectionsOptionsListTile((newSelection) {
                                  context.read<SearchFiltersBloc>().add(
                                    SearchFiltersUpdate(
                                      key: 'connectionOptions',
                                      value: newSelection,
                                    ),
                                  );
                                }, state.filters.connectionOptions),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildLocationList(state.filters.locations, (_) {
                                  context.read<SearchFiltersBloc>().add(
                                    SearchFiltersClear(key: 'locations'),
                                  );
                                }, context),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildCurrentCompanyList(
                                  state.filters.currentCompanies,
                                  (_) {
                                    context.read<SearchFiltersBloc>().add(
                                      SearchFiltersClear(
                                        key: 'currentCompanies',
                                      ),
                                    );
                                  },
                                  context,
                                ),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildConnectionsOfList(
                                  state.filters.connectionsOf,
                                  (_) {
                                    context.read<SearchFiltersBloc>().add(
                                      SearchFiltersClear(key: 'connectionsOf'),
                                    );
                                  },
                                  context,
                                ),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildFollowersOfList(
                                  state.filters.followersOf,
                                  (_) {
                                    context.read<SearchFiltersBloc>().add(
                                      SearchFiltersClear(key: 'followersOf'),
                                    );
                                  },
                                  context,
                                ),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildPastCompanyList(
                                  state.filters.pastCompanies,
                                  (_) {
                                    context.read<SearchFiltersBloc>().add(
                                      SearchFiltersClear(key: 'pastCompanies'),
                                    );
                                  },
                                  context,
                                ),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildSchoolsList(state.filters.schools, (_) {
                                  context.read<SearchFiltersBloc>().add(
                                    SearchFiltersClear(key: 'schools'),
                                  );
                                }, context),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildIndustryList(state.filters.industries, (
                                  _,
                                ) {
                                  context.read<SearchFiltersBloc>().add(
                                    SearchFiltersClear(key: 'industries'),
                                  );
                                }, context),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildProfileLanguageList(
                                  state.filters.profileLanguages,
                                  (_) {
                                    context.read<SearchFiltersBloc>().add(
                                      SearchFiltersClear(
                                        key: 'profileLanguages',
                                      ),
                                    );
                                  },
                                  context,
                                ),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildopenToList(state.filters.openTo, (_) {
                                  context.read<SearchFiltersBloc>().add(
                                    SearchFiltersClear(key: 'openTo'),
                                  );
                                }, context),
                                const Divider(color: Colors.grey, thickness: 3),
                                buildServicesCategoriesList(
                                  state.filters.serviceCategories,
                                  (_) {
                                    context.read<SearchFiltersBloc>().add(
                                      SearchFiltersClear(
                                        key: 'servicesCategories',
                                      ),
                                    );
                                  },
                                  context,
                                ),
                                const Divider(color: Colors.grey, thickness: 3),
                              ],
                            ),
                          ),
                        ),
                        // Fixed (Non-Scrollable) Filter Footer
                        Divider(color: Colors.grey, thickness: 3),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          child: SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color.fromARGB(
                                  255,
                                  8,
                                  55,
                                  102,
                                ),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                  horizontal: 32,
                                ),
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
                    ),
                  );
                } else {
                  return const Center(child: Text('Unknown state'));
                }
              },
            );
          },
        ),
      );
    },
  );
}
