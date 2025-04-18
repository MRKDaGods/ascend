import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

void main() {
  group('Job Filtering Tests', () {
    final jobs = [
      Jobsattributes(
        title: 'Software Engineer',
        company: 'Microsoft',
        location: 'Remote',
        experienceLevel: 'Mid',
        createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),
        salaryMinRange: 200,
        easyapply: true,
        isRemote: true,
        salaryMaxRange: 300,
      ),
      Jobsattributes(
        title: 'Data Analyst',
        company: 'Google',
        location: 'Cairo',
        experienceLevel: 'Entry',
        salaryMinRange: 50,
        easyapply: false,
        createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),
        isPartTime: true,
        salaryMaxRange: 300,
      ),
      Jobsattributes(
        title: 'Product Manager',
        company: 'Apple',
        location: 'New York',
        createdAt: DateTime.parse("2025-04-07T22:10:56.615Z"),
        experienceLevel: 'Senior',
        salaryMinRange: 100,
        easyapply: false,
        salaryMaxRange: 300,
      ),
    ];

    test('Filter jobs by remote', () {
      final remoteJobs = jobs.where((job) => job.isRemote == true).toList();
      expect(remoteJobs.length, 1);
      expect(remoteJobs.first.title, 'Software Engineer');
    });

    test('Filter jobs by part-time', () {
      final partTimeJobs = jobs.where((job) => job.isPartTime == true).toList();
      expect(partTimeJobs.length, 1);
      expect(partTimeJobs.first.title, 'Data Analyst');
    });

    test('Filter jobs by easy apply', () {
      final easyApplyJobs = jobs.where((job) => job.easyapply).toList();
      expect(easyApplyJobs.length, 1);
      expect(easyApplyJobs.first.title, 'Software Engineer');
    });
  });
}
