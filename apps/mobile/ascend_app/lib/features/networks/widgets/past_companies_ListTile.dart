import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/current_company_searching.dart';
import 'package:ascend_app/features/networks/widgets/past_company_modal.dart';

Widget? printpastCompanies(
  List<CompanyModel> pastCompanies,
  void Function(String) onpastCompaniesRemoved,
) {
  return pastCompanies.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            pastCompanies.length == 1
                ? Text(
                  "${pastCompanies[0].companyName}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${pastCompanies[0].companyName} and ${pastCompanies.length - 1} more",
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
                onpastCompaniesRemoved('pastCompanies');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildPastCompanyList(
  List<CompanyModel> pastCompanies,
  void Function(String) onpastCompaniesRemoved,
  BuildContext context,
) {
  return ListTile(
    onTap: () {
      Navigator.pop(context);
      Future.delayed(const Duration(milliseconds: 0), () {
        showpastCompanyModal(context);
      });
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'pastCompanies',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printpastCompanies(pastCompanies, onpastCompaniesRemoved),
    trailing: Text(
      pastCompanies.length > 0 ? 'Any' : 'Edit',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
