import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/company_search/bloc/company_search_bloc.dart';
import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/widgets/past_company_modal.dart';

class PastCompaniesSearching extends StatefulWidget {
  const PastCompaniesSearching({super.key});

  @override
  State<PastCompaniesSearching> createState() => _CompaniesSearchingState();
}

class _CompaniesSearchingState extends State<PastCompaniesSearching> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Initialize search on page load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CompanySearchBloc>().add(CompanySearchStarted());
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Companies',
          style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            Navigator.pop(context);
            Future.delayed(const Duration(milliseconds: 0), () {
              showpastCompanyModal(context);
            });
          },
        ),
      ),
      body: Column(
        children: [
          // Search Field
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search Companies (ex: Microsoft)',
                border: const UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.grey, width: 1.0),
                ),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    context.read<CompanySearchBloc>().add(
                      const CompanySearchQueryChanged(query: ''),
                    );
                  },
                ),
              ),
              onChanged: (query) {
                context.read<CompanySearchBloc>().add(
                  CompanySearchQueryChanged(query: query),
                );
              },
            ),
          ),

          // Companies List
          Expanded(
            child: BlocBuilder<CompanySearchBloc, CompanySearchState>(
              builder: (context, state) {
                if (state is CompanySearchLoading) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is CompanySearchError) {
                  return Center(
                    child: Text(
                      'Error: ${state.error}',
                      style: const TextStyle(color: Colors.red),
                    ),
                  );
                } else if (state is CompanySearchLoaded) {
                  final companies = state.companies;

                  if (companies.isEmpty) {
                    return const Center(
                      child: Text(
                        'No companies found',
                        style: TextStyle(fontSize: 18, color: Colors.grey),
                      ),
                    );
                  }

                  return ListView.builder(
                    itemCount: companies.length,
                    itemBuilder: (context, index) {
                      final company = companies[index];
                      return _buildCompanyTile(company);
                    },
                  );
                } else {
                  return const Center(
                    child: Text(
                      'Search for companies',
                      style: TextStyle(fontSize: 18, color: Colors.grey),
                    ),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCompanyTile(CompanyModel company) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: [
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage(company.companyLogoUrl),
                    fit: BoxFit.cover,
                  ),
                  color: Colors.grey.shade200,
                ),
              ),
            ),
            title: Text(
              company.companyName,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            subtitle: RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: company.companyIndustry,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  const TextSpan(
                    text: ' • ',
                    style: TextStyle(fontSize: 25, color: Colors.grey),
                  ),
                  TextSpan(
                    text: company.companyLocation,
                    style: const TextStyle(
                      fontSize: 14,
                      fontStyle: FontStyle.italic,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
            onTap: () {
              try {
                // Safely add the selected company to the filters
                final searchFiltersBloc = context.read<SearchFiltersBloc>();
                searchFiltersBloc.add(
                  SearchFiltersUpdate(key: 'pastCompanies', value: company),
                );
                Navigator.pop(context);
                Future.delayed(const Duration(milliseconds: 0), () {
                  showpastCompanyModal(context);
                });
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error selecting company: $e')),
                );
              }
            },
          ),
          const Divider(color: Colors.grey, thickness: 1),
        ],
      ),
    );
  }
}
