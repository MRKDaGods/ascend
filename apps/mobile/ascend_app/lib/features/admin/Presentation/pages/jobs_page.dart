import 'package:flutter/material.dart';
import '../../data/models/jobs_model.dart';
import '../widgets/reported_job_card.dart';

class JobsPage extends StatelessWidget {
  final List<ReportedJob> jobs;
  final Map<int, List<JobReport>> jobReports;

  const JobsPage({Key? key, required this.jobs, required this.jobReports})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reported Jobs'),
        automaticallyImplyLeading: false,
      ),

      body: ListView.builder(
        itemCount: jobs.length,
        itemBuilder: (context, index) {
          final job = jobs[index];
          final reports = jobReports[job.jobId] ?? [];
          return ReportedJobCard(job: job, reports: reports);
        },
      ),
    );
  }
}
