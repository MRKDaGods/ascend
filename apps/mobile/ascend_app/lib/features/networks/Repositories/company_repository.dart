import 'package:ascend_app/features/networks/Mock%20Data/company.dart'
    as company_data;
import 'package:ascend_app/features/networks/model/company_model.dart';

abstract class CompanyRepository {
  Future<List<CompanyModel>> getAllCompanies();
  Future<List<CompanyModel>> searchCompanies(String query);
  Future<CompanyModel> getCompanyById(String id);
}

class MockCompanyRepository implements CompanyRepository {
  @override
  Future<List<CompanyModel>> getAllCompanies() async {
    return Future.value(company_data.getAllCompanies());
  }

  @override
  Future<List<CompanyModel>> searchCompanies(String query) async {
    return Future.value(company_data.searchCompanies(query));
  }

  @override
  Future<CompanyModel> getCompanyById(String id) async {
    return Future.value(company_data.getCompanyById(id));
  }
}

// This can be switched later to a real API implementation
