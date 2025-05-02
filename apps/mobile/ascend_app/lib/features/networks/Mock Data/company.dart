import 'package:ascend_app/features/networks/model/company_model.dart';

List<CompanyModel> getAllCompanies() {
  return [
    CompanyModel(
      companyId: '1',
      companyName: 'Google',
      companyLogoUrl: 'assets/google.png',
      companyDescription:
          'A multinational technology company specializing in Internet-related services and products.',
      companyLocation: 'Mountain View, CA',
      companyIndustry: 'Technology',
      companyCreatedAt: DateTime.now(),
      companyCreatedBy: 'user1',
    ),
    CompanyModel(
      companyId: '2',
      companyName: 'Facebook',
      companyLogoUrl: 'assets/facebook.png',
      companyDescription:
          'A social media and technology company that connects people around the world.',
      companyLocation: 'Menlo Park, CA',
      companyIndustry: 'Social Media',
      companyCreatedAt: DateTime.now(),
      companyCreatedBy: 'user2',
    ),
    CompanyModel(
      companyId: '3',
      companyName: 'Amazon',
      companyLogoUrl: 'assets/aws.png',
      companyDescription:
          'An e-commerce and cloud computing company that offers a wide range of products and services.',
      companyLocation: 'Seattle, WA',
      companyIndustry: 'E-commerce',
      companyCreatedAt: DateTime.now(),
      companyCreatedBy: 'user3',
    ),
    CompanyModel(
      companyId: '4',
      companyName: 'Apple',
      companyLogoUrl: 'assets/apple-logo.png',
      companyDescription:
          'A technology company that designs, manufactures, and sells consumer electronics and software.',
      companyLocation: 'Cupertino, CA',
      companyIndustry: 'Technology',
      companyCreatedAt: DateTime.now(),
      companyCreatedBy: 'user4',
    ),
    CompanyModel(
      companyId: '5',
      companyName: 'Microsoft',
      companyLogoUrl: 'assets/microsoft.png',
      companyDescription:
          'A technology company that develops, licenses, and supports a wide range of software products and services.',
      companyLocation: 'Redmond, WA',
      companyIndustry: 'Technology',
      companyCreatedAt: DateTime.now(),
      companyCreatedBy: 'user5',
    ),
    CompanyModel(
      companyId: '6',
      companyName: 'Netflix',
      companyLogoUrl: 'assets/netflix.png',
      companyDescription:
          'A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more.',
      companyLocation: 'Los Gatos, CA',
      companyIndustry: 'Entertainment',
      companyCreatedAt: DateTime.now(),
      companyCreatedBy: 'user6',
    ),
    CompanyModel(
      companyId: '7',
      companyName: 'Tesla',
      companyLogoUrl: 'assets/tesla.png',
      companyDescription:
          'An electric vehicle and clean energy company that designs and manufactures electric cars, battery energy storage, and solar products.',
      companyLocation: 'Palo Alto, CA',
      companyIndustry: 'Automotive',
      companyCreatedAt: DateTime.now(),
      companyCreatedBy: 'user7',
    ),
  ];
}

List<CompanyModel> searchCompanies(String query) {
  final allCompanies = getAllCompanies();
  return allCompanies
      .where(
        (company) =>
            company.companyName.toLowerCase().contains(query.toLowerCase()),
      )
      .toList();
}

CompanyModel getCompanyById(String id) {
  final allCompanies = getAllCompanies();
  return allCompanies.firstWhere((company) => company.companyId == id);
}
