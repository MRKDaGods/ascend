import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/utils/search_filter.dart';
import 'package:ascend_app/features/networks/bloc/bloc/company_search/bloc/company_search_bloc.dart';
import 'package:ascend_app/features/networks/pages/current_company_searching.dart';
import 'package:ascend_app/features/networks/widgets/filter_modal.dart';
import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:ascend_app/features/networks/Repositories/company_repository.dart';

class CompanyButtonsWidget extends StatefulWidget {
  final List<CompanyModel> companies;

  const CompanyButtonsWidget({Key? key, required this.companies})
    : super(key: key);

  @override
  State<CompanyButtonsWidget> createState() => _CompanyButtonsWidgetState();
}

class _CompanyButtonsWidgetState extends State<CompanyButtonsWidget> {
  final Map<String, bool> _pressedStates = {};

  @override
  void initState() {
    super.initState();
    // Initialize states
    for (var company in widget.companies) {
      _pressedStates[company.companyId] = true; // Initially selected
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.companies.isEmpty) {
      return const SizedBox.shrink();
    }

    return Wrap(
      spacing: 8.0,
      runSpacing: 4.0,
      children:
          widget.companies.map((company) {
            final isPressed = _pressedStates[company.companyId] ?? false;

            return OutlinedButton(
              onPressed: () {
                setState(() {
                  _pressedStates[company.companyId] = !isPressed;
                });

                // Update the search filters
                if (!isPressed) {
                  context.read<SearchFiltersBloc>().add(
                    SearchFiltersUpdate(
                      key: 'currentCompanies',
                      value: company,
                    ),
                  );
                } else {
                  context.read<SearchFiltersBloc>().add(
                    SearchFiltersRemove(
                      key: 'currentCompanies',
                      value: company,
                    ),
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
                      company.companyName,
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

Widget buildCompanySelectedButtons(
  BuildContext context,
  List<CompanyModel>? companies,
) {
  // Safety check - handle null companies
  final List<CompanyModel> companyList = companies ?? [];

  if (companyList.isEmpty) {
    return const SizedBox.shrink();
  }

  return CompanyButtonsWidget(companies: companyList);
}

void showCurrentCompanyModal(BuildContext context) {
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
            BlocProvider(create: (context) => CompanySearchBloc()),
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
                    'Current Companies',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                ),
                state.filters.currentCompanies.isNotEmpty
                    ? TextButton(
                      onPressed: () {
                        context.read<SearchFiltersBloc>().add(
                          SearchFiltersReset(),
                        );
                      },
                      child: Text(
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
            // Add company button
            OutlinedButton.icon(
              onPressed: () {
                _navigateToCompanySearch(context, searchFiltersBloc);
              },
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.all(12),
                side: const BorderSide(color: Colors.grey),
              ),
              icon: const Icon(Icons.search, color: Colors.grey),
              label: const Text(
                'Add a Company',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Company buttons - use ListView.builder for better memory management
            if (state.filters.currentCompanies != null &&
                state.filters.currentCompanies!.isNotEmpty)
              buildCompanySelectedButtons(
                context,
                state.filters.currentCompanies,
              ),
          ],
        ),
      ),
      //Show Results Button
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: SizedBox(
          width: double.infinity,
          child: OutlinedButton(
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

void _navigateToCompanySearch(
  BuildContext context,
  SearchFiltersBloc searchFiltersBloc,
) {
  // Close the current modal first to prevent memory stacking
  Navigator.of(context).pop();

  // Small delay to ensure the animation completes
  Future.delayed(const Duration(milliseconds: 100), () {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder:
            (newContext) => MultiBlocProvider(
              providers: [
                // Provide the existing SearchFiltersBloc by value
                BlocProvider.value(value: searchFiltersBloc),
                // Create a new CompanySearchBloc only when needed
                BlocProvider<CompanySearchBloc>(
                  create:
                      (_) => CompanySearchBloc()..add(CompanySearchStarted()),
                ),
              ],
              child: const CurrentCompaniesSearching(),
            ),
      ),
    );
  });
}
