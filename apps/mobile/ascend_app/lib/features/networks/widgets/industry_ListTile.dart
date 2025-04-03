import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/pages/industry_searching.dart';

Widget? printindustrySearching(
  List<CompanyModel> industrySearching,
  void Function(String) onindustrySearchingRemoved,
) {
  return industrySearching.isNotEmpty
      ? Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: Row(
          children: [
            industrySearching.length == 1
                ? Text(
                  "${industrySearching[0]}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[600],
                  ),
                )
                : Text(
                  "${industrySearching[0]} and ${industrySearching.length - 1} more",
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
                onindustrySearchingRemoved('industry');
              },
            ),
          ],
        ),
      )
      : null;
}

Widget buildIndustryList(
  List<CompanyModel> industrySearching,
  void Function(String) onindustrySearchingRemoved,
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
                child: IndustrySearching(),
              ),
        ),
      );
    },
    contentPadding: EdgeInsets.zero,
    title: const Text(
      'industry',
      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    ),
    subtitle: printindustrySearching(
      industrySearching,
      onindustrySearchingRemoved,
    ),
    trailing: Text(
      industrySearching.length > 0 ? 'Any' : 'Edit',
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
        color: Colors.grey[600],
      ),
    ),
  );
}
