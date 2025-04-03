import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/current_company_searching.dart';
import 'package:ascend_app/features/networks/widgets/current_company_modal.dart';
import 'package:ascend_app/features/networks/widgets/filter_modal.dart';
import 'package:ascend_app/features/networks/model/company_model.dart';

Widget? printcurrentCompanies(
  List<CompanyModel> currentCompanies,
  void Function(String) oncurrentCompaniesRemoved,
) {
  return currentCompanies.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            currentCompanies.length == 1
                ? Text(
                  "${currentCompanies[0].companyName}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${currentCompanies[0].companyName} and ${currentCompanies.length - 1} more",
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
                oncurrentCompaniesRemoved('currentCompanies');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildCurrentCompanyList(
  List<CompanyModel> currentCompanies,
  void Function(String) oncurrentCompaniesRemoved,
  BuildContext context,
) {
  return ListTile(
    onTap: () {
      Navigator.pop(context);
      Future.delayed(const Duration(milliseconds: 0), () {
        showCurrentCompanyModal(context);
      });
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'currentCompanies',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printcurrentCompanies(
      currentCompanies,
      oncurrentCompaniesRemoved,
    ),
    trailing: Text(
      currentCompanies.length > 0 ? 'Edit' : 'Any',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
