import 'package:ascend_app/features/networks/model/search_model.dart';

bool checkIfReset(SearchModel filters) {
  return filters.connectionOptions.isEmpty &&
      filters.locations.isEmpty &&
      filters.currentCompanies.isEmpty &&
      filters.connectionsOf.isEmpty &&
      filters.followersOf.isEmpty &&
      filters.pastCompanies.isEmpty &&
      filters.schools.isEmpty &&
      filters.industries.isEmpty &&
      filters.profileLanguages.isEmpty &&
      filters.openTo.isEmpty &&
      filters.serviceCategories.isEmpty &&
      filters.firstName == '' &&
      filters.lastName == '' &&
      filters.title == '' &&
      filters.company == null &&
      filters.school == '';
}

bool checkIfResetcurrentCompanies(SearchModel filters) {
  return filters.currentCompanies.isEmpty;
}

bool checkIfResetpastCompanies(SearchModel filters) {
  return filters.pastCompanies.isEmpty;
}

bool checkIfResetIndustries(SearchModel filters) {
  return filters.industries.isEmpty;
}
