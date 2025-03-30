import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/companies_searching.dart';

Widget? printcurrentCompanies(
  List<String> currentCompanies,
  void Function(String) oncurrentCompaniesRemoved,
) {
  return currentCompanies.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            currentCompanies.length == 1
                ? Text(
                  "${currentCompanies[0]}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${currentCompanies[0]} and ${currentCompanies.length - 1} more",
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
  List<String> currentCompanies,
  void Function(String) oncurrentCompaniesRemoved,
  BuildContext context,
) {
  return ListTile(
    onTap: () {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (_) => BlocProvider.value(
                value: BlocProvider.of<SearchFiltersBloc>(context),
                child: CompaniesSearching(),
              ),
        ),
      );
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
      currentCompanies.length > 0 ? 'Any' : 'Edit',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
