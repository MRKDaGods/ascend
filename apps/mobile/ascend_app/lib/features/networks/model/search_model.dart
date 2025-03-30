class SearchModel {
  final Set<String> connectionOptions;
  final List<String> locations;
  final List<String> currentCompanies;
  final List<String> connectionsOf;
  final List<String> followersOf;
  final List<String> pastCompanies;
  final List<String> schools;
  final List<String> industries;
  final List<String> profileLanguages;
  final List<String> openTo;
  final List<String> serviceCategories;
  String firstName;
  String lastName;
  String title;
  String company;
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
      locations: List<String>.from(json['locations']),
      currentCompanies: List<String>.from(json['currentCompanies']),
      connectionsOf: List<String>.from(json['connectionsOf']),
      followersOf: List<String>.from(json['followersOf']),
      pastCompanies: List<String>.from(json['pastCompanies']),
      schools: List<String>.from(json['schools']),
      industries: List<String>.from(json['industries']),
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
      company = '',
      school = '';

  SearchModel copyWith({
    Set<String>? connectionOptions,
    List<String>? locations,
    List<String>? currentCompanies,
    List<String>? connectionsOf,
    List<String>? followersOf,
    List<String>? pastCompanies,
    List<String>? schools,
    List<String>? industries,
    List<String>? profileLanguages,
    List<String>? openTo,
    List<String>? serviceCategories,
    String? firstName,
    String? lastName,
    String? title,
    String? company,
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

  void updateFilters(String key, dynamic value) {
    switch (key) {
      case 'connectionOptions':
        connectionOptions.clear();
        connectionOptions.addAll(value);
        break;
      case 'locations':
        locations.add(value);
        break;
      case 'currentCompanies':
        currentCompanies.add(value);
        break;
      case 'connectionsOf':
        connectionsOf.add(value);
        break;
      case 'followersOf':
        followersOf.add(value);
        break;
      case 'pastCompanies':
        pastCompanies.add(value);
        break;
      case 'schools':
        schools.add(value);
        break;
      case 'industries':
        industries.add(value);
        break;
      case 'profileLanguages':
        profileLanguages.add(value);
        break;
      case 'openTo':
        openTo.add(value);
        break;
      case 'serviceCategories':
        serviceCategories.add(value);
        break;

      case 'firstName':
        firstName = value;
        break;
      case 'lastName':
        lastName = value;
        break;
      case 'title':
        title = value;
        break;
      case 'company':
        company = value;
        break;
      case 'school':
        school = value;
        break;
      default:
        break;
    }
  }

  void clearFilters(String key) {
    switch (key) {
      case 'connectionOptions':
        connectionOptions.clear();
        break;
      case 'locations':
        locations.clear();
        break;
      case 'currentCompanies':
        currentCompanies.clear();
        break;
      case 'connectionsOf':
        connectionsOf.clear();
        break;
      case 'followersOf':
        followersOf.clear();
        break;
      case 'pastCompanies':
        pastCompanies.clear();
        break;
      case 'schools':
        schools.clear();
        break;
      case 'industries':
        industries.clear();
        break;
      case 'profileLanguages':
        profileLanguages.clear();
        break;
      case 'openTo':
        openTo.clear();
        break;
      case 'serviceCategories':
        serviceCategories.clear();
        break;
      case 'firstName':
        firstName = '';
        break;
      case 'lastName':
        lastName = '';
        break;
      case 'title':
        title = '';
        break;
      case 'company':
        company = '';
        break;
      case 'school':
        school = '';
        break;
      default:
        break;
    }
  }

  void resetFilters() {
    connectionOptions.clear();
    locations.clear();
    currentCompanies.clear();
    connectionsOf.clear();
    followersOf.clear();
    pastCompanies.clear();
    schools.clear();
    industries.clear();
    profileLanguages.clear();
    openTo.clear();
    serviceCategories.clear();
    firstName = '';
    lastName = '';
    title = '';
    company = '';
    school = '';
  }

  void removeFilter(String key, dynamic value) {
    switch (key) {
      case 'connectionOptions':
        connectionOptions.remove(value);
        break;
      case 'locations':
        locations.remove(value);
        break;
      case 'currentCompanies':
        currentCompanies.remove(value);
        break;
      case 'connectionsOf':
        connectionsOf.remove(value);
        break;
      case 'followersOf':
        followersOf.remove(value);
        break;
      case 'pastCompanies':
        pastCompanies.remove(value);
        break;
      case 'schools':
        schools.remove(value);
        break;
      case 'industries':
        industries.remove(value);
        break;
      case 'profileLanguages':
        profileLanguages.remove(value);
        break;
      case 'openTo':
        openTo.remove(value);
        break;
      case 'serviceCategories':
        serviceCategories.remove(value);
        break;
      case 'firstName':
        firstName = '';
        break;
      case 'lastName':
        lastName = '';
        break;
      case 'title':
        title = '';
        break;
      case 'company':
        company = '';
        break;
      case 'school':
        school = '';
        break;

      default:
        break;
    }
  }
}
