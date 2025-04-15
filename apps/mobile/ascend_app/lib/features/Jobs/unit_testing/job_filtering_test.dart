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
        salary: 200,
        easyapply: true,
        isRemote: true,
      ),
      Jobsattributes(
        title: 'Data Analyst',
        company: 'Google',
        location: 'Cairo',
        experienceLevel: 'Entry',
        salary: 50,
        easyapply: false,
        isPartTime: true,
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
