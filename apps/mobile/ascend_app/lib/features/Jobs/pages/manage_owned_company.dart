import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/company_card.dart';
import 'dart:convert';

import 'package:ascend_app/features/Jobs/pages/create_company.dart';

class ManageOwnedCompany extends StatefulWidget {
  const ManageOwnedCompany({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _ManageOwnedCompanyState createState() => _ManageOwnedCompanyState();
}

class _ManageOwnedCompanyState extends State<ManageOwnedCompany> {
  List<dynamic> companies = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchCompanies();
  }

  Future<void> fetchCompanies() async {
    final apiClient = ApiClient();

    try {
      final response = await apiClient.get('/company/companies');
      print("Response: ${response.body}");
      if (response.statusCode == 200) {
        setState(() {
          companies = json.decode(response.body)['data']['companies'];
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load companies');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error fetching companies: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Manage Owned Companies')),
      backgroundColor:
          Colors.transparent, // Make Scaffold background transparent
      body: Stack(
        children: [
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : companies.isEmpty
              ? const Center(child: Text('No companies found.'))
              : ListView.builder(
                itemCount: companies.length,
                padding: EdgeInsets.zero, // Remove default padding
                itemBuilder: (context, index) {
                  final company = companies[index];
                  return CompanyCard(
                    companyName: company['company_name'],
                    industry: company['industry'],
                    location: company['location'],
                    logoUrl: company['profile_photo_url'],
                    companyId: company['company_id'],
                    isFromCompanyDetails: true,
                    description: company['description'],
                    domainName: company['company_domain_name'],
                  );
                },
              ),
          Positioned(
            bottom: 16,
            right: 16,
            child: FloatingActionButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CreateCompany(),
                  ),
                );
              },
              child: const Icon(Icons.add),
            ),
          ),
        ],
      ),
    );
  }
}
