import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

void main() {
  group('Job Search Tests', () {
    final jobs = [
      Jobsattributes(
        title: 'Software Engineer',
        company: 'Microsoft',
        location: 'Remote',
        experienceLevel: 'Mid',
        salary: 200,
        easyapply: true,
      ),
      Jobsattributes(
        title: 'Data Analyst',
        company: 'Google',
        location: 'Cairo',
        experienceLevel: 'Entry',
        salary: 50,
        easyapply: false,
      ),
      Jobsattributes(
        title: 'Product Manager',
        company: 'Apple',
        location: 'New York',
        experienceLevel: 'Senior',
        salary: 100,
        easyapply: false,
      ),
    ];

    test('Search by job title', () {
      final searchResults =
          jobs
              .where((job) => job.title.toLowerCase().contains('engineer'))
              .toList();
      expect(searchResults.length, 1);
      expect(searchResults.first.title, 'Software Engineer');
    });

    test('Search by company name', () {
      final searchResults =
          jobs
              .where((job) => job.company.toLowerCase().contains('google'))
              .toList();
      expect(searchResults.length, 1);
      expect(searchResults.first.company, 'Google');
    });

    test('Search by location', () {
      final searchResults =
          jobs
              .where((job) => job.location.toLowerCase().contains('new york'))
              .toList();
      expect(searchResults.length, 1);
      expect(searchResults.first.location, 'New York');
    });
  });
}
