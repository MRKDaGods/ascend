import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:ascend_app/features/networks/model/location_model.dart';

class SearchModel {
  final Set<String> connectionOptions;
  final List<LocationModel> locations;
  final List<CompanyModel> currentCompanies;
  final List<String> connectionsOf;
  final List<String> followersOf;
  final List<CompanyModel> pastCompanies;
  final List<String> schools;
  final List<CompanyModel> industries;
  final List<String> profileLanguages;
  final List<String> openTo;
  final List<String> serviceCategories;
  String firstName;
  String lastName;
  String title;
  CompanyModel? company;
  String school;

  SearchModel({
    required this.connectionOptions,
    required this.locations,
    required this.currentCompanies,
    required this.connectionsOf,
    required this.followersOf,
    required this.pastCompanies,
    required this.schools,
    required this.industries,
    required this.profileLanguages,
    required this.openTo,
    required this.serviceCategories,
    required this.firstName,
    required this.lastName,
    required this.title,
    required this.company,
    required this.school,
  });

  factory SearchModel.fromJson(Map<String, dynamic> json) {
    return SearchModel(
      connectionOptions: Set<String>.from(json['connectionOptions']),
      locations: List<LocationModel>.from(json['locations']),
      currentCompanies: List<CompanyModel>.from(json['currentCompanies']),
      connectionsOf: List<String>.from(json['connectionsOf']),
      followersOf: List<String>.from(json['followersOf']),
      pastCompanies: List<CompanyModel>.from(json['pastCompanies']),
      schools: List<String>.from(json['schools']),
      industries: List<CompanyModel>.from(json['industries']),
      profileLanguages: List<String>.from(json['profileLanguages']),
      openTo: List<String>.from(json['openTo']),
      serviceCategories: List<String>.from(json['serviceCategories']),
      firstName: json['firstName'],
      lastName: json['lastName'],
      title: json['title'],
      company: json['company'],
      school: json['school'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'connectionOptions': connectionOptions,
      'locations': locations,
      'currentCompanies': currentCompanies,
      'connectionsOf': connectionsOf,
      'followersOf': followersOf,
      'pastCompanies': pastCompanies,
      'schools': schools,
      'industries': industries,
      'profileLanguages': profileLanguages,
      'openTo': openTo,
      'serviceCategories': serviceCategories,
      'firstName': firstName,
      'lastName': lastName,
      'title': title,
      'company': company,
      'school': school,
    };
  }

  SearchModel.defaultModel()
    : connectionOptions = {"1st"},
      locations = [],
      currentCompanies = [],
      connectionsOf = [],
      followersOf = [],
      pastCompanies = [],
      schools = [],
      industries = [],
      profileLanguages = [],
      openTo = [],
      serviceCategories = [],
      firstName = '',
      lastName = '',
      title = '',
      company = null,
      school = '';

  SearchModel copyWith({
    Set<String>? connectionOptions,
    List<LocationModel>? locations,
    List<CompanyModel>? currentCompanies,
    List<String>? connectionsOf,
    List<String>? followersOf,
    List<CompanyModel>? pastCompanies,
    List<String>? schools,
    List<CompanyModel>? industries,
    List<String>? profileLanguages,
    List<String>? openTo,
    List<String>? serviceCategories,
    String? firstName,
    String? lastName,
    String? title,
    CompanyModel? company,
    String? school,
  }) {
    return SearchModel(
      connectionOptions: connectionOptions ?? this.connectionOptions,
      locations: locations ?? this.locations,
      currentCompanies: currentCompanies ?? this.currentCompanies,
      connectionsOf: connectionsOf ?? this.connectionsOf,
      followersOf: followersOf ?? this.followersOf,
      pastCompanies: pastCompanies ?? this.pastCompanies,
      schools: schools ?? this.schools,
      industries: industries ?? this.industries,
      profileLanguages: profileLanguages ?? this.profileLanguages,
      openTo: openTo ?? this.openTo,
      serviceCategories: serviceCategories ?? this.serviceCategories,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      title: title ?? this.title,
      company: company ?? this.company,
      school: school ?? this.school,
    );
  }
}
