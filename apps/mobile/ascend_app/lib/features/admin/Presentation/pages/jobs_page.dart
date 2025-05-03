import 'package:ascend_app/features/admin/Presentation/widgets/reported_job_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/jobs/bloc/jobs_bloc.dart';
import '../../data/models/jobs_model.dart';

class JobsPage extends StatefulWidget {
  const JobsPage({Key? key}) : super(key: key);

  @override
  State<JobsPage> createState() => _JobsPageState();
}

class _JobsPageState extends State<JobsPage> {
  @override
  void initState() {
    super.initState();
    // Fetch reported jobs when page loads
    context.read<JobsBloc>().add(FetchReportedJobsEvent(page: 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reported Jobs')),
      body: BlocConsumer<JobsBloc, JobsState>(
        listener: (context, state) {
          if (state is JobReportStatusUpdatedState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Report status updated to ${state.status}'),
              ),
            );
          } else if (state is JobDeletedState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Job ${state.jobId} deleted successfully'),
              ),
            );
            // Refresh the jobs list after deletion
            context.read<JobsBloc>().add(FetchReportedJobsEvent(page: 1));
          } else if (state is JobsErrorState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Error: ${state.errorMessage}'),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is ReportedJobsLoadingState) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ReportedJobsLoadedState) {
            final jobs = state.reportedJobs;
            final reports = state.jobReports;

            if (jobs.isEmpty) {
              return const Center(child: Text('No reported jobs found'));
            }

            return ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: jobs.length,
              itemBuilder: (context, index) {
                final job = jobs[index] as ReportedJob;
                final jobReportsList = reports[job.jobId] ?? [];

                return ReportedJobCard(
                  job: job,
                  reports: jobReportsList,
                  onExpand: () {
                    // Fetch reports for this specific job when expanded
                    context.read<JobsBloc>().add(
                      FetchJobReportsEvent(job.jobId, page: 1),
                    );
                  },
                  onDelete: () {
                    showDialog(
                      context: context,
                      builder:
                          (dialogContext) => BlocProvider.value(
                            value:
                                context
                                    .read<JobsBloc>(), // Pass the existing bloc
                            child: Builder(
                              builder:
                                  (builderContext) => AlertDialog(
                                    title: const Text('Delete Job'),
                                    content: Text(
                                      'Are you sure you want to delete this job?',
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed:
                                            () => Navigator.pop(dialogContext),
                                        child: const Text('Cancel'),
                                      ),
                                      TextButton(
                                        onPressed: () {
                                          Navigator.pop(dialogContext);
                                          // Use builderContext to ensure proper provider access
                                          builderContext.read<JobsBloc>().add(
                                            DeleteJobEvent(
                                              job.jobId.toString(),
                                            ),
                                          );
                                        },
                                        child: const Text(
                                          'Delete',
                                          style: TextStyle(color: Colors.red),
                                        ),
                                      ),
                                    ],
                                  ),
                            ),
                          ),
                    );
                  },
                );
              },
            );
          } else if (state is JobReportsLoadedState) {
            // This state is used to update the reports for a specific job
            // We need to keep the current UI and just update that specific job's reports
            return BlocBuilder<JobsBloc, JobsState>(
              builder: (context, previousState) {
                // Find the most recent ReportedJobsLoadedState
                final reportedJobsState =
                    (previousState is ReportedJobsLoadedState)
                        ? previousState
                        : context.read<JobsBloc>().state;

                if (reportedJobsState is ReportedJobsLoadedState) {
                  final jobs = reportedJobsState.reportedJobs;
                  final reports = Map<int, List<JobReport>>.from(
                    reportedJobsState.jobReports,
                  );

                  // Update the reports for the specific job
                  reports[state.jobId] = state.jobReports;

                  return ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemCount: jobs.length,
                    itemBuilder: (context, index) {
                      final job = jobs[index] as ReportedJob;
                      final jobReportsList = reports[job.jobId] ?? [];

                      return ReportedJobCard(
                        job: job,
                        reports: jobReportsList,
                        onExpand: () {
                          // Fetch reports for this specific job when expanded
                          context.read<JobsBloc>().add(
                            FetchJobReportsEvent(job.jobId, page: 1),
                          );
                        },
                        onDelete: () {
                          showDialog(
                            context: context,
                            builder:
                                (dialogContext) => BlocProvider.value(
                                  value:
                                      context
                                          .read<
                                            JobsBloc
                                          >(), // Pass the existing bloc
                                  child: Builder(
                                    builder:
                                        (builderContext) => AlertDialog(
                                          title: const Text('Delete Job'),
                                          content: Text(
                                            'Are you sure you want to delete this job?',
                                          ),
                                          actions: [
                                            TextButton(
                                              onPressed:
                                                  () => Navigator.pop(
                                                    dialogContext,
                                                  ),
                                              child: const Text('Cancel'),
                                            ),
                                            TextButton(
                                              onPressed: () {
                                                Navigator.pop(dialogContext);
                                                // Use builderContext to ensure proper provider access
                                                builderContext
                                                    .read<JobsBloc>()
                                                    .add(
                                                      DeleteJobEvent(
                                                        job.jobId.toString(),
                                                      ),
                                                    );
                                              },
                                              child: const Text(
                                                'Delete',
                                                style: TextStyle(
                                                  color: Colors.red,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                  ),
                                ),
                          );
                        },
                      );
                    },
                  );
                }

                // Fallback to empty screen if state is wrong
                return const Center(child: CircularProgressIndicator());
              },
            );
          } else {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Unable to load reported jobs.'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<JobsBloc>().add(
                        FetchReportedJobsEvent(page: 1),
                      );
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }
        },
      ),
    );
  }
}
