
import 'package:ascend_app/features/CompanyPage/company_page.dart';
import 'package:ascend_app/features/Jobs/pages/create_company.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/company_details.dart';
import 'package:http/http.dart' as http;

class CompanyCard extends StatelessWidget {
  final String companyName;
  final String industry;
  final String location;
  final String? logoUrl;
  final int companyId;
  final bool isFromCompanyDetails; // Added flag
  final String? description;
  final String? domainName;

  const CompanyCard({
    super.key,
    required this.companyName,
    required this.industry,
    required this.location,
    this.logoUrl,
    required this.companyId,
    this.isFromCompanyDetails = false, // Default value
    this.description,
    this.domainName,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CompanyDetails(companyId: companyId),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // Company Logo
            ClipRRect(
              borderRadius: BorderRadius.circular(4.0),
              child: Container(
                color: Colors.grey[200],
                child: SizedBox(
                  width: 50,
                  height: 50,
                  child:
                      logoUrl != null && logoUrl!.isNotEmpty
                          ? Image.network(
                            logoUrl!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Icon(
                                Icons.image_not_supported,
                                size: 50,
                                color: Colors.grey,
                              );
                            },
                          )
                          : Icon(
                            Icons.image_not_supported,
                            size: 50,
                            color: Colors.grey,
                          ),
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Company Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder:
                              (context) => CompanyPage(
                                name: companyName,
                                profileImageUrl: logoUrl ?? '',
                                coverImageUrl: '',
                                location: location,
                                industry: industry,
                                connections: 0,
                                verified: false,
                                bio: description ?? '',
                                sections: [],
                                isconnect: false,
                                isfollow: false,
                                isPending: false,
                                mutualConnections: [],
                                webSiteExists: false,
                                links: [],
                                badges: [],
                              ),
                        ),
                      );
                    },
                    child: Text(
                      companyName,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    industry,
                    style: const TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    location,
                    style: const TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                ],
              ),
            ),
            if (isFromCompanyDetails) ...[
              PopupMenuButton(
                icon: const Icon(Icons.more_vert),
                onSelected: (value) async {
                  if (value == 'edit') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder:
                            (context) => CreateCompany(
                              isEditMode: true,
                              companyId: companyId,
                              companyName: companyName,
                              description: description,
                              industry: industry,
                              location: location,
                              logoUrl: logoUrl,
                            ),
                      ),
                    );
                  } else if (value == 'delete') {

                    final confirmDelete = await showDialog<bool>(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: const Text('Confirm Deletion'),
                          content: const Text('Are you sure you want to delete this company?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(false),
                              child: const Text('Cancel'),
                            ),
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(true),
                              child: const Text('Delete'),
                            ),
                          ],
                        );
                      },
                    );

                    if (confirmDelete == true) {
                      final token = await SecureStorageHelper.getAuthToken();
                      final headers = {
                        if (token != null) 'Authorization': 'Bearer $token',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      };
                      final String _baseUrl = 'https://api.ascendx.tech';
                      final endpoint = '/company/companies/$companyId';
                      final url = Uri.parse('$_baseUrl$endpoint');
                      final response = await http.delete(url, headers: headers);
                      if (response.statusCode == 200) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Company deleted successfully.')),
                        );
                        print('DELETE request successful: ${response.body}');
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to delete company: ${response.body}')),
                        );
                        print(
                          'DELETE request failed: ${response.statusCode}, ${response.body}',
                        );
                      }
                    }

                  }
                },
                itemBuilder:
                    (context) => [
                      PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: const [
                            Icon(Icons.edit, color: Colors.blue),
                            SizedBox(width: 8),
                            Text('Edit Company'),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: const [
                            Icon(Icons.delete, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete Company'),
                          ],
                        ),
                      ),
                    ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
