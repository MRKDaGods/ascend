import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/jobs/bloc/jobs_bloc.dart';
import '../../data/models/jobs_model.dart';
import '../widgets/reported_job_card.dart';

class JobsPage extends StatefulWidget {
  const JobsPage({super.key});

  @override
  State<JobsPage> createState() => _JobsPageState();
}

class _JobsPageState extends State<JobsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reported Jobs'),
        automaticallyImplyLeading: false,
      ),
      body: BlocListener<JobsBloc, JobsState>(
        listener: (context, state) {
          if (state is UpdateJobReportStatusEvent) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Report status updated')),
            );
          } else if (state is JobDeletedState) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Job deleted')),
            );
          } else if (state is ReportedJobsErrorState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error: ${state.errorMessage}')),
            );
          }
        },
        child: BlocBuilder<JobsBloc, JobsState>(
          builder: (context, state) {
            if (state is ReportedJobsLoadingState) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is ReportedJobsLoadedState) {
              final jobs = state.reportedJobs;
              final reports = state.jobReports;

              return ListView.builder(
                itemCount: jobs.length,
                itemBuilder: (context, index) {
                  final job = jobs[index];
                  final jobReportList = reports[job.jobId] ?? [];

                  return ReportedJobCard(
                    job: job,
                    reports: jobReportList,
                    onExpand: () {
                      // Optional expansion action
                    },
                  );
                },
              );
            } else if (state is ReportedJobsErrorState) {
              return Center(child: Text('Failed to load jobs: ${state.errorMessage}'));
            } else {
              return const Center(child: Text('No reported jobs found.'));
            }
          },
        ),
      ),
    );
  }
}
