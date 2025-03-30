import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
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
      filters.company == '' &&
      filters.school == '';
}
