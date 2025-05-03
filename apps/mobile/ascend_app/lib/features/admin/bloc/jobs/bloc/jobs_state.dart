part of 'jobs_bloc.dart';

@immutable
abstract class JobsState {}

final class JobsInitial extends JobsState {}

final class ReportedJobsInitialState extends JobsState {}

final class ReportedJobsLoadingState extends JobsState {}

final class ReportedJobsLoadedState extends JobsState {
  final List<ReportedJob> jobs;
  final bool hasReachedEnd;
  final Map<int, List<JobReport>> jobReports; // Keeping the existing property

  ReportedJobsLoadedState({
    required this.jobs,
    required this.hasReachedEnd,
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

  @override
  List<Object?> get props => [jobId];
}

final class JobReportStatusUpdatedState extends JobsState {
  final String reportId;
  final String status;

  JobReportStatusUpdatedState(this.reportId, this.status);
}

final class JobsErrorState extends JobsState {
  final String message;

  JobsErrorState(this.message);
}

// Add the EndOfDataReachedState class
final class EndOfDataReachedState extends JobsState {}

// For deleting jobs
final class JobsDeletingState extends JobsState {}
