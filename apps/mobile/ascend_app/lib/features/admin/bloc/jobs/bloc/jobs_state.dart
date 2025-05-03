part of 'jobs_bloc.dart';

@immutable
sealed class JobsState {}

final class JobsInitial extends JobsState {}

final class ReportedJobsLoadingState extends JobsState {}

final class ReportedJobsLoadedState extends JobsState {
  final List<dynamic> reportedJobs;
  final Map<int, List<JobReport>> jobReports; // Ensure this property exists

  ReportedJobsLoadedState({
    required this.reportedJobs,
    required this.jobReports,
  });
}

final class JobReportsLoadedState extends JobsState {
  final int jobId;
  final List<JobReport> jobReports;

  JobReportsLoadedState({required this.jobId, required this.jobReports});
}

final class JobDeletedState extends JobsState {
  final String jobId;

  JobDeletedState(this.jobId);
}

final class JobReportStatusUpdatedState extends JobsState {
  final String reportId;
  final String status;

  JobReportStatusUpdatedState(this.reportId, this.status);
}

final class JobsErrorState extends JobsState {
  final String errorMessage;

  JobsErrorState(this.errorMessage);
}

// New state for errors related to specific reported jobs
final class ReportedJobsErrorState extends JobsState {
  final String jobId;
  final String errorMessage;

  ReportedJobsErrorState({required this.jobId, required this.errorMessage});
}
