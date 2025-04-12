import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';
import 'package:ascend_app/features/networks/model/location_model.dart';

abstract class SearchFilterRepository {
  // Get current filters
  SearchModel getFilters();

  // Add a company to filters
  Future<SearchModel> addCompany(CompanyModel company);

  // Remove a company from filters
  Future<SearchModel> removeCompany(CompanyModel company);

  // Update specific filter field
  Future<SearchModel> updateFilter({
    required String key,
    required dynamic value,
  });

  // Remove a specific filter value
  Future<SearchModel> removeFilter({
    required String key,
    required dynamic value,
  });

  // Clear a specific filter category
  Future<SearchModel> clearFilter(String key);

  // Reset all filters
  Future<SearchModel> resetFilters();
}

class MemorySearchFilterRepository implements SearchFilterRepository {
  // In-memory storage using SearchModel
  // Use a private instance to prevent direct mutation
  SearchModel _filters = SearchModel.defaultModel();

  @override
  SearchModel getFilters() {
    // Return current filters
    return _filters;
  }

  @override
  Future<SearchModel> addCompany(CompanyModel company) async {
    try {
      // Get current companies
      final currentCompanies = List<CompanyModel>.from(
        _filters.currentCompanies,
      );

      // Check if company already exists
      if (!currentCompanies.any((c) => c.companyId == company.companyId)) {
        // Create a new list with the additional company
        currentCompanies.add(company);

        // Create a new SearchModel with updated companies
        _filters = _filters.copyWith(currentCompanies: currentCompanies);
      }

      return _filters;
    } catch (e) {
      print('Error adding company: $e');
      return _filters;
    }
  }

  @override
  Future<SearchModel> removeCompany(CompanyModel company) async {
    try {
      // Create a new list without the specified company
      final updatedCompanies =
          _filters.currentCompanies
              .where((c) => c.companyId != company.companyId)
              .toList();

      // Create a new SearchModel with updated companies
      _filters = _filters.copyWith(currentCompanies: updatedCompanies);

      return _filters;
    } catch (e) {
      print('Error removing company: $e');
      return _filters;
    }
  }

  @override
  Future<SearchModel> clearFilter(String key) async {
    try {
      // Handle clearing different filter types
      switch (key) {
        case 'connectionOptions':
          _filters = _filters.copyWith(connectionOptions: {});
          break;
        case 'locations':
          _filters = _filters.copyWith(locations: []);
          break;
        case 'currentCompanies':
          _filters = _filters.copyWith(currentCompanies: []);
          break;
        case 'connectionsOf':
          _filters = _filters.copyWith(connectionsOf: []);
          break;
        case 'followersOf':
          _filters = _filters.copyWith(followersOf: []);
          break;
        case 'pastCompanies':
          _filters = _filters.copyWith(pastCompanies: []);
          break;
        case 'schools':
          _filters = _filters.copyWith(schools: []);
          break;
        case 'industries':
          _filters = _filters.copyWith(industries: []);
          break;
        case 'profileLanguages':
          _filters = _filters.copyWith(profileLanguages: []);
          break;
        case 'openTo':
          _filters = _filters.copyWith(openTo: []);
          break;
        case 'serviceCategories':
          _filters = _filters.copyWith(serviceCategories: []);
          break;
        case 'firstName':
          _filters = _filters.copyWith(firstName: '');
          break;
        case 'lastName':
          _filters = _filters.copyWith(lastName: '');
          break;
        case 'title':
          _filters = _filters.copyWith(title: '');
          break;
        case 'company':
          _filters = _filters.copyWith(company: null);
          break;
        case 'school':
          _filters = _filters.copyWith(school: '');
          break;
        // Handle all other fields
        default:
          print('Warning: Filter key "$key" not recognized');
          break;
      }

      return _filters;
    } catch (e) {
      print('Error clearing filter: $e');
      return _filters;
    }
  }

  @override
  Future<SearchModel> updateFilter({
    required String key,
    required dynamic value,
  }) async {
    try {
      // Create a new SearchModel based on the key and value
      switch (key) {
        case 'connectionOptions':
          if (value is Set<String>) {
            _filters = _filters.copyWith(connectionOptions: value);
          }
          break;
        case 'locations':
          if (value is LocationModel) {
            final newLocations = List<LocationModel>.from(_filters.locations);
            if (!newLocations.contains(value)) {
              newLocations.add(value);
            }
            _filters = _filters.copyWith(locations: newLocations);
          } else if (value is List<LocationModel>) {
            _filters = _filters.copyWith(locations: value);
          }
          break;
        case 'currentCompanies':
          if (value is CompanyModel) {
            return await addCompany(value);
          } else if (value is List<CompanyModel>) {
            _filters = _filters.copyWith(currentCompanies: value);
          }
          break;
        case 'connectionsOf':
          if (value is String) {
            final newConnections = List<String>.from(_filters.connectionsOf);
            if (!newConnections.contains(value)) {
              newConnections.add(value);
            }
            _filters = _filters.copyWith(connectionsOf: newConnections);
          } else if (value is List<String>) {
            _filters = _filters.copyWith(connectionsOf: value);
          }
          break;
        case 'followersOf':
          if (value is String) {
            final newFollowers = List<String>.from(_filters.followersOf);
            if (!newFollowers.contains(value)) {
              newFollowers.add(value);
            }
            _filters = _filters.copyWith(followersOf: newFollowers);
          } else if (value is List<String>) {
            _filters = _filters.copyWith(followersOf: value);
          }
          break;
        case 'pastCompanies':
          if (value is CompanyModel) {
            final newCompanies = List<CompanyModel>.from(
              _filters.pastCompanies,
            );
            if (!newCompanies.any((c) => c.companyId == value.companyId)) {
              newCompanies.add(value);
            }
            _filters = _filters.copyWith(pastCompanies: newCompanies);
          } else if (value is List<CompanyModel>) {
            _filters = _filters.copyWith(pastCompanies: value);
          }
          break;
        case 'schools':
          if (value is String) {
            final newSchools = List<String>.from(_filters.schools);
            if (!newSchools.contains(value)) {
              newSchools.add(value);
            }
            _filters = _filters.copyWith(schools: newSchools);
          } else if (value is List<String>) {
            _filters = _filters.copyWith(schools: value);
          }
          break;
        case 'industries':
          if (value is CompanyModel) {
            final newIndustries = List<CompanyModel>.from(_filters.industries);
            if (!newIndustries.any((i) => i.companyId == value.companyId)) {
              newIndustries.add(value);
            }
            _filters = _filters.copyWith(industries: newIndustries);
          } else if (value is List<CompanyModel>) {
            _filters = _filters.copyWith(industries: value);
          }
          break;
        case 'firstName':
          if (value is String) {
            _filters = _filters.copyWith(firstName: value);
          }
          break;
        case 'lastName':
          if (value is String) {
            _filters = _filters.copyWith(lastName: value);
          }
          break;
        case 'title':
          if (value is String) {
            _filters = _filters.copyWith(title: value);
          }
          break;
        case 'company':
          if (value is CompanyModel) {
            _filters = _filters.copyWith(company: value);
          }
          break;
        case 'school':
          if (value is String) {
            _filters = _filters.copyWith(school: value);
          }
          break;
        default:
          // For any other fields, use reflection or additional switch cases
          break;
      }

      return _filters;
    } catch (e) {
      print('Error updating filter: $e');
      return _filters;
    }
  }

  @override
  Future<SearchModel> removeFilter({
    required String key,
    required dynamic value,
  }) async {
    try {
      // Remove value based on key
      switch (key) {
        case 'connectionOptions':
          if (value is String) {
            final newOptions = Set<String>.from(_filters.connectionOptions);
            newOptions.remove(value);
            _filters = _filters.copyWith(connectionOptions: newOptions);
          }
          break;
        case 'locations':
          if (value is LocationModel) {
            final newLocations = List<LocationModel>.from(_filters.locations);
            newLocations.remove(value);
            _filters = _filters.copyWith(locations: newLocations);
          }
          break;
        case 'currentCompanies':
          if (value is CompanyModel) {
            return await removeCompany(value);
          }
          break;
        case 'connectionsOf':
          if (value is String) {
            final newConnections = List<String>.from(_filters.connectionsOf);
            newConnections.remove(value);
            _filters = _filters.copyWith(connectionsOf: newConnections);
          }
          break;
        case 'followersOf':
          if (value is String) {
            final newFollowers = List<String>.from(_filters.followersOf);
            newFollowers.remove(value);
            _filters = _filters.copyWith(followersOf: newFollowers);
          }
          break;
        case 'pastCompanies':
          if (value is CompanyModel) {
            final newCompanies =
                _filters.pastCompanies
                    .where((c) => c.companyId != value.companyId)
                    .toList();
            _filters = _filters.copyWith(pastCompanies: newCompanies);
          }
          break;
        case 'schools':
          if (value is String) {
            final newSchools = List<String>.from(_filters.schools);
            newSchools.remove(value);
            _filters = _filters.copyWith(schools: newSchools);
          }
          break;
        case 'industries':
          if (value is CompanyModel) {
            final newIndustries =
                _filters.industries
                    .where((i) => i.companyId != value.companyId)
                    .toList();
            _filters = _filters.copyWith(industries: newIndustries);
          }
          break;
        case 'firstName':
          _filters = _filters.copyWith(firstName: '');
          break;
        case 'lastName':
          _filters = _filters.copyWith(lastName: '');
          break;
        case 'title':
          _filters = _filters.copyWith(title: '');
          break;
        case 'company':
          _filters = _filters.copyWith(company: null);
          break;
        case 'school':
          _filters = _filters.copyWith(school: '');
          break;
        default:
          // For any other fields
          break;
      }

      return _filters;
    } catch (e) {
      print('Error removing filter: $e');
      return _filters;
    }
  }

  @override
  Future<SearchModel> resetFilters() async {
    // Reset to empty filters
    _filters = SearchModel(
      connectionOptions: {},
      locations: [],
      currentCompanies: [],
      connectionsOf: [],
      followersOf: [],
      pastCompanies: [],
      schools: [],
      industries: [],
      profileLanguages: [],
      openTo: [],
      serviceCategories: [],
      firstName: '',
      lastName: '',
      title: '',
      company: null,
      school: '',
    );
    return _filters;
  }
}

// Singleton provider
class SearchFilterRepositoryProvider {
  static final SearchFilterRepository _instance =
      MemorySearchFilterRepository();

  static SearchFilterRepository getRepository() {
    return _instance;
  }
}
